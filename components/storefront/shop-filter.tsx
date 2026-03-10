'use client';

import { useRouter, useSearchParams } from 'next/navigation';
import { useCallback, useTransition } from 'react';
import { Input } from '@/components/ui/input';
import { Select } from '@/components/ui/select';
import { Button } from '@/components/ui/button';

interface Category {
    id: string;
    name: string;
    slug: string;
}

interface ShopFilterProps {
    categories: Category[];
    initialSearch?: string;
    initialCategory?: string;
}

export function ShopFilter({ categories, initialSearch, initialCategory }: ShopFilterProps) {
    const router = useRouter();
    const searchParams = useSearchParams();
    const [isPending, startTransition] = useTransition();

    const createQueryString = useCallback(
        (name: string, value: string) => {
            const params = new URLSearchParams(searchParams.toString());
            if (value) {
                params.set(name, value);
            } else {
                params.delete(name);
            }
            return params.toString();
        },
        [searchParams]
    );

    const handleSearchChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        startTransition(() => {
            router.push(`/shop?${createQueryString('search', event.target.value)}`);
        });
    };

    const handleCategoryChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
        startTransition(() => {
            router.push(`/shop?${createQueryString('category', event.target.value)}`);
        });
    };

    return (
        <div className="sticky top-24 z-40 rounded-[40px] border border-white/40 bg-white/70 p-6 shadow-card backdrop-blur-xl transition-all">
            <div className="grid gap-4 md:grid-cols-4 items-end">
                <div className="md:col-span-2">
                    <label className="mb-2 block text-sm font-medium text-gray-700">Search products</label>
                    <Input
                        name="search"
                        placeholder="Serums, makeup, fragrance..."
                        defaultValue={initialSearch ?? ''}
                        onChange={handleSearchChange}
                        className="bg-white/50"
                    />
                </div>
                <div>
                    <label className="mb-2 block text-sm font-medium text-gray-700">Category</label>
                    <Select
                        name="category"
                        defaultValue={initialCategory ?? ''}
                        onChange={handleCategoryChange}
                        className="bg-white/50"
                    >
                        <option value="">All</option>
                        {categories.map((category) => (
                            <option key={category.id} value={category.slug}>
                                {category.name}
                            </option>
                        ))}
                    </Select>
                </div>
                <div className="flex items-end">
                    <Button type="button" variant="outline" className="w-full" disabled={isPending} onClick={() => {
                        if (initialSearch || initialCategory) {
                            router.push('/shop');
                        }
                    }}>
                        {isPending ? 'Filtering...' : 'Clear Filters'}
                    </Button>
                </div>
            </div>
        </div>
    );
}
