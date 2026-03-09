'use client';

import { useCartStore } from '@/stores/cart-store';
import { Button } from '@/components/ui/button';
import { toast } from 'react-hot-toast';

export function AddToCartButton({
  product,
  quantity = 1,
}: {
  product: { id: string; name: string; slug: string; price: number; imageUrl?: string | null };
  quantity?: number;
}) {
  const addItem = useCartStore((state) => state.addItem);

  return (
    <Button
      onClick={() => {
        addItem({
          productId: product.id,
          name: product.name,
          price: product.price,
          imageUrl: product.imageUrl,
          slug: product.slug,
          quantity,
        });
        toast.success(`${product.name} added to cart`);
      }}
      size="sm"
      className="w-full"
    >
      Add to cart
    </Button>
  );
}
