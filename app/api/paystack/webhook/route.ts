import { NextResponse } from 'next/server';
import crypto from 'node:crypto';
import { prisma } from '@/lib/prisma';

export async function POST(request: Request) {
  const secret = process.env.PAYSTACK_WEBHOOK_SECRET;
  if (!secret) {
    return NextResponse.json({ error: 'Webhook secret missing' }, { status: 500 });
  }

  const rawBody = await request.text();
  const signature = request.headers.get('x-paystack-signature') ?? '';
  const computed = crypto.createHmac('sha512', secret).update(rawBody).digest('hex');

  if (computed !== signature) {
    return NextResponse.json({ error: 'Invalid signature' }, { status: 401 });
  }

  const payload = JSON.parse(rawBody);
  const reference = payload.data?.reference as string | undefined;
  const orderCode = payload.data?.metadata?.orderCode as string | undefined;
  if (!reference) {
    return NextResponse.json({ received: true });
  }

  if (payload.event === 'charge.success') {
    await prisma.order.updateMany({
      where: {
        OR: [{ paystackReference: reference }, { orderCode: orderCode ?? reference }],
      },
      data: {
        paymentStatus: 'SUCCESS',
        orderStatus: 'CONFIRMED',
      },
    });
  }

  return NextResponse.json({ received: true });
}
