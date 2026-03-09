import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { requireAdminSession } from '@/lib/auth-helpers';
import { settingsSchema } from '@/lib/validators';

export async function GET() {
  await requireAdminSession();
  const settings = await prisma.siteSetting.findUnique({ where: { id: 1 } });
  return NextResponse.json(settings);
}

export async function PUT(request: Request) {
  await requireAdminSession();
  const payload = await request.json();
  const parsed = settingsSchema.safeParse(payload);
  if (!parsed.success) {
    return NextResponse.json({ error: 'Invalid settings' }, { status: 400 });
  }
  const settings = await prisma.siteSetting.upsert({
    where: { id: 1 },
    update: parsed.data,
    create: parsed.data,
  });
  return NextResponse.json(settings);
}
