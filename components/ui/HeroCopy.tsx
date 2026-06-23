'use client';

import { useEffect, useRef } from 'react';
import Link from 'next/link';
import { MagneticButton } from '@/components/ui/MagneticButton';
import { ShimmerText, ShimmerHoverLabel } from '@/components/ui/BrandShimmer';
import { AppleIcon, DiscordIcon } from '@/components/ui/BrandIcons';
import { APP_STORE_URL, DISCORD_URL } from '@/src/lib/constants';
import { HERO_BANDS, bandProgress, sampleHeroProgress } from '@/src/lib/heroProgress';

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
      const out = bandProgress(HERO_BANDS.introOut, p);
      intro.style.opacity = String(1 - out);
      intro.style.transform = `translateY(${-22 * out}px)`;
      intro.style.pointerEvents = out > 0.5 ? 'none' : 'auto';

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
      <div ref={introRef} className="absolute inset-0 will-change-[transform,opacity]">
        <h1 id="hero-title" className="sr-only">
          The home for all sports fans.
        </h1>

        {/* Headline wraps the ball on two arcs (Encircle). The dark text outline
            keeps it legible over the green/molten without a blur scrim. */}
        <svg
          aria-hidden
          viewBox="0 0 560 560"
          style={{ fontFamily: 'var(--ff-hero), var(--font-geist-sans), ui-sans-serif, system-ui, sans-serif' }}
          className="hero-encircle pointer-events-none absolute left-1/2 top-[48%] h-[min(104vw,90vh)] w-[min(104vw,90vh)] -translate-x-1/2 -translate-y-1/2 animate-fade-in-up select-none md:top-[49%]"
        >
          <defs>
            <path id="heroArcTop" d="M 58 302 Q 280 10 502 302" fill="none" />
            <path id="heroArcBot" d="M 96 346 Q 280 592 464 346" fill="none" />
          </defs>
          <text fontSize="45" fontWeight="800" letterSpacing="-1.45" fill="#ffffff" stroke="#04120a" strokeWidth="2" strokeLinejoin="round" paintOrder="stroke">
            <textPath href="#heroArcTop" startOffset="50%" textAnchor="middle">The home for all</textPath>
          </text>
          <text fontSize="45" fontWeight="800" letterSpacing="-1.45" fill="#ffffff" stroke="#04120a" strokeWidth="2" strokeLinejoin="round" paintOrder="stroke">
            <textPath href="#heroArcBot" startOffset="50%" textAnchor="middle">sports fans.</textPath>
          </text>
        </svg>

        <div className="pointer-events-auto absolute inset-x-0 bottom-[22vh] flex animate-fade-in-up stagger-2 flex-wrap items-center justify-center gap-3 px-6 sm:bottom-[12vh]">
          <MagneticButton
            href={APP_STORE_URL}
            external
            className="inline-flex items-center gap-2 rounded-control bg-accent px-5 py-3 text-[15px] font-semibold tracking-[-0.01em] text-on-accent shadow-[0_14px_34px_-12px_rgba(0,194,100,0.6)] transition-[background-color,transform] duration-200 ease-out hover:bg-accent-dim active:scale-[0.97] focus-visible:outline-none focus-visible:shadow-[var(--shadow-focus)]"
          >
            <AppleIcon size={17} />
            <ShimmerHoverLabel>Get the app</ShimmerHoverLabel>
            <span className="sr-only"> (opens in new tab)</span>
          </MagneticButton>
          <Link
            href={DISCORD_URL}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 rounded-control border border-white/15 bg-black/35 px-5 py-3 text-[15px] font-semibold tracking-[-0.01em] text-white backdrop-blur-md transition-[background-color,border-color,transform] duration-200 ease-out hover:-translate-y-0.5 hover:bg-black/55 active:translate-y-0 focus-visible:outline-none focus-visible:shadow-[var(--shadow-focus)]"
          >
            <DiscordIcon size={17} />
            Join the Discord<span className="sr-only"> (opens in new tab)</span>
          </Link>
        </div>

        <div className="pointer-events-none absolute bottom-7 left-1/2 flex -translate-x-1/2 animate-fade-in-up stagger-5 items-center gap-2 font-mono text-[11px] uppercase tracking-[0.14em] text-white/42">
          <span>Scroll to explore</span>
          <span aria-hidden>↓</span>
        </div>
      </div>

      <div
        ref={wordRef}
        className="absolute inset-x-0 top-0 flex justify-center px-6 pt-[7vh] opacity-0 will-change-[transform,opacity] md:pt-[8vh]"
      >
        <ShimmerText
          kind="ramp"
          duration={2.4}
          pauseBetween={1400}
          className="font-hero select-none text-center text-[clamp(46px,10vw,116px)] font-extrabold leading-[0.9] tracking-[-0.02em] text-white"
        >
          BUZZR
        </ShimmerText>
      </div>

      <div
        ref={taglineRef}
        className="absolute inset-x-0 top-0 flex flex-col items-center gap-4 px-6 pt-[19vh] text-center opacity-0 will-change-[transform,opacity] md:pt-[20vh]"
      >
        <p className="font-hero max-w-[34ch] text-balance text-[clamp(17px,2.1vw,25px)] font-semibold leading-[1.18] tracking-[-0.02em] text-white md:max-w-[40ch]">
          <ShimmerText kind="accent" className="text-accent-text">
            AI-Native
          </ShimmerText>{' '}
          sports social media for every game that moves the room.
        </p>
        <div className="flex flex-wrap items-center justify-center gap-3">
          <MagneticButton
            href={APP_STORE_URL}
            external
            className="inline-flex items-center rounded-control bg-accent px-5 py-3 text-[15px] font-semibold tracking-[-0.01em] text-on-accent shadow-[0_14px_34px_-12px_rgba(0,194,100,0.6)] transition-[background-color,transform] duration-200 ease-out hover:bg-accent-dim active:scale-[0.97] focus-visible:outline-none focus-visible:shadow-[var(--shadow-focus)]"
          >
            Get the app<span className="sr-only"> (opens in new tab)</span>
          </MagneticButton>
          <Link
            href={DISCORD_URL}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center rounded-control border border-white/15 bg-black/35 px-5 py-3 text-[15px] font-semibold tracking-[-0.01em] text-white backdrop-blur-md transition-[background-color,border-color,transform] duration-200 ease-out hover:-translate-y-0.5 hover:bg-black/55 active:translate-y-0 focus-visible:outline-none focus-visible:shadow-[var(--shadow-focus)]"
          >
            Join the Discord<span className="sr-only"> (opens in new tab)</span>
          </Link>
        </div>
      </div>
    </div>
  );
}
