import { NextResponse } from 'next/server';
import { verifyPaystack } from '@/lib/paystack';
import { prisma } from '@/lib/prisma';

export async function POST(request: Request) {
  const { reference } = await request.json();
  if (!reference) {
    return NextResponse.json({ error: 'Missing reference' }, { status: 400 });
  }

  const result = await verifyPaystack(reference);
  if (result.data?.status === 'success') {
    await prisma.order.updateMany({
      where: {
        OR: [{ paystackReference: reference }, { orderCode: result.data?.metadata?.orderCode ?? reference }],
      },
      data: {
        paymentStatus: 'SUCCESS',
        orderStatus: 'CONFIRMED',
      },
    });
  }

  return NextResponse.json({ status: result.data?.status, orderCode: result.data?.metadata?.orderCode ?? reference });
}
