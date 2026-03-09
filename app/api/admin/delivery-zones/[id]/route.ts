import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { requireAdminSession } from '@/lib/auth-helpers';
import { deliveryZoneSchema } from '@/lib/validators';

export async function PATCH(request: Request, { params }: { params: Promise<{ id: string }> }) {
  await requireAdminSession();
  const { id } = await params;
  const payload = await request.json();
  const parsed = deliveryZoneSchema.partial().safeParse(payload);
  if (!parsed.success) {
    return NextResponse.json({ error: 'Invalid zone' }, { status: 400 });
  }
  const zone = await prisma.deliveryZone.update({ where: { id }, data: parsed.data });
  return NextResponse.json(zone);
}

export async function DELETE(_request: Request, { params }: { params: Promise<{ id: string }> }) {
  await requireAdminSession();
  const { id } = await params;
  await prisma.deliveryZone.delete({ where: { id } });
  return NextResponse.json({ success: true });
}
