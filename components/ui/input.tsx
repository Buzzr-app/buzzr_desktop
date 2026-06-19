import * as React from 'react';
import { cn } from '@/components/utils';

export interface InputProps
  extends React.InputHTMLAttributes<HTMLInputElement> {}

export const Input = React.forwardRef<HTMLInputElement, InputProps>(
  ({ className, type, ...props }, ref) => {
    return (
      <input
        type={type}
        className={cn(
          'flex w-full bg-canvas text-foreground border border-surface',
          'py-5 pl-4 pr-16',
          'rounded-xl',
          'text-[16px] leading-[1.5] tracking-[-0.025em]',
          'placeholder:text-muted',
          'focus:outline-none focus:shadow-[0_0_0_2px_rgba(0,230,118,0.55)]',
          'transition-shadow duration-150',
          className
        )}
        ref={ref}
        {...props}
      />
    );
  }
);
Input.displayName = 'Input';
