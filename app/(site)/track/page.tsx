import type { Metadata } from 'next';
import { OrderTracker } from '@/components/orders/order-tracker';

export const metadata: Metadata = {
  title: 'Order Tracking',
  description: 'Track your Glow with Juls order status in real time.',
};

interface TrackPageProps {
  searchParams: Promise<{ order?: string }>;
}

export default async function TrackPage({ searchParams }: TrackPageProps) {
  const resolvedSearchParams = await searchParams;

  return (
    <div className="mx-auto max-w-4xl px-4 py-12">
      <h1 className="font-display text-3xl text-charcoal">Track your order</h1>
      <p className="text-gray-500">Enter the order code from your email or WhatsApp confirmation.</p>
      <div className="mt-8">
        <OrderTracker initialCode={resolvedSearchParams.order ?? ''} />
      </div>
    </div>
  );
}
