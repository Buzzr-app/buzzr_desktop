'use client';

import { useBuzzScene } from '@/src/hooks/useBuzzScene';

/**
 * AuraBadge, web port of the mobile app's `AuraRing` (Skia sweep-gradient).
 * On web we fake the conic sweep with a CSS `conic-gradient` rotated via the
 * `border-conic` keyframes that already live in globals.css.
 */
export function AuraBadge() {
  const s = useBuzzScene();
  const intense = s.phase === 'overtime' || s.phase === 'final' || s.phase === 'reactions';
  const period = intense ? 2500 : 5000;
  const label = s.periodLabel === 'FINAL' ? 'FINAL' : 'LIVE';
  const dotColor = s.periodLabel === 'FINAL' ? 'rgb(0 230 118)' : 'rgb(239 68 68)';

  return (
    <div className="relative flex h-full w-full flex-col rounded-2xl p-6">
      <span className="font-mono text-[10px] uppercase tracking-[0.24em] text-muted">
        Live badge
      </span>

      <div className="flex flex-1 items-center justify-center">
        <div
          className="relative"
          style={{
            ['--aura-period' as string]: `${period}ms`
          }}
        >
          <span aria-hidden className="aura-ring absolute inset-0 rounded-full" />
          <span className="relative z-10 inline-flex items-center gap-2 rounded-full bg-black/55 px-4 py-2 font-mono text-xs font-bold uppercase tracking-[0.28em] text-foreground backdrop-blur-sm">
            <span className="relative flex h-2 w-2">
              {label === 'LIVE' && (
                <span
                  className="absolute inline-flex h-full w-full animate-ping rounded-full"
                  style={{ background: dotColor, opacity: 0.7 }}
                />
              )}
              <span
                className="relative inline-flex h-2 w-2 rounded-full"
                style={{ background: dotColor }}
              />
            </span>
            {label}
          </span>
        </div>
      </div>

      <style jsx>{`
        .aura-ring {
          padding: 2px;
          border-radius: 999px;
          background: conic-gradient(
            from var(--aura-angle, 0deg),
            rgba(0, 230, 118, 0.15),
            rgba(0, 230, 118, 0.75) 25%,
            rgba(57, 255, 142, 1) 50%,
            rgba(0, 230, 118, 0.75) 75%,
            rgba(0, 230, 118, 0.15) 100%
          );
          -webkit-mask:
            linear-gradient(#000 0 0) content-box,
            linear-gradient(#000 0 0);
          -webkit-mask-composite: xor;
                  mask-composite: exclude;
          animation: aura-spin var(--aura-period, 5000ms) linear infinite;
        }
        @property --aura-angle {
          syntax: '<angle>';
          inherits: false;
          initial-value: 0deg;
        }
        @keyframes aura-spin {
          from { --aura-angle: 0deg;   }
          to   { --aura-angle: 360deg; }
        }
        @media (prefers-reduced-motion: reduce) {
          .aura-ring { animation: none; }
        }
      `}</style>
    </div>
  );
}
