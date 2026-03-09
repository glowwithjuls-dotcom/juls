import { NextResponse } from 'next/server';
import { z } from 'zod';
import { checkoutSchema } from '@/lib/validators';
import { prisma } from '@/lib/prisma';
import { getDeliveryZones } from '@/lib/delivery';
import { generateOrderCode } from '@/lib/order';
import { initializePaystackTransaction } from '@/lib/paystack';
import { getSiteSettings } from '@/lib/data/settings';

const cartSchema = z.array(
  z.object({
    productId: z.string(),
    quantity: z.number().int().positive(),
  }),
);

export async function POST(request: Request) {
  const payload = await request.json();
  const customerResult = checkoutSchema.safeParse(payload.customer);
  const cartResult = cartSchema.safeParse(payload.cartItems);

  if (!customerResult.success || !cartResult.success) {
    return NextResponse.json({ error: 'Invalid checkout payload' }, { status: 400 });
  }

  const customerInput = customerResult.data;
  const cartItems = cartResult.data;
  if (!cartItems.length) {
    return NextResponse.json({ error: 'Cart cannot be empty' }, { status: 400 });
  }

  const productIds = cartItems.map((item) => item.productId);
  const products = await prisma.product.findMany({ where: { id: { in: productIds } } });
  if (products.length !== productIds.length) {
    return NextResponse.json({ error: 'Some products are unavailable' }, { status: 400 });
  }

  const insufficientStock = cartItems.filter((cartItem) => {
    const product = products.find((item) => item.id === cartItem.productId);
    return !product || product.stockQuantity < cartItem.quantity;
  });

  if (insufficientStock.length) {
    return NextResponse.json({ error: 'Not enough stock for selected items' }, { status: 400 });
  }

  const subtotal = cartItems.reduce((sum, item) => {
    const product = products.find((entry) => entry.id === item.productId)!;
    return sum + Number(product.price) * item.quantity;
  }, 0);

  const zones = await getDeliveryZones();
  const zone = zones.find((entry) =>
    entry.regions.some((region) => region.toLowerCase() === customerInput.region.toLowerCase()),
  );
  const deliveryFee = zone?.fee ?? zones[0]?.fee ?? 25;
  const total = subtotal + deliveryFee;
  const orderCode = generateOrderCode();
  const settings = await getSiteSettings();

  if (customerInput.paymentMethod === 'PAY_ON_DELIVERY' && !settings.allowPayOnDelivery) {
    return NextResponse.json({ error: 'Pay on delivery is currently disabled.' }, { status: 400 });
  }

  const order = await prisma.$transaction(async (tx) => {
    const customer = await tx.customer.upsert({
      where: { phone: customerInput.phone },
      update: {
        fullName: customerInput.fullName,
        email: customerInput.email && customerInput.email.length ? customerInput.email : null,
        region: customerInput.region,
        city: customerInput.city,
        address: customerInput.address,
      },
      create: {
        fullName: customerInput.fullName,
        phone: customerInput.phone,
        email: customerInput.email && customerInput.email.length ? customerInput.email : null,
        region: customerInput.region,
        city: customerInput.city,
        address: customerInput.address,
      },
    });

    const createdOrder = await tx.order.create({
      data: {
        orderCode,
        customerId: customer.id,
        subtotal,
        deliveryFee,
        total,
        paymentMethod: customerInput.paymentMethod,
        paymentStatus: 'PENDING',
        orderStatus: 'PENDING',
        deliveryZoneId: zone?.id,
        allowPayOnDelivery: customerInput.paymentMethod === 'PAY_ON_DELIVERY',
        notes: customerInput.notes || null,
        items: {
          create: cartItems.map((item) => ({
            productId: item.productId,
            quantity: item.quantity,
            unitPrice: Number(products.find((entry) => entry.id === item.productId)!.price),
          })),
        },
      },
    });

    await Promise.all(
      cartItems.map((item) =>
        tx.product.update({
          where: { id: item.productId },
          data: { stockQuantity: { decrement: item.quantity } },
        }),
      ),
    );

    return createdOrder;
  });

  if (customerInput.paymentMethod === 'PAY_ON_DELIVERY') {
    return NextResponse.json({
      orderCode: order.orderCode,
      message: 'Order placed with pay on delivery. A team member will confirm shortly.',
    });
  }

  try {
    const paystack = await initializePaystackTransaction({
      amountInGhs: total,
      email: customerInput.email && customerInput.email.length ? customerInput.email : 'glowwithjuls@gmail.com',
      reference: order.orderCode,
      metadata: {
        orderId: order.id,
        orderCode: order.orderCode,
        name: customerInput.fullName,
        phone: customerInput.phone,
      },
    });

    if (paystack?.data?.reference) {
      await prisma.order.update({
        where: { id: order.id },
        data: { paystackReference: paystack.data.reference },
      });
    }

    return NextResponse.json({
      orderCode: order.orderCode,
      paymentUrl: paystack?.data?.authorization_url,
      message: 'Redirecting to Paystack',
    });
  } catch (error) {
    console.error('Paystack init failed', error);
    return NextResponse.json({ error: 'Unable to initialize Paystack payment' }, { status: 500 });
  }
}
