'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import { Phone, Menu, X, ShoppingCart } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { usePathname } from 'next/navigation';
import { useCartTotals } from '@/stores/cart-store';

const navItems = [
  { label: 'Shop', href: '/shop' },
  { label: 'Contact', href: '/contact' },
  { label: 'Track Order', href: '/track' },
];

export function SiteHeader({ className }: { className?: string }) {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isMounted, setIsMounted] = useState(false);
  const pathname = usePathname();
  const { totalItems } = useCartTotals();

  useEffect(() => {
    setIsMounted(true);
  }, []);

  // Close menu when navigating
  const closeMenu = () => setIsMobileMenuOpen(false);

  return (
    <header className={cn('sticky top-0 z-50 border-b border-white/30 bg-white/80 backdrop-blur-xl', className)}>
      <div className="mx-auto flex max-w-6xl items-center justify-between gap-6 px-4 py-4">
        <Link href="/" className="flex flex-col leading-tight" onClick={closeMenu}>
          <span className="font-display text-2xl text-brand">Glow with Juls</span>
          <span className="text-xs uppercase tracking-[0.35em] text-gray-500">Beauty Shop</span>
        </Link>
        <nav className="hidden items-center gap-6 text-sm font-medium text-gray-600 md:flex">
          {navItems.map((item) => (
            <Link key={item.href} href={item.href} className={cn("transition hover:text-brand-dark", pathname === item.href && "text-brand-dark font-semibold")}>
              {item.label}
            </Link>
          ))}
        </nav>
        <div className="flex items-center gap-3">
          <Button variant="outline" size="sm" asChild className="hidden md:inline-flex">
            <Link href="tel:0546817874" className="flex items-center gap-2">
              <Phone className="h-4 w-4" />
              Call us
            </Link>
          </Button>
          <Button size="sm" asChild className="hidden md:inline-flex relative pr-8">
            <Link href="/cart">
              <ShoppingCart className="h-4 w-4 mr-2" />
              Cart
              {isMounted && totalItems > 0 && (
                <span className="absolute -top-2 -right-2 flex h-5 w-5 items-center justify-center rounded-full bg-brand text-[10px] font-bold text-white">
                  {totalItems}
                </span>
              )}
            </Link>
          </Button>
          <button
            className="md:hidden flex items-center justify-center p-2 text-charcoal"
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            aria-label="Toggle mobile menu"
          >
            {isMobileMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
          </button>
        </div>
      </div>

      <AnimatePresence>
        {isMobileMenuOpen && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            className="md:hidden overflow-hidden bg-white/95 backdrop-blur-3xl shadow-xl absolute w-full left-0 border-b border-gray-100"
          >
            <div className="flex flex-col px-4 py-6 gap-4">
              {navItems.map((item) => (
                <Link
                  key={item.href}
                  href={item.href}
                  onClick={closeMenu}
                  className={cn("text-lg font-medium text-charcoal border-b border-gray-100 pb-4", pathname === item.href && "text-brand")}
                >
                  {item.label}
                </Link>
              ))}
              <div className="flex flex-col gap-3 mt-4">
                <Button variant="outline" size="lg" asChild className="w-full justify-start">
                  <Link href="tel:0546817874" className="flex items-center gap-2" onClick={closeMenu}>
                    <Phone className="h-5 w-5" />
                    Call 0546817874
                  </Link>
                </Button>
                <Button size="lg" asChild className="w-full relative">
                  <Link href="/cart" onClick={closeMenu}>
                    <ShoppingCart className="h-5 w-5 mr-2" />
                    View Cart
                    {isMounted && totalItems > 0 && (
                      <span className="ml-2 flex h-5 w-5 items-center justify-center rounded-full bg-brand-light text-brand-dark font-bold text-xs">
                        {totalItems}
                      </span>
                    )}
                  </Link>
                </Button>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
}
