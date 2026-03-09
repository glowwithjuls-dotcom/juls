'use client';

import Link from 'next/link';
import { MessageCircle } from 'lucide-react';
import { whatsappLink } from '@/lib/utils';

export function WhatsAppButton({ number, message }: { number: string; message: string }) {
  return (
    <Link
      href={whatsappLink(number, message)}
      aria-label="Chat on WhatsApp"
      className="fixed bottom-6 right-6 inline-flex h-14 w-14 items-center justify-center rounded-full bg-green-500 text-white shadow-2xl transition hover:bg-green-600"
      target="_blank"
    >
      <MessageCircle className="h-6 w-6" />
    </Link>
  );
}
