import * as React from 'react';
import { cva, type VariantProps } from 'class-variance-authority';
import { cn } from '@/components/utils';

const buttonVariants = cva(
  'inline-flex items-center justify-center whitespace-nowrap rounded-button font-sans text-[12px] font-bold uppercase tracking-[0.04em] transition-[colors,box-shadow] duration-200 active:scale-[0.98] focus-visible:outline-none focus-visible:shadow-[0_0_0_2px_rgba(0,194,100,0.55)] disabled:pointer-events-none disabled:opacity-60',
  {
    variants: {
      variant: {
        ghost:
          'bg-transparent text-foreground border border-border hover:border-foreground/30 hover:bg-subtle px-4 py-2',
        filled:
          'bg-foreground text-canvas hover:bg-foreground/90 px-3 py-1'
      }
    },
    defaultVariants: {
      variant: 'ghost'
    }
  }
);

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {}

export const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant, ...props }, ref) => {
    return (
      <button
        ref={ref}
        className={cn(buttonVariants({ variant, className }))}
        {...props}
      />
    );
  }
);
Button.displayName = 'Button';

export { buttonVariants };
