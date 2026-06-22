'use client';

import { useEffect, useRef } from 'react';
import Link from 'next/link';
import { MagneticButton } from '@/components/ui/MagneticButton';
import { ShimmerText, ShimmerHoverLabel } from '@/components/ui/BrandShimmer';
import { AppleIcon, DiscordIcon } from '@/components/ui/BrandIcons';
import { APP_STORE_URL, DISCORD_URL } from '@/src/lib/constants';

const clamp01 = (t: number) => Math.max(0, Math.min(1, t));
const smooth = (e0: number, e1: number, x: number) => {
  const t = clamp01((x - e0) / (e1 - e0));
  return t * t * (3 - 2 * t);
};

/**
 * HeroCopy — the pinned-scroll narrative overlay that lives inside the sticky
 * hero stage. It samples the same `[data-hero-pin]` progress the WebGL scene
 * uses, so the copy choreography stays locked to the ball-explosion + phone-rise:
 *
 *   p≈0.0  → left-aligned intro headline + CTAs (the quiet opening)
 *   p≈0.5  → intro dissolves as the ball detonates
 *   p≈1.0  → centered "BUZZR / the first AI-Native Sports Social Media" reveal,
 *            framing the phone now standing center stage.
 *
 * Styles are written straight to refs each frame (no per-frame React render).
 * Reduced motion collapses the pin, so we just paint the final centered state.
 */
