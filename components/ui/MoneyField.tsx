import { cn } from '@/components/utils';
import styles from './MoneyField.module.css';

/**
 * MoneyField - a cash-blower of clean SVG banknotes around the Bets phone.
 *
 * Bills launch low near the phone base and fly up-and-outward on a 3D stage
 * (perspective + preserve-3d) while tumbling on Y/X so they flip like real
 * cash, looping seamlessly. A `layer` prop splits the field into depth planes:
 * `back` renders small/dim/blurred BEHIND the phone, `front` renders
 * large/crisp IN FRONT - so the stream wraps the device with real depth.
 *
 * Pure CSS motion, biased toward the phone (right side). Collapses to a static
 * placement under prefers-reduced-motion. Decorative (pointer-events:none,
 * aria-hidden).
 */

type Layer = 'back' | 'front';

type Bill = {
  /** origin position in % within the host (low + toward the phone) */
  top: number;
  left: number;
  /** rendered note width (px) */
  size: number;
  /** opacity ceiling */
  o: number;
  /** loop duration + its stagger delay (seconds) */
  dur: number;
  d: number;
  /** fly vector (px): outward x, upward y */
  mx: number;
  my: number;
  /** tumble: base Y/X/Z rotation, full-loop Y spin, Z tilt sweep (deg) */
  ry0: number;
  rx0: number;
  rz0: number;
  spin: number;
  tilt: number;
  /** back-layer blur (px) */
  blur?: number;
};

// BACK plane: smaller, dimmer, softer, slower. Origins hug the phone base on the
// right and drift up-and-out behind the device. 14 bills for a clean stream.
const BACK_BILLS: readonly Bill[] = [
  { top: 78, left: 62, size: 22, o: 0.42, dur: 9.5, d: 0.0, mx: 30, my: -150, ry0: -28, rx0: 6, rz0: -10, spin: 320, tilt: 26, blur: 1.2 },
  { top: 82, left: 70, size: 26, o: 0.5, dur: 10.5, d: 0.8, mx: 54, my: -176, ry0: 18, rx0: -8, rz0: 8, spin: -300, tilt: -22, blur: 1.6 },
  { top: 74, left: 66, size: 19, o: 0.34, dur: 11.5, d: 1.7, mx: -22, my: -134, ry0: -12, rx0: 10, rz0: -6, spin: 280, tilt: 18, blur: 1.4 },
  { top: 80, left: 78, size: 30, o: 0.55, dur: 9.0, d: 2.4, mx: 64, my: -190, ry0: 32, rx0: -6, rz0: 12, spin: -340, tilt: -28, blur: 1.8 },
  { top: 84, left: 58, size: 24, o: 0.46, dur: 12.0, d: 3.1, mx: 10, my: -160, ry0: -22, rx0: 8, rz0: -8, spin: 300, tilt: 24, blur: 1.4 },
  { top: 76, left: 84, size: 28, o: 0.52, dur: 10.0, d: 0.5, mx: 78, my: -168, ry0: 24, rx0: -10, rz0: 10, spin: -260, tilt: -20, blur: 1.6 },
  { top: 86, left: 72, size: 20, o: 0.38, dur: 11.0, d: 1.3, mx: 42, my: -142, ry0: -18, rx0: 6, rz0: -12, spin: 320, tilt: 22, blur: 1.2 },
  { top: 72, left: 90, size: 32, o: 0.58, dur: 9.5, d: 2.0, mx: 88, my: -184, ry0: 30, rx0: -8, rz0: 14, spin: -310, tilt: -26, blur: 1.8 },
  { top: 82, left: 64, size: 23, o: 0.44, dur: 12.5, d: 2.8, mx: 18, my: -156, ry0: -26, rx0: 10, rz0: -6, spin: 290, tilt: 20, blur: 1.4 },
  { top: 78, left: 88, size: 26, o: 0.5, dur: 10.5, d: 3.6, mx: 92, my: -172, ry0: 20, rx0: -6, rz0: 8, spin: -330, tilt: -24, blur: 1.6 },
  { top: 88, left: 76, size: 21, o: 0.4, dur: 11.5, d: 0.9, mx: 56, my: -148, ry0: -14, rx0: 8, rz0: -10, spin: 270, tilt: 18, blur: 1.2 },
  { top: 74, left: 56, size: 27, o: 0.48, dur: 9.0, d: 1.6, mx: -8, my: -178, ry0: 28, rx0: -10, rz0: 12, spin: -290, tilt: -22, blur: 1.6 },
  { top: 80, left: 82, size: 18, o: 0.32, dur: 12.0, d: 2.3, mx: 70, my: -130, ry0: -20, rx0: 6, rz0: -8, spin: 300, tilt: 24, blur: 1.4 },
  { top: 84, left: 68, size: 25, o: 0.47, dur: 10.0, d: 3.3, mx: 36, my: -164, ry0: 22, rx0: -8, rz0: 10, spin: -320, tilt: -20, blur: 1.6 }
];

