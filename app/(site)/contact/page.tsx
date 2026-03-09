import type { Metadata } from 'next';
import Link from 'next/link';
import { ContactForm } from '@/components/contact/contact-form';
import { BUSINESS } from '@/lib/constants';

export const metadata: Metadata = {
  title: 'Contact',
  description: 'Contact Glow with Juls for wholesale and retail product support across Ghana.',
};

export default function ContactPage() {
  return (
    <div className="mx-auto max-w-6xl px-4 py-12">
      <div className="grid gap-10 rounded-[40px] bg-white p-8 shadow-card lg:grid-cols-2">
        <div>
          <p className="text-sm uppercase tracking-[0.4em] text-brand-dark">Contact</p>
          <h1 className="mt-3 font-display text-4xl text-charcoal">Talk to Glow with Juls</h1>
          <p className="mt-3 text-base text-gray-600">
            We are ready to help with wholesale inquiries, product recommendations, and delivery updates. Call, email, or
            send a WhatsApp message.
          </p>
          <div className="mt-6 space-y-4 text-sm">
            <div>
              <p className="font-semibold text-gray-800">Phone</p>
              <p>
                <Link href={`tel:${BUSINESS.phones[0]}`} className="text-brand-dark">
                  {BUSINESS.phones.join(' / ')}
                </Link>
              </p>
            </div>
            <div>
              <p className="font-semibold text-gray-800">Email</p>
              <Link href={`mailto:${BUSINESS.email}`} className="text-brand-dark">
                {BUSINESS.email}
              </Link>
            </div>
            <div>
              <p className="font-semibold text-gray-800">Instagram</p>
              <Link href={BUSINESS.socials.instagram} className="text-brand-dark" target="_blank" rel="noreferrer">
                @titiscosmeticshub
              </Link>
            </div>
          </div>
        </div>
        <div>
          <ContactForm />
        </div>
      </div>
    </div>
  );
}
