import { NextResponse } from 'next/server';
import { contactSchema } from '@/lib/validators';
import { prisma } from '@/lib/prisma';

export async function POST(request: Request) {
  const payload = await request.json();
  const parsed = contactSchema.safeParse(payload);
  if (!parsed.success) {
    return NextResponse.json({ error: 'Invalid data' }, { status: 400 });
  }

  await prisma.contactRequest.create({ data: parsed.data });
  return NextResponse.json({ message: 'We have received your message and will reply shortly.' });
}
