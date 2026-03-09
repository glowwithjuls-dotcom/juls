import { PrismaClient } from '@prisma/client';
import slugify from 'slugify';

const prisma = new PrismaClient();

async function main() {
    // 1. Add Category
    const categoryName = 'Perfumes';
    const category = await prisma.category.upsert({
        where: { slug: slugify(categoryName, { lower: true }) },
        update: {},
        create: {
            name: categoryName,
            slug: slugify(categoryName, { lower: true }),
        },
    });

    console.log(`Ensured category exists: ${category.name}`);

    // 2. Add Products
    const perfumes = [
        {
            name: 'Rose Water Eau de Parfum',
            description: 'A delicate, romantic fragrance with fresh rose petals and soft floral notes.',
            price: 250,
            wholesalePrice: 200,
            stockQuantity: 15,
            imageUrl: '/products/rose-perfume.png',
        },
        {
            name: 'Warm Vanilla Mist',
            description: 'A cozy, sweet fragrance with deep vanilla bean extract and amber undertones.',
            price: 180,
            wholesalePrice: 150,
            stockQuantity: 25,
            imageUrl: '/products/vanilla-perfume.png',
        },
        {
            name: 'Oud Wood Intense',
            description: 'A luxurious, smoky and dramatic fragrance featuring premium aged oud wood.',
            price: 450,
            wholesalePrice: 380,
            stockQuantity: 8,
            imageUrl: '/products/oud-perfume.png',
        },
    ];

    for (const p of perfumes) {
        const product = await prisma.product.upsert({
            where: { slug: slugify(p.name, { lower: true }) },
            update: {
                imageUrl: p.imageUrl,
                price: p.price,
                description: p.description,
            },
            create: {
                name: p.name,
                slug: slugify(p.name, { lower: true }),
                description: p.description,
                price: p.price,
                wholesalePrice: p.wholesalePrice,
                stockQuantity: p.stockQuantity,
                imageUrl: p.imageUrl,
                categoryId: category.id,
                status: 'active',
                featured: true, // Make sure they show on homepage
            },
        });
        console.log(`Added/Updated product: ${product.name}`);
    }
}

main()
    .then(() => console.log('Perfumes seeded successfully!'))
    .catch((e) => {
        console.error(e);
        process.exit(1);
    })
    .finally(async () => {
        await prisma.$disconnect();
    });
