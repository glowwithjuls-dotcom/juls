import type { Metadata } from 'next';
import { getShopProducts, getCategories } from '@/lib/data/products';
import { ProductGrid } from '@/components/storefront/product-grid';
import { Input } from '@/components/ui/input';
import { Select } from '@/components/ui/select';
import { Button } from '@/components/ui/button';

export const dynamic = 'force-dynamic';
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
      <div className="sticky top-24 z-40 rounded-[40px] border border-white/40 bg-white/70 p-6 shadow-card backdrop-blur-xl transition-all">
        <form className="grid gap-4 md:grid-cols-4" action="/shop">
          <div className="md:col-span-2">
            <label className="mb-2 block text-sm font-medium text-gray-700">Search products</label>
            <Input name="search" placeholder="Serums, makeup, fragrance..." defaultValue={resolvedSearchParams.search ?? ''} className="bg-white/50" />
          </div>
          <div>
            <label className="mb-2 block text-sm font-medium text-gray-700">Category</label>
            <Select name="category" defaultValue={resolvedSearchParams.category ?? ''} className="bg-white/50">
              <option value="">All</option>
              {categories.map((category) => (
                <option key={category.id} value={category.slug}>
                  {category.name}
                </option>
              ))}
            </Select>
          </div>
          <div className="flex items-end">
            <Button type="submit" className="w-full">
              Filter
            </Button>
          </div>
        </form>
      </div>

      <ProductGrid products={products} />
    </div>
  );
}

