'use client';

import { useMemo, useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { checkoutSchema } from '@/lib/validators';
import { z } from 'zod';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Button } from '@/components/ui/button';
import { useCartStore, useCartTotals } from '@/stores/cart-store';
import { formatCurrency } from '@/lib/utils';
import { toast } from 'react-hot-toast';
import { useRouter } from 'next/navigation';

interface CheckoutFormProps {
  zones: Array<{ id: string; zone: string; regions: string[]; fee: number }>;
  allowPayOnDelivery: boolean;
}

type FormValues = z.infer<typeof checkoutSchema>;

export function CheckoutForm({ zones, allowPayOnDelivery }: CheckoutFormProps) {
  const router = useRouter();
  const { subtotal } = useCartTotals();
  const items = useCartStore((state) => state.items);
  const clearCart = useCartStore((state) => state.clear);
  const [loading, setLoading] = useState(false);

  const form = useForm<FormValues>({
    resolver: zodResolver(checkoutSchema),
    defaultValues: {
      fullName: '',
      phone: '',
      email: '',
      region: '',
      city: '',
      address: '',
      paymentMethod: 'MOBILE_MONEY',
      notes: '',
    },
  });

  const region = form.watch('region');
  const zone = useMemo(
    () => zones.find((entry) => entry.regions.some((item) => item.toLowerCase() === region.toLowerCase())),
    [region, zones],
  );
  const deliveryFee = zone?.fee ?? zones[0]?.fee ?? 0;
  const total = subtotal + deliveryFee;

  const onSubmit = form.handleSubmit(async (values) => {
    if (!items.length) {
      toast.error('Your cart is empty.');
      return;
    }

    setLoading(true);
    try {
      const response = await fetch('/api/checkout', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          customer: values,
          cartItems: items.map((item) => ({ productId: item.productId, quantity: item.quantity })),
        }),
      });

      if (!response.ok) {
        const body = await response.json().catch(() => ({}));
        throw new Error(body.error ?? 'Failed to submit order');
      }

      const data = await response.json();
      toast.success(data.message ?? 'Order created');

      if (data.paymentUrl) {
        clearCart();
        window.location.href = data.paymentUrl;
        return;
      }

      clearCart();
      router.push(`/track?order=${data.orderCode}`);
    } catch (error) {
      console.error(error);
      toast.error('Unable to process checkout. Please try again.');
    } finally {
      setLoading(false);
    }
  });

  return (
    <form onSubmit={onSubmit} className="grid gap-8 lg:grid-cols-[2fr,1fr]">
      <div className="space-y-6">
        <div className="rounded-[32px] border border-gray-100 bg-white p-6 shadow-card">
          <h2 className="font-semibold text-charcoal">Delivery details</h2>
          <div className="mt-4 grid gap-4 md:grid-cols-2">
            <div>
              <label className="text-sm text-gray-600">Full name</label>
              <Input {...form.register('fullName')} />
            </div>
            <div>
              <label className="text-sm text-gray-600">Phone</label>
              <Input {...form.register('phone')} />
            </div>
            <div>
              <label className="text-sm text-gray-600">Email (optional)</label>
              <Input {...form.register('email')} />
            </div>
            <div>
              <label className="text-sm text-gray-600">Region</label>
              <select className="w-full rounded-xl border border-gray-200 px-4 py-2.5 text-sm" {...form.register('region')}>
                <option value="">Select region</option>
                {Array.from(new Set(zones.flatMap((entry) => entry.regions))).map((regionOption) => (
                  <option key={regionOption} value={regionOption}>
                    {regionOption}
                  </option>
                ))}
              </select>
            </div>
            <div>
              <label className="text-sm text-gray-600">City/Town</label>
              <Input {...form.register('city')} />
            </div>
            <div className="md:col-span-2">
              <label className="text-sm text-gray-600">Delivery address</label>
              <Textarea rows={3} {...form.register('address')} />
            </div>
            <div className="md:col-span-2">
              <label className="text-sm text-gray-600">Notes</label>
              <Textarea rows={3} placeholder="Landmarks or delivery instructions" {...form.register('notes')} />
            </div>
          </div>
        </div>

        <div className="rounded-[32px] border border-gray-100 bg-white p-6 shadow-card">
          <h2 className="font-semibold text-charcoal">Payment method</h2>
          <div className="mt-4 grid gap-4 md:grid-cols-3">
            {['MOBILE_MONEY', 'CARD', ...(allowPayOnDelivery ? ['PAY_ON_DELIVERY'] : [])].map((method) => (
              <label key={method} className="flex cursor-pointer flex-col gap-2 rounded-2xl border border-gray-200 p-4">
                <input type="radio" value={method} {...form.register('paymentMethod')} />
                <span className="text-sm font-semibold text-charcoal">{method.replace(/_/g, ' ')}</span>
              </label>
            ))}
          </div>
        </div>
      </div>

      <div className="space-y-6">
        <div className="rounded-[32px] border border-gray-100 bg-white p-6 shadow-card">
          <h3 className="font-semibold text-charcoal">Summary</h3>
          <div className="mt-4 space-y-3 text-sm">
            <div className="flex items-center justify-between">
              <span>Items ({items.length})</span>
              <span>{formatCurrency(subtotal)}</span>
            </div>
            <div className="flex items-center justify-between">
              <span>Delivery fee</span>
              <span>{formatCurrency(deliveryFee)}</span>
            </div>
            <div className="flex items-center justify-between border-t border-gray-100 pt-4 text-base font-semibold text-charcoal">
              <span>Total</span>
              <span>{formatCurrency(total)}</span>
            </div>
          </div>
          <Button className="mt-6 w-full" type="submit" disabled={loading}>
            {loading ? 'Processing...' : 'Place order'}
          </Button>
          <p className="mt-4 text-xs text-gray-500">You will be redirected to Paystack for secure Mobile Money or card payments.</p>
        </div>
      </div>
    </form>
  );
}
