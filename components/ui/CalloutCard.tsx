import * as React from 'react';
import { cn } from '@/components/utils';

export interface CalloutCardProps extends React.HTMLAttributes<HTMLDivElement> {
  as?: 'div' | 'article' | 'section';
}

export const CalloutCard = React.forwardRef<HTMLDivElement, CalloutCardProps>(
  ({ as: Tag = 'div', className, ...props }, ref) => {
    const Component = Tag as 'div';
    return (
      <Component
        ref={ref}
        className={cn(
          'bg-surface border border-border rounded-lg p-4 shadow-[var(--shadow-card)]',
          'transition-[border-color,background-color,transform] duration-200 ease-out',
          'hover:border-accent/30 hover:bg-subtle/60 active:scale-[0.995]',
          className
        )}
        {...props}
      />
    );
  }
);
CalloutCard.displayName = 'CalloutCard';
