'use client';

import { useEffect, useRef, useState } from 'react';
import { GradientShimmer, type GradientStop } from 'gradient-shimmer';

/**
 * Brand shimmer — gradient-shimmer wired to Buzzr the way a design engineer
 * would: token-driven (no hardcoded brand hex), restrained, and accessible.
 *
 *  • The sweep colors are read from CSS tokens at runtime — the Buzz heat ramp
 *    for the brand wordmark (it echoes the hero voxel ball) and an accent-green
 *    sweep for links/CTAs. The ramp + accent tokens are theme-stable (only
 *    canvas/foreground/steel flip on `.dark`), and `baseColor` stays
 *    `currentColor`, so the effect re-themes for free across light/dark.
 *  • Text renders plain on the server and the first client paint, then upgrades
 *    to the shimmer after mount — identical first markup on both sides, so no
 *    hydration mismatch (and graceful when the tokens can't be read).
 *  • gradient-shimmer already pauses off-screen and honours
 *    prefers-reduced-motion, so motion stays tasteful and considerate.
 */

type BrandGradients = { ramp: GradientStop[]; accent: GradientStop[] };

const stopsFrom = (cols: string[]): GradientStop[] =>
  cols
    .filter(Boolean)
    .map((color, i, a) => ({ color, position: a.length === 1 ? 0 : i / (a.length - 1) }));

function readGradients(): BrandGradients {
  const s = getComputedStyle(document.documentElement);
  const g = (n: string) => s.getPropertyValue(n).trim();
  return {
    // Echoes the hero voxel heat-ball: peak → great → good → mid → bad → garbage.
    ramp: stopsFrom([
      g('--color-buzz-peak'),
      g('--color-buzz-great'),
      g('--color-buzz-good'),
      g('--color-buzz-mid'),
      g('--color-buzz-bad'),
      g('--color-buzz-garbage')
    ]),
    // A green-intensity sweep for links + the App Store CTAs.
    accent: stopsFrom([
      g('--color-accent-dim'),
      g('--color-accent'),
      g('--color-buzz-peak'),
      g('--color-accent'),
      g('--color-accent-dim')
    ])
  };
}

// One read shared across every shimmer instance on the page.
let cached: BrandGradients | null = null;

function useBrandGradients(): BrandGradients | null {
  // Always null for the server + first client render so both paint plain text
  // (no hydration mismatch); the shimmer upgrades after mount. `cached` only
  // memoizes the token read across instances — it is never the initial state.
  const [grads, setGrads] = useState<BrandGradients | null>(null);
  useEffect(() => {
    if (!cached) cached = readGradients();
    setGrads(cached);
  }, []);
  return grads;
}

type ShimmerKind = 'ramp' | 'accent';

/**
 * Continuous, restrained shimmer for hero copy (the BUZZR wordmark, the
 * "AI-Native" highlight). Falls back to plain text until the tokens are read.
 */
export function ShimmerText({
  children,
  kind = 'accent',
  className,
  duration = 2,
  pauseBetween = 1600,
  spread = 3
}: {
  children: string;
  kind?: ShimmerKind;
  className?: string;
  duration?: number;
  pauseBetween?: number;
  spread?: number;
}) {
  const grads = useBrandGradients();
  if (!grads) return <span className={className}>{children}</span>;
  return (
    <GradientShimmer
      className={className}
      gradient={grads[kind]}
      easing="gentle"
      duration={duration}
      pauseBetween={pauseBetween}
      spread={spread}
      pauseOnScroll={false}
    >
      {children}
    </GradientShimmer>
  );
}

/**
 * Hover-gated shimmer for buttons (the App Store CTAs). The label is plain text
 * at rest; the accent sweep runs only while the host link/button is hovered.
 * The text string is identical in both states, so there is no layout shift.
 */
export function ShimmerHoverLabel({
  children,
  className
}: {
  children: string;
  className?: string;
}) {
  const grads = useBrandGradients();
  const ref = useRef<HTMLSpanElement>(null);
  const [hover, setHover] = useState(false);

  useEffect(() => {
    const host = ref.current?.closest('a,button');
    if (!host) return;
    const on = () => setHover(true);
    const off = () => setHover(false);
    host.addEventListener('pointerenter', on);
    host.addEventListener('pointerleave', off);
    return () => {
      host.removeEventListener('pointerenter', on);
      host.removeEventListener('pointerleave', off);
    };
  }, []);

  return (
    <span ref={ref} className={className}>
      {hover && grads ? (
        <GradientShimmer
          gradient={grads.accent}
          easing="snappy"
          duration={1}
          pauseBetween={240}
          spread={4}
          pauseOnScroll={false}
        >
          {children}
        </GradientShimmer>
      ) : (
        children
      )}
    </span>
  );
}
