import type { Metadata } from 'next';
import { CartView } from '@/components/cart/cart-view';

export const metadata: Metadata = {
  title: 'Cart',
  description: 'Review selected cosmetics and continue to checkout.',
};

export default function CartPage() {
  return (
    <div className="mx-auto max-w-6xl px-4 py-12">
      <h1 className="font-display text-3xl text-charcoal">Your cart</h1>
      <p className="text-gray-500">Review items before checkout.</p>
      <div className="mt-8">
        <CartView />
      </div>
    </div>
  );
}
