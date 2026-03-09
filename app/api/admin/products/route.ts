import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { requireAdminSession } from '@/lib/auth-helpers';
import { productSchema } from '@/lib/validators';
import slugify from 'slugify';

export async function GET() {
  await requireAdminSession();
  const products = await prisma.product.findMany({ orderBy: { createdAt: 'desc' }, include: { category: true } });
  return NextResponse.json(products);
}

export async function POST(request: Request) {
  await requireAdminSession();
  const payload = await request.json();
  const parsed = productSchema.safeParse(payload);
  if (!parsed.success) {
    return NextResponse.json({ error: 'Invalid product' }, { status: 400 });
  }

  const data = parsed.data;
  const product = await prisma.product.create({
    data: {
      name: data.name,
      slug: slugify(data.name, { lower: true }),
      categoryId: data.categoryId,
      price: data.price,
      wholesalePrice: data.wholesalePrice,
      description: data.description,
      stockQuantity: data.stockQuantity,
      imageUrl: data.imageUrl,
      featured: data.featured ?? false,
    },
  });

  return NextResponse.json(product);
}
