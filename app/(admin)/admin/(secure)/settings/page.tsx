import type { Metadata } from 'next';
import { prisma } from '@/lib/prisma';
import { getDeliveryZones } from '@/lib/delivery';
import { SettingsManager } from '@/components/admin/settings-manager';

export const dynamic = 'force-dynamic';
export const metadata: Metadata = {
  title: 'Admin Settings',
  description: 'Manage delivery zones, support details, and checkout settings.',
};

export default async function AdminSettingsPage() {
  const [settings, zones] = await Promise.all([
    prisma.siteSetting.findUnique({ where: { id: 1 } }),
    getDeliveryZones(),
  ]);
  return <SettingsManager settings={settings} zones={zones} />;
}
