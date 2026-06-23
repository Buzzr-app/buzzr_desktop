'use client';

import { useEffect, useRef } from 'react';
import { HeroLogoSwarm } from '@/components/ui/HeroLogoSwarm';
import { HERO_BANDS, bandProgress, sampleHeroProgress } from '@/src/lib/heroProgress';

/**
 * HeroCopy - the pinned-scroll narrative overlay that lives inside the sticky
 * hero stage. It samples the same `[data-hero-pin]` progress the WebGL scene
 * uses, so the copy choreography stays locked to the ball-explosion + phone-rise:
 *
 *   p≈0.0  → centered intro headline + CTAs
 *   p≈0.5  → intro dissolves as the ball detonates
 *   p≈1.0  → phone stands center stage; Buzzr marks drift in the side gutters.
 *            No CTAs at the end of scroll - the persistent nav CTA covers that.
 *
 * Styles are written straight to refs each frame (no per-frame React render).
 * Reduced motion collapses the pin, so we just paint the final composition.
 */
export function HeroCopy() {
  const rootRef = useRef<HTMLDivElement>(null);
  const introRef = useRef<HTMLDivElement>(null);
  const swarmRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const root = rootRef.current;
    const intro = introRef.current;
    const swarm = swarmRef.current;
    if (!root || !intro || !swarm) return;

    const pin = root.closest<HTMLElement>('[data-hero-pin]');
    const reduceMQ = window.matchMedia('(prefers-reduced-motion: reduce)');

    const paint = (p: number) => {
      // Intro layer (headline + CTAs) fades + lifts away as the sequence starts.
      const out = bandProgress(HERO_BANDS.introOut, p);
      intro.style.opacity = String(1 - out);
      intro.style.transform = `translateY(${-22 * out}px)`;
      intro.style.pointerEvents = out > 0.5 ? 'none' : 'auto';

      // Floating Buzzr marks fade + settle in on the same band the wordmark used.
      const sIn = bandProgress(HERO_BANDS.logo, p);
      swarm.style.opacity = String(sIn);
      swarm.style.transform = `translateY(${10 * (1 - sIn)}px)`;
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

        {/* Headline rings the ball on two symmetric arcs (Encircle). No outline
            border - a soft cast shadow carries legibility; a slight perspective
            tilt makes the words read as if they curve around the globe in 3D. */}
        <div
          aria-hidden
          className="pointer-events-none absolute left-1/2 top-[50%] h-[min(106vh,92vw)] w-[min(106vh,92vw)] -translate-x-1/2 -translate-y-1/2 select-none md:top-[51%]"
          style={{ perspective: '1500px' }}
        >
          <div className="h-full w-full" style={{ transform: 'rotateX(4deg)', transformStyle: 'preserve-3d' }}>
            <svg
              viewBox="0 0 560 560"
              style={{
                fontFamily: 'var(--ff-hero), var(--font-geist-sans), ui-sans-serif, system-ui, sans-serif',
                overflow: 'visible',
                filter: 'drop-shadow(0 6px 24px rgba(0, 0, 0, 0.45))'
              }}
              className="hero-encircle h-full w-full animate-fade-in-up"
            >
              <defs>
                {/* Big but contained ring, tight to the center so every word stays on-screen. */}
                <path id="heroArcTop" d="M 72 232 Q 280 -24 488 232" fill="none" />
                <path id="heroArcBot" d="M 72 328 Q 280 584 488 328" fill="none" />
              </defs>
              {/* "The [home icon] for all" - 'home' is the icon at the apex,
                  'all' switches to a cool italic serif. */}
              <text fontSize="55" fontWeight="800" letterSpacing="-2.4" fill="#ffffff">
                <textPath href="#heroArcTop" startOffset="27%" textAnchor="middle">The</textPath>
              </text>
              <g
                transform="translate(257 81) scale(1.9)"
                fill="none"
                stroke="#ffffff"
                strokeWidth="2.1"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <path d="m3 9 9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z" />
                <path d="M9 22V12h6v10" />
              </g>
              <text fontSize="55" fontWeight="800" letterSpacing="-2.4" fill="#ffffff">
                <textPath href="#heroArcTop" startOffset="70%" textAnchor="middle">for all</textPath>
              </text>
              <text fontSize="55" fontWeight="800" letterSpacing="-2.4" fill="#ffffff">
                <textPath href="#heroArcBot" startOffset="50%" textAnchor="middle">sports fans.</textPath>
              </text>
            </svg>
          </div>
        </div>

      </div>

      {/* Reveal: Buzzr marks drift in the gutters around the risen phone. */}
      <div ref={swarmRef} className="absolute inset-0 opacity-0 will-change-[transform,opacity]">
        <HeroLogoSwarm />
      </div>
    </div>
  );
}
