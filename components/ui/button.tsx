'use client';

import { Slot } from '@radix-ui/react-slot';
import { cva, type VariantProps } from 'class-variance-authority';
import { cn } from '@/lib/utils';

const buttonVariants = cva(
  'inline-flex items-center justify-center rounded-full px-4 py-2 text-sm font-semibold transition focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 disabled:opacity-50 disabled:pointer-events-none',
  {
    variants: {
      variant: {
        primary: 'bg-brand text-white shadow-card hover:bg-brand-dark',
        outline: 'border border-charcoal text-charcoal hover:bg-brand-light',
        ghost: 'text-charcoal hover:bg-brand-light/70',
        subtle: 'bg-brand-light text-charcoal hover:bg-brand/90 hover:text-white',
      },
      size: {
        sm: 'text-xs px-3 py-1.5',
        md: 'text-sm px-4 py-2',
        lg: 'text-base px-5 py-3',
      },
    },
    defaultVariants: {
      variant: 'primary',
      size: 'md',
    },
  },
);

export interface ButtonProps extends VariantProps<typeof buttonVariants> {
  asChild?: boolean;
  children: React.ReactNode;
}

export function Button({ className, variant, size, asChild, ...props }: ButtonProps & React.ComponentProps<'button'>) {
  const Comp = asChild ? Slot : 'button';
  return <Comp className={cn(buttonVariants({ variant, size }), className)} {...props} />;
}

export { buttonVariants };
