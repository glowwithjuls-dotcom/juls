import type { Metadata } from 'next';
import { HeroSection } from '@/components/storefront/hero-section';
import { FeatureTiles } from '@/components/storefront/feature-tiles';
import { ProductCard } from '@/components/storefront/product-card';
import { HighlightBanner } from '@/components/storefront/highlight-banner';
import { CategoryPills } from '@/components/storefront/category-pills';
import { getFeaturedProducts, getCategories } from '@/lib/data/products';

export const revalidate = 3600; // 1 hour ISR
export const metadata: Metadata = {
  title: 'Home',
  description: 'Wholesale and retail cosmetics delivered across Ghana with Mobile Money checkout.',
};

export default async function HomePage() {
  const [products, categories] = await Promise.all([getFeaturedProducts(), getCategories()]);

  return (
    <div>
      <HeroSection />
      <FeatureTiles />
      <section className="mx-auto max-w-6xl px-4 py-12">
        <div className="flex flex-col gap-6 md:flex-row md:items-center md:justify-between">
          <div>
            <p className="text-sm uppercase tracking-[0.4em] text-brand-dark">Categories</p>
            <h2 className="mt-2 font-display text-3xl text-charcoal">Shop by concern</h2>
          </div>
          <CategoryPills categories={categories} />
        </div>
        <div className="mt-10 grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {products.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
          {!products.length && <p className="text-gray-500">Products will appear after seeding.</p>}
        </div>
      </section>
      <HighlightBanner />
    </div>
  );
}
