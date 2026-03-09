import { prisma } from '@/lib/prisma';

export type DeliveryZoneOption = {
  id: string;
  zone: string;
  regions: string[];
  fee: number;
};

const defaultZones = [
  {
    zone: 'Zone A',
    regions: ['Greater Accra'],
    fee: 20,
  },
  {
    zone: 'Zone B',
    regions: ['Ashanti', 'Eastern', 'Central', 'Western'],
    fee: 25,
  },
  {
    zone: 'Zone C',
    regions: ['Northern', 'Upper East', 'Upper West', 'Savannah', 'North East', 'Bono', 'Bono East', 'Ahafo'],
    fee: 35,
  },
];

function safeParseConfig(): typeof defaultZones {
  try {
    const parsed = JSON.parse(process.env.DELIVERY_ZONE_CONFIG ?? '[]');
    if (Array.isArray(parsed) && parsed.length) {
      return parsed;
    }
  } catch (error) {
    console.warn('Failed to parse DELIVERY_ZONE_CONFIG', error);
  }
  return defaultZones;
}

export async function getDeliveryZones(): Promise<DeliveryZoneOption[]> {
  const zones = await prisma.deliveryZone.findMany({ orderBy: { fee: 'asc' } });
  if (zones.length) {
    return zones.map((zone) => ({ id: zone.id, zone: zone.zone, regions: zone.regions, fee: Number(zone.fee) }));
  }
  return safeParseConfig().map((zone) => ({ id: zone.zone, zone: zone.zone, regions: zone.regions, fee: zone.fee }));
}

export async function calculateDeliveryFee(region: string) {
  const zones = await getDeliveryZones();
  const match = zones.find((zone) => zone.regions.map((r) => r.toLowerCase()).includes(region.toLowerCase()));
  return match?.fee ?? 25;
}
