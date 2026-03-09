import type { Metadata } from 'next';
import { PaymentResult } from '@/components/checkout/payment-result';

export const metadata: Metadata = {
  title: 'Payment Confirmation',
  description: 'Confirm Paystack payment and continue order tracking.',
};

export default async function CheckoutSuccessPage({ searchParams }: { searchParams: Promise<{ reference?: string }> }) {
  const resolvedSearchParams = await searchParams;

  return (
    <div className="mx-auto max-w-3xl px-4 py-12">
      <PaymentResult reference={resolvedSearchParams.reference} />
    </div>
  );
}
