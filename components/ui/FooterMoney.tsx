'use client';

import { useEffect, useRef } from 'react';
import { cn } from '@/components/utils';

/**
 * FooterMoney - cash blowing up from the bottom of the final CTA, ramping in as
 * the "Get the app" button rises into view. Bills launch from the bottom edge,
 * drift up-and-sideways with a tumble, and fade out. The whole layer's opacity
 * tracks the CTA's scroll proximity (0 when it is still below the fold, 1 once
 * it is well in view). Pure CSS motion; collapses under prefers-reduced-motion.
 */

type Bill = {
  emoji: string;
  left: number;
  size: number;
  dur: number;
  delay: number;
  dx: number;
  r0: number;
  r1: number;
  o: number;
};

const BILLS: readonly Bill[] = [
  { emoji: '💵', left: 6, size: 34, dur: 3.4, delay: 0.0, dx: -30, r0: -20, r1: 16, o: 0.95 },
  { emoji: '💸', left: 15, size: 28, dur: 4.0, delay: 0.7, dx: 22, r0: 14, r1: -18, o: 0.82 },
  { emoji: '💵', left: 24, size: 30, dur: 3.7, delay: 1.4, dx: -16, r0: -10, r1: 12, o: 0.9 },
  { emoji: '💰', left: 33, size: 26, dur: 4.3, delay: 0.4, dx: 14, r0: 8, r1: -14, o: 0.8 },
  { emoji: '💵', left: 42, size: 36, dur: 3.2, delay: 1.9, dx: -24, r0: -16, r1: 18, o: 0.96 },
  { emoji: '💸', left: 50, size: 28, dur: 3.9, delay: 0.9, dx: 20, r0: 12, r1: -10, o: 0.85 },
  { emoji: '💵', left: 58, size: 32, dur: 3.6, delay: 1.6, dx: -18, r0: -12, r1: 14, o: 0.9 },
  { emoji: '💰', left: 66, size: 26, dur: 4.2, delay: 0.2, dx: 16, r0: 10, r1: -16, o: 0.8 },
  { emoji: '💵', left: 75, size: 34, dur: 3.3, delay: 1.1, dx: -26, r0: -18, r1: 12, o: 0.94 },
  { emoji: '💸', left: 84, size: 28, dur: 4.0, delay: 2.0, dx: 24, r0: 14, r1: -12, o: 0.83 },
  { emoji: '💵', left: 92, size: 30, dur: 3.8, delay: 0.6, dx: -14, r0: -8, r1: 16, o: 0.9 },
  { emoji: '💸', left: 11, size: 24, dur: 4.5, delay: 2.3, dx: 18, r0: 10, r1: -14, o: 0.75 },
  { emoji: '💵', left: 38, size: 24, dur: 4.4, delay: 2.6, dx: -12, r0: -10, r1: 10, o: 0.78 },
  { emoji: '💰', left: 71, size: 24, dur: 4.6, delay: 1.3, dx: 14, r0: 12, r1: -12, o: 0.76 }
];

type BillVars = React.CSSProperties & {
  '--dx'?: string;
  '--r0'?: string;
  '--r1'?: string;
  '--o'?: string;
  '--dur'?: string;
  '--d'?: string;
};

export function FooterMoney({ className }: { className?: string }) {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const section = el.closest('section');
    if (!section) return;

    let raf = 0;
    const update = () => {
      raf = 0;
      const cta = section.querySelector('a[href]');
      const vh = window.innerHeight || 1;
      const top = (cta ?? section).getBoundingClientRect().top;
      // 0 while the CTA is still below the fold, 1 once it is well into view.
      const p = Math.max(0, Math.min(1, (vh - top) / (vh * 0.55)));
      el.style.opacity = String(p);
    };
    const onScroll = () => {
      if (!raf) raf = requestAnimationFrame(update);
    };
    update();
    window.addEventListener('scroll', onScroll, { passive: true });
    window.addEventListener('resize', onScroll);
    return () => {
      if (raf) cancelAnimationFrame(raf);
      window.removeEventListener('scroll', onScroll);
      window.removeEventListener('resize', onScroll);
    };
  }, []);

  return (
    <div ref={ref} aria-hidden className={cn('pointer-events-none', className)} style={{ opacity: 0 }}>
      {BILLS.map((b, i) => (
        <span
          key={i}
          className="footer-money-bill absolute bottom-0 block select-none"
          style={
            {
              left: `${b.left}%`,
              fontSize: `${b.size}px`,
              '--dx': `${b.dx}px`,
              '--r0': `${b.r0}deg`,
              '--r1': `${b.r1}deg`,
              '--o': String(b.o),
              '--dur': `${b.dur}s`,
              '--d': `${b.delay}s`
            } as BillVars
          }
        >
          {b.emoji}
        </span>
      ))}
    </div>
  );
}
