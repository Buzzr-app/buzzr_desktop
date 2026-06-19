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
          'bg-white/[0.02] border border-white/10 rounded-xl p-4',
          'transition-[border-color,box-shadow,background-color] duration-200',
          'hover:border-accent/40 hover:bg-white/[0.04] hover:shadow-[0_0_0_1px_rgba(0,230,118,0.15),inset_0_0_50px_rgba(0,230,118,0.05)]',
          className
        )}
        {...props}
      />
    );
  }
);
CalloutCard.displayName = 'CalloutCard';
