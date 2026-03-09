import { NextResponse } from 'next/server';
import { getOrderByCode } from '@/lib/data/orders';

export async function GET(_request: Request, { params }: { params: Promise<{ orderCode: string }> }) {
  const { orderCode } = await params;
  const order = await getOrderByCode(orderCode);
  if (!order) {
    return NextResponse.json({ error: 'Order not found' }, { status: 404 });
  }
  return NextResponse.json({
    orderCode: order.orderCode,
    status: order.orderStatus,
    paymentStatus: order.paymentStatus,
    total: Number(order.total),
    deliveryFee: Number(order.deliveryFee),
    createdAt: order.createdAt,
    items: order.items.map((item) => ({
      name: item.product.name,
      quantity: item.quantity,
    })),
  });
}
