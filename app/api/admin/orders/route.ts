import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { requireAdminSession } from '@/lib/auth-helpers';

export async function GET() {
  await requireAdminSession();
  const orders = await prisma.order.findMany({
    orderBy: { createdAt: 'desc' },
    include: { customer: true, items: { include: { product: true } }, deliveryZone: true },
  });
  return NextResponse.json(orders);
}
