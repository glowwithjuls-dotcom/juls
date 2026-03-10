import type { Metadata } from 'next';
import { getShopProducts, getCategories } from '@/lib/data/products';
import { ProductGrid } from '@/components/storefront/product-grid';
import { ShopFilter } from '@/components/storefront/shop-filter';

export const revalidate = 3600; // 1 hour ISR
export const metadata: Metadata = {
  title: 'Shop',
  description: 'Browse skincare, makeup, fragrances, and more from Glow with Juls.',
};

interface ShopPageProps {
  searchParams: Promise<Record<string, string | undefined>>;
}

export default async function ShopPage({ searchParams }: ShopPageProps) {
  const resolvedSearchParams = await searchParams;

  const [products, categories] = await Promise.all([
    getShopProducts({ search: resolvedSearchParams.search, category: resolvedSearchParams.category }),
    getCategories(),
  ]);

  return (
    <div className="mx-auto max-w-6xl px-4 py-12">
      <ShopFilter
        categories={categories}
        initialSearch={resolvedSearchParams.search}
        initialCategory={resolvedSearchParams.category}
      />

      <ProductGrid products={products} />
    </div>
  );
}

