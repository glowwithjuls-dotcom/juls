'use client';

import { motion } from 'framer-motion';
import { ProductCard } from '@/components/storefront/product-card';
import type { Product, Category } from '@prisma/client';

type ProductWithCategory = Product & { category?: Category | null };

const containerVariants = {
    hidden: { opacity: 0 },
    show: {
        opacity: 1,
        transition: {
            staggerChildren: 0.1,
        },
    },
};

const itemVariants = {
    hidden: { opacity: 0, y: 30, scale: 0.95 },
    show: { opacity: 1, y: 0, scale: 1, transition: { type: 'spring' as const, stiffness: 300, damping: 24 } },
};

export function ProductGrid({ products }: { products: ProductWithCategory[] }) {
    if (!products.length) {
        return <p className="mt-10 text-gray-500">No products match your filters.</p>;
    }

    return (
        <motion.div
            variants={containerVariants}
            initial="hidden"
            animate="show"
            className="mt-10 grid gap-6 md:grid-cols-2 lg:grid-cols-3"
        >
            {products.map((product) => (
                <motion.div key={product.id} variants={itemVariants} className="h-full">
                    <ProductCard product={product} />
                </motion.div>
            ))}
        </motion.div>
    );
}
