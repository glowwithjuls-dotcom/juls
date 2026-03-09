import Link from 'next/link';
import type { Category } from '@prisma/client';

export function CategoryPills({ categories }: { categories: Category[] }) {
  if (!categories.length) return null;

  return (
    <div className="flex flex-wrap gap-3">
      {categories.map((category) => (
        <Link
          key={category.id}
          href={`/shop?category=${category.slug}`}
          className="rounded-full border border-gray-200 px-4 py-2 text-sm font-medium text-gray-700 transition hover:border-brand hover:text-brand-dark"
        >
          {category.name}
        </Link>
      ))}
    </div>
  );
}
