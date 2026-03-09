import Link from 'next/link';
import { Button } from '@/components/ui/button';

export function HighlightBanner() {
  return (
    <section className="mx-auto max-w-6xl rounded-[40px] bg-gradient-to-r from-brand to-brand-dark px-6 py-12 text-white shadow-card">
      <div className="flex flex-col gap-6 md:flex-row md:items-center md:justify-between">
        <div>
          <p className="text-sm uppercase tracking-[0.4em] text-white/80">Wholesale and Retail</p>
          <h2 className="mt-3 font-display text-3xl">Unlock pro pricing when you stock for your beauty business.</h2>
          <p className="mt-2 text-white/80">Submit your wholesale order and we will confirm payment and delivery in minutes.</p>
        </div>
        <div className="flex gap-3">
          <Button asChild size="lg" variant="outline" className="bg-white text-brand">
            <Link href="/contact">Contact sales</Link>
          </Button>
          <Button asChild size="lg" variant="ghost" className="text-white">
            <Link href="/shop">Browse catalog</Link>
          </Button>
        </div>
      </div>
    </section>
  );
}
