'use client';

import { useState } from 'react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { formatCurrency } from '@/lib/utils';

interface OrderSummary {
  orderCode: string;
  status: string;
  paymentStatus: string;
  total: number;
  deliveryFee: number;
  createdAt: string;
  items: Array<{ name: string; quantity: number }>;
}

export function OrderTracker({ initialCode = '' }: { initialCode?: string }) {
  const [orderCode, setOrderCode] = useState(initialCode);
  const [order, setOrder] = useState<OrderSummary | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const lookup = async () => {
    if (!orderCode) return;
    setLoading(true);
    setError(null);

    try {
      const response = await fetch(`/api/orders/${orderCode}`);
      if (!response.ok) {
        throw new Error('Not found');
      }
      const data = await response.json();
      setOrder(data);
    } catch {
      setOrder(null);
      setError('Order not found. Please confirm your code.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex gap-3">
        <Input value={orderCode} onChange={(event) => setOrderCode(event.target.value)} placeholder="e.g. JULS-2603-AB123" />
        <Button onClick={lookup} disabled={loading}>
          {loading ? 'Checking...' : 'Track'}
        </Button>
      </div>

      {error && <p className="text-sm text-red-500">{error}</p>}

      {order && (
        <div className="rounded-3xl border border-gray-100 bg-white p-6 shadow-card">
          <p className="text-sm text-gray-500">Order code</p>
          <p className="text-xl font-semibold text-charcoal">{order.orderCode}</p>
          <div className="mt-4 grid gap-4 text-sm md:grid-cols-3">
            <div>
              <p className="text-gray-500">Status</p>
              <p className="font-semibold text-charcoal">{order.status}</p>
            </div>
            <div>
              <p className="text-gray-500">Payment</p>
              <p className="font-semibold text-charcoal">{order.paymentStatus}</p>
            </div>
            <div>
              <p className="text-gray-500">Total</p>
              <p className="font-semibold text-charcoal">{formatCurrency(order.total)}</p>
            </div>
          </div>
          <div className="mt-4">
            <p className="text-sm font-semibold text-gray-600">Items</p>
            <ul className="mt-2 list-disc space-y-1 pl-4 text-sm">
              {order.items.map((item) => (
                <li key={item.name}>
                  {item.name} x {item.quantity}
                </li>
              ))}
            </ul>
          </div>
        </div>
      )}
    </div>
  );
}