// FRONT plane: larger, brighter, crisp, faster. Same origin band so the device
// is wrapped, but these pass over it. 14 bills.
const FRONT_BILLS: readonly Bill[] = [
  { top: 80, left: 64, size: 38, o: 0.96, dur: 7.5, d: 0.0, mx: 46, my: -210, ry0: -30, rx0: 8, rz0: -12, spin: 360, tilt: 30 },
  { top: 84, left: 74, size: 44, o: 1.0, dur: 8.5, d: 0.7, mx: 72, my: -240, ry0: 26, rx0: -10, rz0: 14, spin: -340, tilt: -26 },
  { top: 76, left: 68, size: 32, o: 0.86, dur: 9.0, d: 1.5, mx: 12, my: -196, ry0: -22, rx0: 10, rz0: -8, spin: 320, tilt: 24 },
  { top: 86, left: 82, size: 50, o: 1.0, dur: 7.0, d: 2.2, mx: 96, my: -256, ry0: 34, rx0: -8, rz0: 16, spin: -380, tilt: -32 },
  { top: 82, left: 58, size: 36, o: 0.9, dur: 9.5, d: 2.9, mx: -18, my: -222, ry0: -28, rx0: 6, rz0: -10, spin: 340, tilt: 28 },
  { top: 78, left: 86, size: 42, o: 0.98, dur: 8.0, d: 0.4, mx: 104, my: -228, ry0: 30, rx0: -10, rz0: 12, spin: -300, tilt: -24 },
  { top: 88, left: 70, size: 30, o: 0.82, dur: 9.0, d: 1.2, mx: 54, my: -188, ry0: -18, rx0: 8, rz0: -14, spin: 360, tilt: 26 },
  { top: 74, left: 90, size: 48, o: 1.0, dur: 7.5, d: 1.9, mx: 112, my: -250, ry0: 32, rx0: -6, rz0: 18, spin: -360, tilt: -30 },
  { top: 84, left: 62, size: 34, o: 0.88, dur: 9.5, d: 2.6, mx: 6, my: -214, ry0: -26, rx0: 10, rz0: -8, spin: 320, tilt: 22 },
  { top: 80, left: 88, size: 40, o: 0.95, dur: 8.0, d: 3.3, mx: 116, my: -232, ry0: 24, rx0: -8, rz0: 10, spin: -340, tilt: -26 },
  { top: 90, left: 78, size: 31, o: 0.84, dur: 8.5, d: 0.9, mx: 76, my: -192, ry0: -16, rx0: 6, rz0: -12, spin: 300, tilt: 24 },
  { top: 76, left: 54, size: 46, o: 1.0, dur: 7.0, d: 1.6, mx: -26, my: -244, ry0: 30, rx0: -10, rz0: 14, spin: -360, tilt: -28 },
  { top: 82, left: 84, size: 30, o: 0.8, dur: 9.5, d: 2.3, mx: 90, my: -184, ry0: -20, rx0: 8, rz0: -10, spin: 340, tilt: 26 },
  { top: 86, left: 66, size: 42, o: 0.97, dur: 8.0, d: 3.0, mx: 30, my: -226, ry0: 28, rx0: -8, rz0: 12, spin: -320, tilt: -22 }
];

