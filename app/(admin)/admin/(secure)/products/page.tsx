import type { Metadata } from 'next';
import { prisma } from '@/lib/prisma';
import { ProductManager } from '@/components/admin/product-manager';

export const dynamic = 'force-dynamic';
export const metadata: Metadata = {
  title: 'Admin Products',
  description: 'Create, edit, and manage stock for products.',
};

export default async function AdminProductsPage() {
  const [products, categories] = await Promise.all([
    prisma.product.findMany({ include: { category: true }, orderBy: { createdAt: 'desc' } }),
    prisma.category.findMany({ orderBy: { name: 'asc' } }),
  ]);

  const serializedProducts = products.map((product) => ({
    ...product,
    price: Number(product.price),
    wholesalePrice: product.wholesalePrice ? Number(product.wholesalePrice) : null,
  }));

  return (
    <ProductManager products={serializedProducts} categories={categories} />
  );
}
