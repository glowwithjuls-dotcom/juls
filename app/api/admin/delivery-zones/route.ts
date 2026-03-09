import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { requireAdminSession } from '@/lib/auth-helpers';
import { deliveryZoneSchema } from '@/lib/validators';
import slugify from 'slugify';

export async function GET() {
  await requireAdminSession();
  const zones = await prisma.deliveryZone.findMany({ orderBy: { fee: 'asc' } });
  return NextResponse.json(zones);
}

export async function POST(request: Request) {
  await requireAdminSession();
  const payload = await request.json();
  const parsed = deliveryZoneSchema.safeParse(payload);
  if (!parsed.success) {
    return NextResponse.json({ error: 'Invalid zone' }, { status: 400 });
  }
  const zone = await prisma.deliveryZone.create({
    data: {
      zone: parsed.data.zone,
      slug: slugify(parsed.data.zone, { lower: true }),
      regions: parsed.data.regions,
      fee: parsed.data.fee,
    },
  });
  return NextResponse.json(zone);
}
