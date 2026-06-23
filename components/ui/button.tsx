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

// Canonical button class sets — one look across links, MagneticButton, and sections.
// primary = brand green; secondary = outline on a dark surface; glass = over media (hero).
export const btnBase =
  'inline-flex items-center justify-center gap-2 rounded-control px-5 py-3 text-[15px] font-semibold tracking-[-0.01em] transition-[background-color,border-color,transform] duration-200 ease-out active:scale-[0.97] focus-visible:outline-none focus-visible:shadow-[var(--shadow-focus)]';
export const btnPrimary = `${btnBase} bg-accent text-on-accent hover:bg-accent-dim`;
export const btnSecondary = `${btnBase} border border-border bg-surface text-foreground hover:border-accent/40 hover:bg-subtle`;
export const btnGlass = `${btnBase} border border-white/15 bg-black/35 text-white backdrop-blur-md hover:bg-black/55`;
