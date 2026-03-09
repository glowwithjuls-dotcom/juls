'use client';

import Image from 'next/image';
import Link from 'next/link';
import { AddToCartButton } from '@/components/cart/add-to-cart-button';
import { formatCurrency } from '@/lib/utils';
import type { Product, Category } from '@prisma/client';
import { motion } from 'framer-motion';

export function ProductCard({ product }: { product: Product & { category?: Category | null } }) {
  return (
    <motion.div
      whileHover={{ y: -5, boxShadow: '0 20px 40px rgba(24, 7, 28, 0.12)' }}
      transition={{ duration: 0.3, ease: 'easeOut' }}
      className="group flex h-full flex-col justify-between rounded-3xl border border-gray-100 bg-white p-4 shadow-card"
    >
      <div>
        <div className="relative mb-4 aspect-square w-full overflow-hidden rounded-2xl bg-brand-light/40">
          {product.imageUrl ? (
            <Image src={product.imageUrl} alt={product.name} fill className="object-cover transition-transform duration-500 group-hover:scale-110" sizes="(max-width: 768px) 100vw, 33vw" />
          ) : (
            <div className="flex h-full items-center justify-center text-sm text-gray-400">Image coming soon</div>
          )}
        </div>
        <p className="text-xs font-semibold uppercase tracking-[0.2em] text-gray-500">{product.category?.name}</p>
        <Link href={`/product/${product.slug}`} className="mt-2 block font-semibold leading-tight text-charcoal">
          {product.name}
        </Link>
        <p className="text-sm text-gray-500">{product.description.slice(0, 90)}...</p>
      </div>
      <div className="mt-4 flex items-center justify-between">
        <div>
          <p className="text-xs text-gray-500">Retail price</p>
          <p className="text-lg font-semibold text-brand-dark">{formatCurrency(Number(product.price))}</p>
        </div>
        <div className="w-32">
          <AddToCartButton
            product={{
              id: product.id,
              name: product.name,
              slug: product.slug,
              price: Number(product.price),
              imageUrl: product.imageUrl,
            }}
          />
        </div>
      </div>
    </motion.div>
  );
}
