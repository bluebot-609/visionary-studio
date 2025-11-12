import * as React from 'react';
import { cva, type VariantProps } from 'class-variance-authority';
import { cn } from '../../lib/utils';

const buttonVariants = cva(
  'inline-flex items-center justify-center rounded-full font-semibold transition focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-offset-black/40 disabled:pointer-events-none disabled:opacity-60',
  {
    variants: {
      variant: {
        primary:
          'bg-accent text-slate-950 shadow-card-hover hover:bg-accent-hover focus-visible:ring-accent/80',
        secondary:
          'border border-white/15 bg-white/5 text-white hover:border-white/40 hover:bg-white/10 focus-visible:ring-white/30',
        ghost:
          'text-white/70 hover:text-white hover:bg-white/5 focus-visible:ring-white/20',
        outline:
          'border border-white/20 text-white hover:bg-white/10 focus-visible:ring-white/20',
      },
      size: {
        sm: 'h-9 px-4 text-xs tracking-wide uppercase',
        md: 'h-11 px-6 text-sm',
        lg: 'h-12 px-8 text-base',
      },
    },
    defaultVariants: {
      variant: 'primary',
      size: 'md',
    },
  },
);

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant, size, ...props }, ref) => (
    <button
      ref={ref}
      className={cn(buttonVariants({ variant, size }), className)}
      {...props}
    />
  ),
);
Button.displayName = 'Button';

export { Button, buttonVariants };





