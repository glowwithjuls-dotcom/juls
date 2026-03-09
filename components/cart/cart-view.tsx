'use client';

import Image from 'next/image';
import Link from 'next/link';
import { useCartStore, useCartTotals } from '@/stores/cart-store';
import { Button } from '@/components/ui/button';
import { formatCurrency } from '@/lib/utils';
import { Input } from '@/components/ui/input';

export function CartView() {
  const items = useCartStore((state) => state.items);
  const removeItem = useCartStore((state) => state.removeItem);
  const updateQuantity = useCartStore((state) => state.updateQuantity);
  const { subtotal } = useCartTotals();

  if (!items.length) {
    return (
      <div className="rounded-[32px] bg-white p-8 text-center shadow-card">
        <p className="text-lg font-semibold text-charcoal">Your cart is empty</p>
        <p className="mt-2 text-gray-500">Browse the shop to add your favorite products.</p>
        <Button asChild className="mt-6">
          <Link href="/shop">Go to shop</Link>
        </Button>
      </div>
    );
  }

  return (
    <div className="grid gap-8 lg:grid-cols-[2fr,1fr]">
      <div className="space-y-4">
        {items.map((item) => (
          <div key={item.productId} className="flex items-center gap-4 rounded-3xl border border-gray-100 bg-white p-4 shadow-card">
            <div className="relative h-24 w-24 overflow-hidden rounded-2xl bg-brand-light/50">
              {item.imageUrl ? (
                <Image src={item.imageUrl} alt={item.name} fill className="object-cover" sizes="96px" />
              ) : (
                <div className="flex h-full items-center justify-center text-gray-400">No image</div>
              )}
            </div>
            <div className="flex-1">
              <Link href={`/product/${item.slug}`} className="font-semibold text-charcoal">
                {item.name}
              </Link>
              <p className="text-sm text-gray-500">{formatCurrency(item.price)}</p>
              <div className="mt-2 flex items-center gap-3">
                <label className="text-sm text-gray-500">Qty</label>
                <Input
                  type="number"
                  min={1}
                  value={item.quantity}
                  onChange={(event) => updateQuantity(item.productId, Number(event.target.value) || 1)}
                  className="w-20"
                />
                <Button variant="ghost" size="sm" onClick={() => removeItem(item.productId)}>
                  Remove
                </Button>
              </div>
            </div>
            <p className="font-semibold text-gray-700">{formatCurrency(item.price * item.quantity)}</p>
          </div>
        ))}
      </div>
      <div className="rounded-[32px] border border-gray-100 bg-white p-6 shadow-card">
        <p className="text-lg font-semibold text-charcoal">Order summary</p>
        <div className="mt-4 space-y-2 text-sm">
          <div className="flex items-center justify-between">
            <span>Subtotal</span>
            <span className="font-semibold text-brand-dark">{formatCurrency(subtotal)}</span>
          </div>
          <p className="text-xs text-gray-500">Delivery fees are calculated at checkout based on your region.</p>
        </div>
        <Button asChild className="mt-6 w-full">
          <Link href="/checkout">Checkout</Link>
        </Button>
      </div>
    </div>
  );
}
