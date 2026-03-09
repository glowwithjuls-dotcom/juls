import 'server-only';
import { prisma } from '@/lib/prisma';

export async function getFeaturedProducts(limit = 6) {
  return prisma.product.findMany({
    where: { status: 'active', featured: true },
    take: limit,
    orderBy: { createdAt: 'desc' },
    include: { category: true },
  });
}

export async function getShopProducts(query?: { search?: string; category?: string }) {
  return prisma.product.findMany({
    where: {
      status: 'active',
      name: query?.search ? { contains: query.search, mode: 'insensitive' } : undefined,
      category: query?.category
        ? {
            slug: query.category,
          }
        : undefined,
    },
    orderBy: { name: 'asc' },
    include: { category: true },
  });
}

export async function getProductBySlug(slug: string) {
  return prisma.product.findUnique({ where: { slug }, include: { category: true } });
}

export async function getCategories() {
  return prisma.category.findMany({ orderBy: { name: 'asc' } });
}
