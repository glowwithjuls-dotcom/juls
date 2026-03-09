import 'server-only';
import { prisma } from '@/lib/prisma';

export async function getOrderByCode(orderCode: string) {
  return prisma.order.findUnique({
    where: { orderCode },
    include: {
      customer: true,
      items: { include: { product: true } },
      deliveryZone: true,
    },
  });
}

export async function listRecentOrders(limit = 10) {
  return prisma.order.findMany({
    orderBy: { createdAt: 'desc' },
    take: limit,
    include: { customer: true },
  });
}

export async function listOrdersWithFilters(params: { status?: string } = {}) {
  return prisma.order.findMany({
    where: {
      orderStatus: params.status?.toUpperCase() as any,
    },
    orderBy: { createdAt: 'desc' },
    include: { customer: true, items: { include: { product: true } }, deliveryZone: true },
  });
}
