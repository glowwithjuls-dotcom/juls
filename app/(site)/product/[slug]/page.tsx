import Image from 'next/image';
import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { getProductBySlug, getFeaturedProducts } from '@/lib/data/products';
import { formatCurrency } from '@/lib/utils';
import { AddToCartButton } from '@/components/cart/add-to-cart-button';
import { ProductCard } from '@/components/storefront/product-card';

export const dynamic = 'force-dynamic';
export const metadata: Metadata = {
  title: 'Product details',
  description: 'View product details, pricing, and related products from Glow with Juls.',
};

interface ProductPageProps {
  params: Promise<{ slug: string }>;
}

export default async function ProductPage({ params }: ProductPageProps) {
  const { slug } = await params;
  const product = await getProductBySlug(slug);
  if (!product) return notFound();
  const related = await getFeaturedProducts(3);

  return (
    <div className="mx-auto max-w-6xl px-4 py-12">
      <div className="grid gap-10 md:grid-cols-2">
        <div className="relative aspect-square overflow-hidden rounded-[40px] bg-brand-light/60">
          {product.imageUrl ? (
            <Image src={product.imageUrl} alt={product.name} fill className="object-cover" sizes="(max-width: 768px) 100vw, 50vw" />
          ) : (
            <div className="flex h-full items-center justify-center text-gray-400">Image coming soon</div>
          )}
        </div>
        <div className="space-y-6">
          <p className="text-sm uppercase tracking-[0.4em] text-brand-dark">{product.category?.name}</p>
          <h1 className="font-display text-4xl text-charcoal">{product.name}</h1>
          <p className="text-base text-gray-600">{product.description}</p>
          <div className="flex items-center gap-6">
            <div>
              <p className="text-sm text-gray-500">Retail price</p>
              <p className="text-3xl font-semibold text-brand-dark">{formatCurrency(Number(product.price))}</p>
            </div>
            {product.wholesalePrice && (
              <div>
                <p className="text-sm text-gray-500">Wholesale</p>
                <p className="text-xl font-semibold text-gray-700">{formatCurrency(Number(product.wholesalePrice))}</p>
              </div>
            )}
          </div>
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

      <section className="mt-16">
        <h2 className="font-display text-2xl text-charcoal">You may also like</h2>
        <div className="mt-6 grid gap-6 md:grid-cols-3">
          {related.map((item) => (
            <ProductCard key={item.id} product={item} />
          ))}
        </div>
      </section>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            '@context': 'https://schema.org',
            '@type': 'Product',
            name: product.name,
            description: product.description,
            image: product.imageUrl ? [product.imageUrl] : [],
            sku: product.sku || product.id,
            offers: {
              '@type': 'Offer',
              price: product.price,
              priceCurrency: 'GHS',
              availability: product.stockQuantity > 0 ? 'https://schema.org/InStock' : 'https://schema.org/OutOfStock',
            },
          }),
        }}
      />
    </div>
  );
}
