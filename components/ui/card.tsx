import { cn } from '@/lib/utils';

export function Card({ className, children }: { className?: string; children: React.ReactNode }) {
  return <div className={cn('rounded-3xl border border-gray-100 bg-white p-6 shadow-card', className)}>{children}</div>;
}
