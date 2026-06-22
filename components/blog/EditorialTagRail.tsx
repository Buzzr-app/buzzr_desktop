import type { ReactNode } from 'react';
import { cn } from '@/components/utils';

export function EditorialTagRail({
  label,
  children,
  className
}: {
  label: string;
  children: ReactNode;
  className?: string;
}) {
  return (
    <nav
      aria-label={label}
      className={cn(
        'flex flex-wrap items-center gap-2 border-y border-white/10 py-4',
        className
      )}
    >
      <span className="mr-2 font-mono text-[12px] uppercase leading-[2] tracking-[0.1em] text-white/45">
        {label}
      </span>
      {children}
    </nav>
  );
}
