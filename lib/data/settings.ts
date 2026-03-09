import 'server-only';
import { prisma } from '@/lib/prisma';

export async function getSiteSettings() {
  const settings = await prisma.siteSetting.findUnique({ where: { id: 1 } });
  return (
    settings ?? {
      currency: 'GHS',
      allowPayOnDelivery: true,
      whatsappNumber: process.env.WHATSAPP_NUMBER ?? '233598599013',
      supportEmail: 'titiscosmeticshub@gmail.com',
      supportPhone: '0598599013',
      heroHeadline: 'Beauty products you can trust',
      heroSubheadline: 'Nationwide delivery across Ghana',
    }
  );
}
