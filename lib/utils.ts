import { type ClassValue, clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function formatCurrency(value: number | string, currency = 'GHS') {
  const numeric = typeof value === 'number' ? value : Number(value);
  return new Intl.NumberFormat('en-GH', {
    style: 'currency',
    currency,
    minimumFractionDigits: 2,
  }).format(numeric);
}

export const whatsappLink = (number: string, message: string) => {
  const digits = number.replace(/\D/g, '');
  const phone = digits.startsWith('233') ? digits : `233${digits.replace(/^0+/, '')}`;
  const text = encodeURIComponent(message);
  return `https://wa.me/${phone}?text=${text}`;
};

