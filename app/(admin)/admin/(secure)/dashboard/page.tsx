import type { Metadata } from 'next';
import { prisma } from '@/lib/prisma';
import { formatCurrency } from '@/lib/utils';
import Link from 'next/link';

export const dynamic = 'force-dynamic';
export const metadata: Metadata = {
  title: 'Admin Dashboard',
  description: 'Manage orders, stock, and performance metrics.',
};

export default async function AdminDashboardPage() {
  const [orders, lowStock] = await Promise.all([
    prisma.order.findMany({
      orderBy: { createdAt: 'desc' },
      take: 6,
      include: { customer: true },
    }),
    prisma.product.findMany({ where: { stockQuantity: { lt: 10 } }, orderBy: { stockQuantity: 'asc' }, take: 5 }),
  ]);

  const totalRevenue = await prisma.order.aggregate({
    _sum: { total: true },
    where: { paymentStatus: 'SUCCESS' },
  });
  const pending = await prisma.order.count({ where: { orderStatus: 'PENDING' } });
  const dispatched = await prisma.order.count({ where: { orderStatus: 'DISPATCHED' } });

  return (
    <div className="space-y-8">
      <div className="grid gap-4 md:grid-cols-3">
        <div className="rounded-3xl border border-gray-200 bg-white p-6">
          <p className="text-sm text-gray-500">Paid revenue</p>
          <p className="text-3xl font-semibold text-charcoal">{formatCurrency(Number(totalRevenue._sum.total ?? 0))}</p>
        </div>
        <div className="rounded-3xl border border-gray-200 bg-white p-6">
          <p className="text-sm text-gray-500">Pending orders</p>
          <p className="text-3xl font-semibold text-charcoal">{pending}</p>
        </div>
        <div className="rounded-3xl border border-gray-200 bg-white p-6">
          <p className="text-sm text-gray-500">Out for delivery</p>
          <p className="text-3xl font-semibold text-charcoal">{dispatched}</p>
        </div>
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        <div className="rounded-3xl border border-gray-200 bg-white p-6">
          <div className="flex items-center justify-between">
            <p className="font-semibold text-charcoal">Recent orders</p>
            <Link href="/admin/orders" className="text-sm text-brand">
              View all
            </Link>
          </div>
          <div className="mt-4 space-y-3 text-sm">
            {orders.map((order) => (
              <div key={order.id} className="flex items-center justify-between rounded-2xl bg-slate-50 px-4 py-3">
                <div>
                  <p className="font-semibold text-charcoal">{order.orderCode}</p>
                  <p className="text-gray-500">{order.customer.fullName}</p>
                </div>
                <div className="text-right">
                  <p className="font-semibold text-charcoal">{formatCurrency(Number(order.total))}</p>
                  <p className="text-xs text-gray-500">{order.orderStatus}</p>
                </div>
              </div>
            ))}
            {!orders.length && <p className="text-gray-500">No orders yet.</p>}
          </div>
        </div>
        <div className="rounded-3xl border border-gray-200 bg-white p-6">
          <div className="flex items-center justify-between">
            <p className="font-semibold text-charcoal">Low stock</p>
            <Link href="/admin/products" className="text-sm text-brand">
              Manage inventory
            </Link>
          </div>
          <div className="mt-4 space-y-2 text-sm">
            {lowStock.map((product) => (
              <div key={product.id} className="flex items-center justify-between">
                <p className="font-medium text-gray-700">{product.name}</p>
                <p className="font-semibold text-red-500">{product.stockQuantity} units</p>
              </div>
            ))}
            {!lowStock.length && <p className="text-gray-500">All products in good stock.</p>}
          </div>
        </div>
      </div>
    </div>
  );
}
