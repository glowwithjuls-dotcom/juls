import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { requireAdminSession } from '@/lib/auth-helpers';
import { productSchema } from '@/lib/validators';
import slugify from 'slugify';

export async function PATCH(request: Request, { params }: { params: Promise<{ id: string }> }) {
  await requireAdminSession();
  const { id } = await params;
  const payload = await request.json();
  const parsed = productSchema.partial().safeParse(payload);
  if (!parsed.success) {
    return NextResponse.json({ error: 'Invalid product' }, { status: 400 });
  }
  const data = { ...parsed.data } as any;
  if (data.name) {
    data.slug = slugify(data.name, { lower: true });
  }
  const product = await prisma.product.update({ where: { id }, data });
  return NextResponse.json(product);
}

export async function DELETE(_request: Request, { params }: { params: Promise<{ id: string }> }) {
  await requireAdminSession();
  const { id } = await params;
  await prisma.product.delete({ where: { id } });
  return NextResponse.json({ success: true });
}