export function HeroCopy() {
  const rootRef = useRef<HTMLDivElement>(null);
  const introRef = useRef<HTMLDivElement>(null);
  const wordRef = useRef<HTMLDivElement>(null);
  const taglineRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const root = rootRef.current;
    const intro = introRef.current;
    const word = wordRef.current;
    const tagline = taglineRef.current;
    if (!root || !intro || !word || !tagline) return;

    const pin = root.closest<HTMLElement>('[data-hero-pin]');
    const reduceMQ = window.matchMedia('(prefers-reduced-motion: reduce)');

    const paint = (p: number) => {
      // Intro layer fades + lifts away as the sequence starts.
      const out = smooth(0.0, 0.4, p);
      intro.style.opacity = String(1 - out);
      intro.style.transform = `translateY(${-22 * out}px)`;
      intro.style.pointerEvents = out > 0.5 ? 'none' : 'auto';

      // Brand wordmark drops in from above (top band).
      const wIn = smooth(0.46, 0.86, p);
      word.style.opacity = String(wIn);
      word.style.transform = `translateY(${-30 * (1 - wIn)}px)`;
      word.style.letterSpacing = `${-0.02 + 0.06 * (1 - wIn)}em`;

      // Tagline + CTAs rise in from below (bottom band), trailing the wordmark.
      const tIn = smooth(0.56, 0.98, p);
      tagline.style.opacity = String(tIn);
      tagline.style.transform = `translateY(${34 * (1 - tIn)}px)`;
      tagline.style.pointerEvents = tIn > 0.5 ? 'auto' : 'none';
    };

    // Reduced motion → static final composition, no scroll region to sample.
    if (reduceMQ.matches || !pin) {
      paint(1);
      return;
    }

    let raf = 0;
    let last = -1;
    const sample = () => {
      const rect = pin.getBoundingClientRect();
      const total = rect.height - window.innerHeight;
      return total <= 0 ? 0 : clamp01(-rect.top / total);
    };
    const tick = () => {
      raf = requestAnimationFrame(tick);
      const p = sample();
      if (Math.abs(p - last) < 0.0005) return;
      last = p;
      paint(p);
    };
    paint(sample());
    raf = requestAnimationFrame(tick);

    // requestAnimationFrame is throttled to ~0fps on hidden tabs, which would
    // freeze the copy mid-scroll. Painting on scroll while hidden keeps it in
    // sync with the WebGL sequence; it's a cheap no-op when the tab is visible.
    const onScroll = () => {
      if (!document.hidden) return;
      paint(sample());
    };
    window.addEventListener('scroll', onScroll, { passive: true });

    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener('scroll', onScroll);
    };
  }, []);

  return (
    <div ref={rootRef} className="pointer-events-none absolute inset-0 z-10">
      {/* ── Intro layer: the quiet opening, left-aligned ── */}
      <div ref={introRef} className="absolute inset-0 flex items-start will-change-[transform,opacity]">
        <div className="pointer-events-auto mx-auto flex w-full max-w-[1240px] flex-col items-center px-6 pt-32 text-center md:px-10 md:pt-40">
          <h1
            id="hero-title"
            className="mx-auto max-w-[20ch] animate-fade-in-up text-[clamp(40px,8vw,72px)] font-semibold leading-[1.04] tracking-[-0.032em] text-foreground"
          >
            AI-Native Sports Social Media
          </h1>

          <div className="mt-9 flex animate-fade-in-up stagger-2 flex-wrap items-center justify-center gap-3">
            <MagneticButton
              href={APP_STORE_URL}
              external
              className="inline-flex items-center gap-2 rounded-button bg-accent px-5 py-3 text-[15px] font-medium tracking-[-0.01em] text-on-accent shadow-[var(--shadow-card)] hover:bg-accent-dim focus-visible:outline-none focus-visible:shadow-[var(--shadow-focus)]"
            >
              <AppleIcon size={17} />
              <ShimmerHoverLabel>Get the app</ShimmerHoverLabel>
              <span className="sr-only"> (opens in new tab)</span>
            </MagneticButton>
            <Link
              href={DISCORD_URL}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 rounded-button border border-border bg-surface px-5 py-3 text-[15px] font-medium tracking-[-0.01em] text-foreground transition-[background-color,border-color,transform] duration-200 ease-out hover:-translate-y-0.5 hover:bg-subtle active:translate-y-0 focus-visible:outline-none focus-visible:shadow-[var(--shadow-focus)]"
            >
              <DiscordIcon size={17} />
              Join the Discord<span className="sr-only"> (opens in new tab)</span>
            </Link>
          </div>
        </div>

        <div className="pointer-events-none absolute bottom-7 left-6 flex animate-fade-in-up stagger-5 items-center gap-2 font-mono text-[11px] uppercase tracking-[0.14em] text-whisper md:left-10">
          <span>Scroll to explore</span>
          <span aria-hidden>↓</span>
        </div>
      </div>

      {/* ── Reveal layer: brand wordmark (top) framing the phone, tagline (bottom) ── */}
      <div
        ref={wordRef}
        className="absolute inset-x-0 top-0 flex justify-center px-6 pt-[12vh] opacity-0 will-change-[transform,opacity]"
      >
        <ShimmerText
          kind="ramp"
          duration={2.4}
          pauseBetween={1400}
          className="select-none text-center text-[clamp(56px,13vw,148px)] font-bold leading-[0.9] tracking-[-0.02em] text-foreground"
        >
          BUZZR
        </ShimmerText>
      </div>

      <div
        ref={taglineRef}
        className="absolute inset-x-0 bottom-0 flex flex-col items-center gap-6 px-6 pb-[9vh] text-center opacity-0 will-change-[transform,opacity]"
      >
        <p className="max-w-[24ch] text-[clamp(18px,2.6vw,28px)] font-medium leading-[1.2] tracking-[-0.015em] text-foreground">
          the first{' '}
          <ShimmerText kind="accent" className="text-accent-text">
            AI-Native
          </ShimmerText>{' '}
          Sports Social Media
        </p>
        <div className="flex flex-wrap items-center justify-center gap-3">
          <MagneticButton
            href={APP_STORE_URL}
            external
            className="inline-flex items-center rounded-button bg-accent px-5 py-3 text-[15px] font-medium tracking-[-0.01em] text-on-accent shadow-[var(--shadow-card)] hover:bg-accent-dim focus-visible:outline-none focus-visible:shadow-[var(--shadow-focus)]"
          >
            Get the app<span className="sr-only"> (opens in new tab)</span>
          </MagneticButton>
          <Link
            href={DISCORD_URL}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center rounded-button border border-border bg-surface px-5 py-3 text-[15px] font-medium tracking-[-0.01em] text-foreground transition-[background-color,border-color,transform] duration-200 ease-out hover:-translate-y-0.5 hover:bg-subtle active:translate-y-0 focus-visible:outline-none focus-visible:shadow-[var(--shadow-focus)]"
          >
            Join the Discord<span className="sr-only"> (opens in new tab)</span>
          </Link>
        </div>
      </div>
    </div>
  );
}
