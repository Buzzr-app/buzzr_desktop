import Link from 'next/link';
import type { ReactNode } from 'react';
import { cn } from '@/components/utils';

export function EditorialPill({
  href,
  children,
  isActive = false
}: {
  href: string;
  children: ReactNode;
  isActive?: boolean;
}) {
  return (
    <Link
      href={href}
      aria-current={isActive ? 'page' : undefined}
      className={cn(
        'inline-flex min-h-[34px] items-center rounded-full border px-3 py-1 font-mono text-[11px] uppercase leading-none tracking-[0.12em] transition-colors',
        isActive
          ? 'border-accent/60 bg-accent/15 text-white'
          : 'border-white/12 bg-white/[0.04] text-white/58 hover:border-white/28 hover:text-white'
      )}
    >
      {children}
    </Link>
  );
}
