'use client';

import Image from 'next/image';
import { useEffect, useRef } from 'react';
import { cn } from '@/components/utils';

/**
 * The hero centerpiece: a huge mint "clay" iPhone showing the dashboard screen,
 * scrubbed through a bounded 3D turn by vertical scroll, over a receding token
 * grid floor. All colour is token-driven (see the .cp-* rules in globals.css);
 * the rAF handler only writes a single clamped `--p` (in [-1,1]) on the stage,
 * so there is no React re-render in the scroll hot path and SSR == first paint
 * (level pose) == no hydration mismatch. Fully static under reduced-motion.
 */
export function ScrollClayPhone({ className }: { className?: string }) {
  const stageRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const el = stageRef.current;
    if (!el) return;

    const reduce = window.matchMedia('(prefers-reduced-motion: reduce)');
    let raf = 0;

    const update = () => {
      raf = 0;
      const r = el.getBoundingClientRect();
      const vh = window.innerHeight;
      const center = r.top + r.height / 2;
      // signed, ~0 when the stage is centred in the viewport
      const p = (center - vh / 2) / (vh / 2 + r.height / 2);
      const c = Math.max(-1, Math.min(1, p)); // hard bounds before easing
      // sign-preserving smoothstep: weighty near centre, eases at the extremes
      const eased = Math.sign(c) * (c * c * (3 - 2 * Math.abs(c)));
      el.style.setProperty('--p', eased.toFixed(3));
    };

    const onScroll = () => {
      if (!raf) raf = requestAnimationFrame(update);
    };

    const attach = () => {
      if (reduce.matches) {
        el.style.setProperty('--p', '0');
        return;
      }
      update();
      window.addEventListener('scroll', onScroll, { passive: true });
      window.addEventListener('resize', onScroll, { passive: true });
    };

    const detach = () => {
      window.removeEventListener('scroll', onScroll);
      window.removeEventListener('resize', onScroll);
      if (raf) cancelAnimationFrame(raf);
      raf = 0;
    };

    attach();
    const onMqChange = () => {
      detach();
      attach();
    };
    reduce.addEventListener('change', onMqChange);

    return () => {
      detach();
      reduce.removeEventListener('change', onMqChange);
    };
  }, []);

  return (
    <div className={cn('cphone', className)}>
      <div ref={stageRef} className="cp-stage">
        <div aria-hidden className="cp-horizon" />
        <div aria-hidden className="cp-floor" />
        <div aria-hidden className="cp-shadow" />

        <div className="cp-phone">
          <div className="cp-bezel">
            <div className="cp-screen">
              <Image
                src="/app-screens/dashboard.png"
                alt="The Buzzr My Teams dashboard"
                fill
                sizes="(max-width: 1024px) 0px, 280px"
                className="object-cover object-top"
                priority={false}
              />
            </div>
            <div aria-hidden className="cp-island" />
            <div aria-hidden className="cp-glare" />
          </div>
          <span aria-hidden className="cp-btn cp-btn-a" />
          <span aria-hidden className="cp-btn cp-btn-b" />
          <span aria-hidden className="cp-btn cp-btn-pwr" />
        </div>
      </div>
    </div>
  );
}
