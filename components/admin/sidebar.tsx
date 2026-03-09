'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { cn } from '@/lib/utils';

const routes = [
  { href: '/admin/dashboard', label: 'Dashboard' },
  { href: '/admin/orders', label: 'Orders' },
  { href: '/admin/products', label: 'Products' },
  { href: '/admin/settings', label: 'Settings' },
];

export function AdminSidebar() {
  const pathname = usePathname();
  return (
    <aside className="min-w-[220px] rounded-3xl border border-gray-200 bg-white p-6 shadow-card">
      <p className="font-display text-xl text-brand">Admin</p>
      <nav className="mt-6 flex flex-col gap-2 text-sm">
        {routes.map((route) => (
          <Link
            key={route.href}
            href={route.href}
            className={cn(
              'rounded-2xl px-4 py-2',
              pathname?.startsWith(route.href) ? 'bg-brand text-white' : 'text-gray-600 hover:text-brand-dark',
            )}
          >
            {route.label}
          </Link>
        ))}
      </nav>
    </aside>
  );
}
