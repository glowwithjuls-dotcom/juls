import { cn } from '@/lib/utils';
import * as React from 'react';

export interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {}

const Input = React.forwardRef<HTMLInputElement, InputProps>(function InputComponent({ className, ...props }, ref) {
  return (
    <input
      ref={ref}
      className={cn(
        'block w-full rounded-xl border border-gray-200 bg-white px-4 py-2.5 text-sm text-charcoal shadow-sm transition focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand focus-visible:ring-offset-1',
        className,
      )}
      {...props}
    />
  );
});

export { Input };
