import type { Metadata } from 'next';
import { CheckoutForm } from '@/components/checkout/checkout-form';
import { getDeliveryZones } from '@/lib/delivery';
import { getSiteSettings } from '@/lib/data/settings';

export const dynamic = 'force-dynamic';
export const metadata: Metadata = {
  title: 'Checkout',
  description: 'Complete your order with Paystack Mobile Money or card payment.',
};

export default async function CheckoutPage() {
  const [zones, settings] = await Promise.all([getDeliveryZones(), getSiteSettings()]);

  return (
    <div className="mx-auto max-w-6xl px-4 py-12">
      <h1 className="font-display text-3xl text-charcoal">Checkout</h1>
      <p className="text-gray-500">Secure Paystack payments or cash on delivery (where enabled).</p>
      <div className="mt-10">
        <CheckoutForm zones={zones} allowPayOnDelivery={settings.allowPayOnDelivery} />
      </div>
    </div>
  );
}