type BillVars = React.CSSProperties & {
  '--size'?: string;
  '--o'?: string;
  '--dur'?: string;
  '--d'?: string;
  '--mx'?: string;
  '--my'?: string;
  '--ry0'?: string;
  '--rx0'?: string;
  '--rz0'?: string;
  '--spin'?: string;
  '--tilt'?: string;
  '--blur'?: string;
};

let noteSeq = 0;

/** A clean, minimal SVG banknote: rounded note, token-green gradient, hairline
 *  inner border, and a centered "$" medallion. ~1.9:1 aspect. Tokens only. */
function Banknote() {
  const gid = `mf-grad-${noteSeq++}`;
  return (
    <svg className={styles.note} viewBox="0 0 76 40" fill="none" xmlns="http://www.w3.org/2000/svg">
      <defs>
        <linearGradient id={gid} x1="0" y1="0" x2="76" y2="40" gradientUnits="userSpaceOnUse">
          <stop offset="0" stopColor="var(--color-accent-text)" />
          <stop offset="0.55" stopColor="rgb(var(--accent-rgb))" />
          <stop offset="1" stopColor="var(--color-accent)" />
        </linearGradient>
      </defs>
      {/* note body */}
      <rect x="0.6" y="0.6" width="74.8" height="38.8" rx="6" fill={`url(#${gid})`} />
      {/* hairline inner border */}
      <rect
        x="3.5"
        y="3.5"
        width="69"
        height="33"
        rx="4"
        fill="none"
        stroke="var(--color-canvas)"
        strokeOpacity="0.28"
        strokeWidth="1"
      />
      {/* center medallion */}
      <circle cx="38" cy="20" r="9" fill="var(--color-canvas)" fillOpacity="0.14" />
      <circle
        cx="38"
        cy="20"
        r="9"
        fill="none"
        stroke="var(--color-canvas)"
        strokeOpacity="0.32"
        strokeWidth="1"
      />
      <text
        x="38"
        y="20"
        textAnchor="middle"
        dominantBaseline="central"
        fontSize="11"
        fontWeight="700"
        fill="var(--color-canvas)"
        fillOpacity="0.7"
        fontFamily="ui-sans-serif, system-ui, sans-serif"
      >
        $
      </text>
    </svg>
  );
}

export function MoneyField({ layer, className }: { layer: Layer; className?: string }) {
  const bills = layer === 'front' ? FRONT_BILLS : BACK_BILLS;
  return (
    <div
      aria-hidden
      className={cn(styles.field, layer === 'front' ? styles.front : styles.back, 'pointer-events-none', className)}
    >
      {bills.map((b, i) => (
        <span
          key={i}
          className={styles.bill}
          style={
            {
              top: `${b.top}%`,
              left: `${b.left}%`,
              '--size': `${b.size}px`,
              '--o': String(b.o),
              '--dur': `${b.dur}s`,
              '--d': `${b.d}s`,
              '--mx': `${b.mx}px`,
              '--my': `${b.my}px`,
              '--ry0': `${b.ry0}deg`,
              '--rx0': `${b.rx0}deg`,
              '--rz0': `${b.rz0}deg`,
              '--spin': `${b.spin}deg`,
              '--tilt': `${b.tilt}deg`,
              ...(b.blur !== undefined ? { '--blur': `${b.blur}px` } : {})
            } as BillVars
          }
        >
          <Banknote />
        </span>
      ))}
    </div>
  );
}
