'use client';

import Link from 'next/link';
import { useCallback, useRef, type ReactNode } from 'react';

type MagneticButtonProps = {
  href: string;
  children: ReactNode;
  className?: string;
  /** Max px the button pulls toward the cursor. */
  strength?: number;
  external?: boolean;
};

/**
 * MagneticButton - a Link that subtly pulls toward the cursor and snaps back,
 * the signature interface-craft micro-interaction. Movement is driven by an
 * inline transform with a spring-ish ease; hover color/shadow stay on the
 * className. Fully no-ops under prefers-reduced-motion.
 */
export function MagneticButton({
  href,
  children,
  className,
  strength = 14,
  external
}: MagneticButtonProps) {
  const ref = useRef<HTMLAnchorElement>(null);

  const prefersReduced = () =>
    typeof window !== 'undefined' &&
    window.matchMedia?.('(prefers-reduced-motion: reduce)').matches;

  const onMove = useCallback(
    (e: React.MouseEvent<HTMLAnchorElement>) => {
      const el = ref.current;
      if (!el || prefersReduced()) return;
      const r = el.getBoundingClientRect();
      const x = (e.clientX - (r.left + r.width / 2)) / r.width;
      const y = (e.clientY - (r.top + r.height / 2)) / r.height;
      el.style.transform = `translate(${x * strength}px, ${y * strength}px)`;
    },
    [strength]
  );

  const reset = useCallback(() => {
    const el = ref.current;
    if (el) el.style.transform = 'translate(0px, 0px)';
  }, []);

  return (
    <Link
      ref={ref}
      href={href}
      target={external ? '_blank' : undefined}
      rel={external ? 'noopener noreferrer' : undefined}
      onMouseMove={onMove}
      onMouseLeave={reset}
      className={className}
      style={{
        transition:
          'transform 0.25s cubic-bezier(0.22,1,0.36,1), background-color 0.2s ease, box-shadow 0.2s ease'
      }}
    >
      {children}
    </Link>
  );
}
