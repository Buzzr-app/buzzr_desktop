'use client';

import { useEffect, useRef } from 'react';
import Link from 'next/link';
import { MagneticButton } from '@/components/ui/MagneticButton';
import { ShimmerText, ShimmerHoverLabel } from '@/components/ui/BrandShimmer';
import { AppleIcon, DiscordIcon } from '@/components/ui/BrandIcons';
import { APP_STORE_URL, DISCORD_URL } from '@/src/lib/constants';
import { HERO_BANDS, bandProgress, sampleHeroProgress } from '@/src/lib/heroProgress';
import { BrandMark } from '@/components/BrandMark';

/**
 * HeroCopy - the pinned-scroll narrative overlay that lives inside the sticky
 * hero stage. It samples the same `[data-hero-pin]` progress the WebGL scene
 * uses, so the copy choreography stays locked to the ball-explosion + phone-rise:
 *
 *   p≈0.0  → centered intro headline + CTAs
 *   p≈0.5  → intro dissolves as the ball detonates
 *   p≈1.0  → centered "BUZZR" reveal,
 *            framing the phone now standing center stage.
 *
 * Styles are written straight to refs each frame (no per-frame React render).
 * Reduced motion collapses the pin, so we just paint the final centered state.
 */
export function HeroCopy() {
  const rootRef = useRef<HTMLDivElement>(null);
  const frostRef = useRef<HTMLDivElement>(null);
  const introRef = useRef<HTMLDivElement>(null);
  const wordRef = useRef<HTMLDivElement>(null);
  const taglineRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const root = rootRef.current;
    const frost = frostRef.current;
    const intro = introRef.current;
    const word = wordRef.current;
    const tagline = taglineRef.current;
    if (!root || !frost || !intro || !word || !tagline) return;

    const pin = root.closest<HTMLElement>('[data-hero-pin]');
    const reduceMQ = window.matchMedia('(prefers-reduced-motion: reduce)');

    const paint = (p: number) => {
      // Intro layer fades + lifts away as the sequence starts.
      const out = bandProgress(HERO_BANDS.introOut, p);
      intro.style.opacity = String(1 - out);
      intro.style.transform = `translateY(${-22 * out}px)`;
      intro.style.pointerEvents = out > 0.5 ? 'none' : 'auto';
      frost.style.opacity = String(0.86 * (1 - out));
      frost.style.transform = `translate3d(-50%, ${-10 * out}px, 0) scale(${1 + out * 0.06})`;

      // Brand wordmark drops in from above (top band).
      const wIn = bandProgress(HERO_BANDS.logo, p);
      word.style.opacity = String(wIn);
      word.style.transform = `translateY(${-22 * (1 - wIn)}px)`;
      word.style.letterSpacing = `${-0.012 + 0.04 * (1 - wIn)}em`;

      // Tagline + CTAs rise in from below (bottom band), trailing the wordmark.
      const tIn = bandProgress(HERO_BANDS.tagline, p);
      tagline.style.opacity = String(tIn);
      tagline.style.transform = `translateY(${20 * (1 - tIn)}px)`;
      tagline.style.pointerEvents = tIn > 0.5 ? 'auto' : 'none';
    };

    // Reduced motion → static final composition, no scroll region to sample.
    if (reduceMQ.matches || !pin) {
      paint(1);
      return;
    }

    let raf = 0;
    let last = -1;
    const sample = () => sampleHeroProgress(pin, false);
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
      <div ref={frostRef} aria-hidden className="hero-copy-frost" />

      <div ref={introRef} className="absolute inset-0 flex items-start justify-center will-change-[transform,opacity]">
        <div className="pointer-events-auto mx-auto flex w-full max-w-[780px] flex-col items-center px-6 pt-[16vh] text-center md:pt-[17vh]">
          <div className="mb-5 animate-fade-in-up">
            <BrandMark alt="Buzzr" size={62} variant="transparent" priority />
          </div>
          <h1
            id="hero-title"
            className="max-w-[11ch] animate-fade-in-up text-balance text-[clamp(40px,7vw,76px)] font-semibold leading-[1.02] tracking-[-0.032em] text-white"
          >
            The AI-native home for sports fans.
          </h1>
          <p className="mt-5 max-w-[30ch] animate-fade-in-up stagger-1 text-pretty text-[16px] leading-[1.5] tracking-[-0.02em] text-white/66 md:text-[18px]">
            Scroll games, dashboards, friends, leagues, and Buzzr Bets in one sports social app.
          </p>

          <div className="mt-7 flex animate-fade-in-up stagger-2 flex-wrap items-center justify-center gap-3">
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
              className="inline-flex items-center gap-2 rounded-button border border-white/12 bg-white/[0.06] px-5 py-3 text-[15px] font-medium tracking-[-0.01em] text-white transition-[background-color,border-color,transform] duration-200 ease-out hover:-translate-y-0.5 hover:bg-white/[0.1] active:translate-y-0 focus-visible:outline-none focus-visible:shadow-[var(--shadow-focus)]"
            >
              <DiscordIcon size={17} />
              Join the Discord<span className="sr-only"> (opens in new tab)</span>
            </Link>
          </div>
        </div>

        <div className="pointer-events-none absolute bottom-7 left-1/2 flex -translate-x-1/2 animate-fade-in-up stagger-5 items-center gap-2 font-mono text-[11px] uppercase tracking-[0.14em] text-white/42">
          <span>Scroll to explore</span>
          <span aria-hidden>↓</span>
        </div>
      </div>

      <div
        ref={wordRef}
        className="absolute inset-x-0 top-0 flex justify-center px-6 pt-[12vh] opacity-0 will-change-[transform,opacity]"
      >
        <ShimmerText
          kind="ramp"
          duration={2.4}
          pauseBetween={1400}
          className="select-none text-center text-[clamp(46px,10vw,116px)] font-bold leading-[0.9] tracking-[-0.012em] text-white"
        >
          BUZZR
        </ShimmerText>
      </div>

      <div
        ref={taglineRef}
        className="absolute inset-x-0 top-0 flex flex-col items-center gap-4 px-6 pt-[25vh] text-center opacity-0 will-change-[transform,opacity] md:pt-[26vh]"
      >
        <p className="max-w-[28ch] text-balance text-[clamp(16px,2.1vw,24px)] font-medium leading-[1.24] tracking-[-0.015em] text-white">
          <ShimmerText kind="accent" className="text-accent-text">
            AI-Native
          </ShimmerText>{' '}
          sports social media for every game that moves the room.
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
            className="inline-flex items-center rounded-button border border-white/12 bg-white/[0.06] px-5 py-3 text-[15px] font-medium tracking-[-0.01em] text-white transition-[background-color,border-color,transform] duration-200 ease-out hover:-translate-y-0.5 hover:bg-white/[0.1] active:translate-y-0 focus-visible:outline-none focus-visible:shadow-[var(--shadow-focus)]"
          >
            Join the Discord<span className="sr-only"> (opens in new tab)</span>
          </Link>
        </div>
      </div>
    </div>
  );
}
