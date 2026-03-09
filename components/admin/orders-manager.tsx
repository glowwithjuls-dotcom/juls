'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { formatCurrency } from '@/lib/utils';
import { toast } from 'react-hot-toast';

const orderStatusOptions = ['PENDING', 'CONFIRMED', 'DISPATCHED', 'DELIVERED', 'CANCELLED'] as const;
const paymentStatusOptions = ['PENDING', 'SUCCESS', 'FAILED'] as const;

interface Order {
  id: string;
  orderCode: string;
  customer: { fullName: string; phone: string };
  total: number;
  orderStatus: string;
  paymentStatus: string;
}

export function OrdersManager({ orders }: { orders: Order[] }) {
  const [rows, setRows] = useState(orders);
  const [savingOrderId, setSavingOrderId] = useState<string | null>(null);

  const updateOrder = async (id: string, data: Partial<Order>) => {
    setSavingOrderId(id);
    const response = await fetch(`/api/admin/orders/${id}`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
    });
    setSavingOrderId(null);

    if (!response.ok) {
      toast.error('Update failed');
      return;
    }

    setRows((current) => current.map((order) => (order.id === id ? { ...order, ...data } : order)));
    toast.success('Order updated');
  };

  const exportCsv = async () => {
    const response = await fetch('/api/admin/orders/export');
    if (!response.ok) {
      toast.error('Export failed');
      return;
    }

    const blob = await response.blob();
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = 'orders.csv';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  return (
    <div className="space-y-4 rounded-3xl border border-gray-200 bg-white p-6 shadow-card">
      <div className="flex items-center justify-between">
        <h2 className="font-semibold text-charcoal">Orders</h2>
        <Button variant="outline" onClick={exportCsv}>
          Export CSV
        </Button>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full text-sm">
          <thead>
            <tr className="text-left text-gray-500">
              <th className="py-2">Code</th>
              <th>Customer</th>
              <th>Total</th>
              <th>Status</th>
              <th>Payment</th>
            </tr>
          </thead>
          <tbody>
            {rows.map((order) => (
              <tr key={order.id} className="border-t border-gray-100">
                <td className="py-3 font-semibold">{order.orderCode}</td>
                <td>
                  <div className="font-medium text-charcoal">{order.customer.fullName}</div>
                  <div className="text-xs text-gray-500">{order.customer.phone}</div>
                </td>
                <td>{formatCurrency(order.total)}</td>
                <td>
                  <select
                    className="rounded-lg border border-gray-200 px-2 py-1"
                    value={order.orderStatus}
                    onChange={(event) => updateOrder(order.id, { orderStatus: event.target.value })}
                    disabled={savingOrderId === order.id}
                  >
                    {orderStatusOptions.map((status) => (
                      <option key={status} value={status}>
                        {status}
                      </option>
                    ))}
                  </select>
                </td>
                <td>
                  <select
                    className="rounded-lg border border-gray-200 px-2 py-1"
                    value={order.paymentStatus}
                    onChange={(event) => updateOrder(order.id, { paymentStatus: event.target.value })}
                    disabled={savingOrderId === order.id}
                  >
                    {paymentStatusOptions.map((status) => (
                      <option key={status} value={status}>
                        {status}
                      </option>
                    ))}
                  </select>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {!rows.length && <p className="text-sm text-gray-500">No orders yet.</p>}
    </div>
  );
}
