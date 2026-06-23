import Image from 'next/image';
import { BRAND_ASSETS } from '@/src/lib/brandAssets';

/**
 * HeroLogoSwarm - the reveal-state replacement for the old "BUZZR" wordmark.
 *
 * A handful of Buzzr "B" marks drift and breathe in the LEFT/RIGHT gutters
 * around the risen phone. Every logo is pinned to a gutter zone (x kept out of
 * the center ~36-64% phone column) so nothing ever floats over the screen.
 * Motion is pure CSS (float + breathe), desynced per-logo via --d/--bd delays,
 * and collapses to a static placement under prefers-reduced-motion. Group
 * opacity is driven by the parent's pin choreography.
 */

type Side = 'left' | 'right';

type FloatLogo = {
  side: Side;
  /** distance from the gutter edge (%) and vertical position (%) */
  inset: number;
  top: number;
  size: number;
  /** resting opacity (depth cue - far logos sit dimmer/smaller) */
  o: number;
  /** drift duration / breathe duration / their delays (seconds) */
  dur: number;
  bdur: number;
  d: number;
  bd: number;
  /** per-logo drift vector (px) */
  dx: number;
  dy: number;
};

// Tuned by eye: 4 per side, depth-sorted by size+opacity. `inset`+`top` keep
// every mark inside its gutter and clear of the center phone column.
const LOGOS: readonly FloatLogo[] = [
  { side: 'left', inset: 7, top: 19, size: 72, o: 0.95, dur: 8.5, bdur: 6.5, d: 0, bd: 0.4, dx: 12, dy: -18 },
  { side: 'left', inset: 17, top: 50, size: 52, o: 0.66, dur: 7, bdur: 5.5, d: 1.3, bd: 1.1, dx: -10, dy: -14 },
  { side: 'left', inset: 5, top: 74, size: 60, o: 0.82, dur: 9.5, bdur: 7, d: 2.4, bd: 0.2, dx: 9, dy: 16 },
  { side: 'left', inset: 24, top: 33, size: 42, o: 0.5, dur: 6.5, bdur: 6, d: 0.7, bd: 2.0, dx: -8, dy: 12 },
  { side: 'right', inset: 8, top: 23, size: 66, o: 0.9, dur: 8, bdur: 6.8, d: 0.9, bd: 0.9, dx: -13, dy: -16 },
  { side: 'right', inset: 18, top: 56, size: 48, o: 0.6, dur: 7.5, bdur: 5.8, d: 1.9, bd: 1.6, dx: 10, dy: -12 },
  { side: 'right', inset: 5, top: 78, size: 62, o: 0.84, dur: 9, bdur: 7.4, d: 0.3, bd: 0.6, dx: -9, dy: 15 },
  { side: 'right', inset: 25, top: 36, size: 40, o: 0.48, dur: 6.8, bdur: 6.2, d: 2.1, bd: 2.3, dx: 8, dy: 13 }
];

type LogoVars = React.CSSProperties & {
  '--logo-o'?: string;
  '--logo-dx'?: string;
  '--logo-dy'?: string;
  '--d'?: string;
  '--bd'?: string;
  '--dur'?: string;
  '--bdur'?: string;
};

export function HeroLogoSwarm() {
  return (
    <div aria-hidden className="hero-logo-swarm absolute inset-0">
      {LOGOS.map((logo, i) => (
        <span
          key={i}
          className="hero-logo absolute block"
          style={
            {
              top: `${logo.top}%`,
              [logo.side]: `${logo.inset}%`,
              width: logo.size,
              height: logo.size,
              '--logo-o': String(logo.o),
              '--logo-dx': `${logo.dx}px`,
              '--logo-dy': `${logo.dy}px`,
              '--d': `${logo.d}s`,
              '--bd': `${logo.bd}s`,
              '--dur': `${logo.dur}s`,
              '--bdur': `${logo.bdur}s`
            } as LogoVars
          }
        >
          <Image
            src={BRAND_ASSETS.transparent}
            alt=""
            width={logo.size}
            height={logo.size}
            className="hero-logo__img hero-logo__img--mark h-full w-full object-contain"
          />
        </span>
      ))}
    </div>
  );
}
