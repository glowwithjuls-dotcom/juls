import type { Metadata } from 'next';
import { prisma } from '@/lib/prisma';
import { OrdersManager } from '@/components/admin/orders-manager';

export const dynamic = 'force-dynamic';
export const metadata: Metadata = {
  title: 'Admin Orders',
  description: 'Review, update, and export customer orders.',
};

export default async function AdminOrdersPage() {
  const orders = await prisma.order.findMany({
    orderBy: { createdAt: 'desc' },
    include: { customer: true, items: { include: { product: true } }, deliveryZone: true },
  });
  const serialized = orders.map((order) => ({
    ...order,
    subtotal: Number(order.subtotal),
    deliveryFee: Number(order.deliveryFee),
    total: Number(order.total),
    items: order.items.map((item) => ({ ...item, unitPrice: Number(item.unitPrice) })),
  }));
  return <OrdersManager orders={serialized} />;
}
