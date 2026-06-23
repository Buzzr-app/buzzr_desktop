import * as React from 'react';
import { cn } from '@/components/utils';

export interface TextareaProps
  extends React.TextareaHTMLAttributes<HTMLTextAreaElement> {}

export const Textarea = React.forwardRef<HTMLTextAreaElement, TextareaProps>(
  ({ className, ...props }, ref) => {
    return (
      <textarea
        className={cn(
          'flex min-h-[120px] w-full bg-canvas text-foreground border border-border',
          'px-4 py-4 text-[16px] leading-[1.5] tracking-[-0.025em]',
          'rounded-input',
          'placeholder:text-muted',
          'focus:outline-none focus:shadow-[0_0_0_2px_rgb(var(--accent-rgb)_/_0.55)]',
          'transition-shadow duration-150',
          className
        )}
        ref={ref}
        {...props}
      />
    );
  }
);
Textarea.displayName = 'Textarea';
