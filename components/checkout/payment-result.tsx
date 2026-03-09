'use client';

import { useEffect, useState } from 'react';
import { Button } from '@/components/ui/button';
import Link from 'next/link';

export function PaymentResult({ reference }: { reference?: string }) {
  const [status, setStatus] = useState<'loading' | 'success' | 'failed'>(reference ? 'loading' : 'failed');
  const [orderCode, setOrderCode] = useState<string | undefined>();

  useEffect(() => {
    if (!reference) return;

    const verify = async () => {
      const response = await fetch('/api/paystack/verify', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ reference }),
      });
      if (!response.ok) {
        setStatus('failed');
        return;
      }
      const data = await response.json();
      setOrderCode(data.orderCode);
      setStatus(data.status === 'success' ? 'success' : 'failed');
    };

    verify();
  }, [reference]);

  if (status === 'loading') {
    return <p className="rounded-3xl bg-white p-8 text-center shadow-card">Confirming your payment...</p>;
  }

  if (status === 'failed') {
    return (
      <div className="rounded-3xl bg-white p-8 text-center shadow-card">
        <p className="text-lg font-semibold text-red-500">We could not verify your payment.</p>
        <p className="mt-2 text-gray-500">Please contact support with your Paystack reference ({reference}).</p>
        <Button asChild className="mt-6">
          <Link href="/contact">Get help</Link>
        </Button>
      </div>
    );
  }

  return (
    <div className="rounded-3xl bg-white p-8 text-center shadow-card">
      <p className="text-sm uppercase tracking-[0.4em] text-brand-dark">Payment successful</p>
      <h1 className="mt-3 font-display text-3xl text-charcoal">Thank you!</h1>
      <p className="mt-2 text-gray-500">Your order {orderCode ?? reference} is confirmed. We will update you via WhatsApp.</p>
      <div className="mt-6 flex justify-center gap-3">
        <Button asChild>
          <Link href={`/track?order=${orderCode ?? reference ?? ''}`}>Track order</Link>
        </Button>
        <Button asChild variant="outline">
          <Link href="/shop">Continue shopping</Link>
        </Button>
      </div>
    </div>
  );
}
