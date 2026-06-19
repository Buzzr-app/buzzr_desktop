import * as React from 'react';
import { cn } from '@/components/utils';

export interface BadgeProps extends React.HTMLAttributes<HTMLSpanElement> {}

export const Badge = React.forwardRef<HTMLSpanElement, BadgeProps>(
  ({ className, ...props }, ref) => {
    return (
      <span
        ref={ref}
        className={cn(
          'inline-flex items-center border border-white/15 bg-white/[0.03] text-muted',
          'font-mono text-[11px] leading-none tracking-[0.14em] uppercase',
          'rounded-full px-2.5 py-1',
          className
        )}
        {...props}
      />
    );
  }
);
Badge.displayName = 'Badge';
