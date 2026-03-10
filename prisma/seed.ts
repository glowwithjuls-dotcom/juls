import { PrismaClient } from '@prisma/client';
import fs from 'node:fs/promises';
import path from 'node:path';
import slugify from 'slugify';
import bcrypt from 'bcryptjs';
import { parse } from 'csv-parse/sync';

const prisma = new PrismaClient();

type ProductCsvRow = {
  name: string;
  category?: string;
  price?: string;
  wholesale_price?: string;
  stock_quantity?: string;
  description?: string;
  image_url?: string;
  status?: string;
};

async function seedProducts() {
  const csvPath = path.join(process.cwd(), 'data', 'SEED_PRODUCTS.csv');
  const file = await fs.readFile(csvPath, 'utf-8');
  const rows = parse(file, { columns: true, skip_empty_lines: true }) as ProductCsvRow[];

  const categoriesMap = new Map<string, string>();

  for (const row of rows) {
    const categoryName = row.category?.trim() || 'Uncategorized';
    if (!categoriesMap.has(categoryName)) {
      const category = await prisma.category.upsert({
        where: { slug: slugify(categoryName, { lower: true }) },
        update: {},
        create: {
          name: categoryName,
          slug: slugify(categoryName, { lower: true }),
        },
      });
      categoriesMap.set(categoryName, category.id);
    }

    const categoryId = categoriesMap.get(categoryName)!;
    const name = row.name.trim();

    await prisma.product.upsert({
      where: { slug: slugify(name, { lower: true }) },
      update: {
        price: row.price ? Number(row.price) : 0,
        stockQuantity: Number(row.stock_quantity ?? 0),
        imageUrl: row.image_url || null,
        description: row.description || 'Cosmetics product',
        status: row.status || 'active',
      },
      create: {
        name,
        slug: slugify(name, { lower: true }),
        description: row.description || 'Cosmetics product',
        price: Number(row.price ?? 0),
        wholesalePrice: row.wholesale_price ? Number(row.wholesale_price) : null,
        stockQuantity: Number(row.stock_quantity ?? 0),
        imageUrl: row.image_url || null,
        categoryId,
        status: row.status || 'active',
      },
    });
  }
}

async function seedDeliveryZones() {
  const zones = [
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

  for (const zone of zones) {
    await prisma.deliveryZone.upsert({
      where: { slug: slugify(zone.zone, { lower: true }) },
      update: { regions: zone.regions, fee: zone.fee },
      create: {
        zone: zone.zone,
        slug: slugify(zone.zone, { lower: true }),
        regions: zone.regions,
        fee: zone.fee,
      },
    });
  }
}

async function seedAdmin() {
  const email = process.env.ADMIN_SEED_EMAIL || 'admin@titiscosmetics.com';
  const password = process.env.ADMIN_SEED_PASSWORD || 'ChangeMe123!';

  const hash = await bcrypt.hash(password, 10);
  await prisma.adminUser.upsert({
    where: { email },
    update: {},
    create: {
      email,
      passwordHash: hash,
      name: 'Titi Admin',
    },
  });
}

async function seedSettings() {
  await prisma.siteSetting.upsert({
    where: { id: 1 },
    update: {
      allowPayOnDelivery: process.env.ALLOW_PAY_ON_DELIVERY !== 'false',
      whatsappNumber: process.env.WHATSAPP_NUMBER || '233598599013',
      supportEmail: 'titiscosmeticshub@gmail.com',
      supportPhone: '0598599013',
    },
    create: {
      allowPayOnDelivery: process.env.ALLOW_PAY_ON_DELIVERY !== 'false',
      whatsappNumber: process.env.WHATSAPP_NUMBER || '233598599013',
      supportEmail: 'titiscosmeticshub@gmail.com',
      supportPhone: '0598599013',
      currency: 'GHS',
    },
  });
}

async function main() {
  await seedProducts();
  await seedDeliveryZones();
  await seedAdmin();
  await seedSettings();
}

main()
  .then(() => {
    console.log('Seed completed');
  })
  .catch((error) => {
    console.error(error);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
