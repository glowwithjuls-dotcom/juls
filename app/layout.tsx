import type { Metadata } from 'next';
import './globals.css';
import { inter, playfair } from '@/lib/fonts';
import { Providers } from '@/components/providers';
import { WhatsAppButton } from '@/components/layout/whatsapp-button';

const whatsappNumber = process.env.WHATSAPP_NUMBER ?? '233598599013';

export const metadata: Metadata = {
  title: {
    template: '%s | Glow with Juls',
    default: 'Glow with Juls | Beauty products delivered across Ghana',
  },
  description:
    'Shop wholesale and retail beauty products from Glow with Juls. Nationwide delivery, Mobile Money payments, Paystack checkout, and WhatsApp support.',
  metadataBase: new URL(process.env.NEXT_PUBLIC_SITE_URL ?? 'http://localhost:3000'),
  openGraph: {
    title: 'Glow with Juls',
    description: 'Modern Ghanaian cosmetics ecommerce experience with nationwide delivery.',
    type: 'website',
    locale: 'en_GH',
    url: process.env.NEXT_PUBLIC_SITE_URL ?? 'http://localhost:3000',
  },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={`${inter.variable} ${playfair.variable}`} suppressHydrationWarning>
      <body className="bg-white text-charcoal antialiased">
        <Providers>
          <div className="min-h-screen bg-slate-50 text-base">
            {children}
            <WhatsAppButton number={whatsappNumber} message="Hi Glow with Juls, I'd like to order beauty products." />
          </div>
        </Providers>
      </body>
    </html>
  );
}
