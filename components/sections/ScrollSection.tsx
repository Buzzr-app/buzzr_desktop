'use client';

import { useEffect, useRef, useState } from 'react';
import { Section } from '@/components/ui/Section';
import { PhoneShowcase } from '@/components/ui/PhoneShowcase';

// Emil strong ease-out: starts fast, settles soft. Reveal feels intentional, never weak.
const EASE_OUT = 'cubic-bezier(0.23, 1, 0.32, 1)';

/** Builds the transform/opacity reveal style for one item.
 *  `delay` staggers grouped items (60ms apart). When revealed is true the item
 *  settles to its resting state; before that it sits 10px low and transparent. */
function reveal(revealed: boolean, delay: number): React.CSSProperties {
  return {
    opacity: revealed ? 1 : 0,
    transform: revealed ? 'translateY(0)' : 'translateY(10px)',
    transition: `opacity 560ms ${EASE_OUT} ${delay}ms, transform 560ms ${EASE_OUT} ${delay}ms`,
    willChange: 'transform, opacity',
  };
}

/** Scroll-reveal section: copy + phone cascade up once as they enter view, then
 *  settle. Animates transform/opacity only; reduced motion shows content at rest
 *  with no movement. */
export function ScrollSection() {
  const rootRef = useRef<HTMLDivElement | null>(null);
  const [revealed, setRevealed] = useState(false);
  const [instant, setInstant] = useState(false);

  useEffect(() => {
    const node = rootRef.current;
    if (!node) return;

    // Reduced motion: no movement, no stagger, just show it.
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
      setInstant(true);
      setRevealed(true);
      return;
    }

    const observer = new IntersectionObserver(
      ([entry], obs) => {
        if (entry.isIntersecting) {
          setRevealed(true);
          obs.disconnect(); // fire once
        }
      },
      { threshold: 0.32, rootMargin: '0px 0px -12% 0px' }
    );

    observer.observe(node);
    return () => observer.disconnect();
  }, []);

  // In reduced-motion mode, drop the transition entirely so nothing animates.
  const at = (delay: number): React.CSSProperties =>
    instant ? { opacity: 1 } : reveal(revealed, delay);

  return (
    <Section id="scroll" aria-labelledby="scroll-title" className="py-20 md:py-28">
      <div
        ref={rootRef}
        className="grid items-center gap-10 lg:grid-cols-[minmax(0,0.92fr)_minmax(340px,0.86fr)] lg:gap-14"
      >
        <div className="mx-auto flex max-w-[520px] flex-col gap-6 text-center lg:mx-0 lg:text-left">
          <h2
            id="scroll-title"
            style={at(0)}
            className="max-w-[13ch] text-[clamp(34px,4.8vw,56px)] font-semibold leading-[0.98] tracking-[-0.034em] text-foreground"
          >
            Scroll knows what games are becoming.
          </h2>

          <p
            style={at(60)}
            className="max-w-[34ch] text-[16px] leading-[1.55] tracking-[-0.01em] text-muted"
          >
            A fast stream tuned by game state, stakes, and your leagues.
          </p>
        </div>

        <div
          style={at(120)}
          className="relative mx-auto grid w-full max-w-[430px] place-items-center lg:mx-0 lg:justify-self-end"
        >
          <div
            className="absolute inset-6 rounded-[32px] bg-accent/10 blur-3xl"
            aria-hidden
          />
          <PhoneShowcase
            src="/app-screens/games.png"
            alt="Buzzr Scroll game stream"
            priority
            aura
            size="medium"
            className="mx-auto"
          />
        </div>
      </div>
    </Section>
  );
}
