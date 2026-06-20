'use client';

import { useBuzzScene, type FeatureKey } from '@/src/hooks/useBuzzScene';

/**
 * FeatureBars, renders the six model inputs that feed buzz(t). Each bar
 * fills in sync with the scene so the viewer sees the algorithm reacting
 * to a real play, not abstract mock data.
 */

type FeatureSpec = {
  key: FeatureKey;
  label: string;
  expr: string;
  weight: number;
};

const FEATURES: FeatureSpec[] = [
  { key: 'chaos',   label: 'Chaos',   expr: 'lead Δ · pace',       weight: 0.22 },
  { key: 'clutch',  label: 'Clutch',  expr: 'plays | t<3m',        weight: 0.19 },
  { key: 'crowd',   label: 'Crowd',   expr: 'Δ takes/min',         weight: 0.18 },
  { key: 'rivalry', label: 'Rivalry', expr: 'h2h · seed gap',      weight: 0.15 },
  { key: 'ot',      label: 'OT',      expr: 'overtimes',           weight: 0.14 },
  { key: 'upset',   label: 'Upset',   expr: 'win-prob swing',      weight: 0.12 }
];

export function FeatureBars() {
  const s = useBuzzScene();

  return (
    <div className="flex h-full flex-col justify-between rounded-2xl p-6">
      <div className="flex items-center justify-between">
        <span className="font-mono text-[10px] uppercase tracking-[0.24em] text-muted">
          Features · fᵢ(t)
        </span>
        <span className="font-mono text-[10px] tabular-nums text-muted">
          Σ βᵢ = 1.00
        </span>
      </div>

      <div className="mt-4 grid grid-cols-1 gap-2.5">
        {FEATURES.map((f) => {
          const v = s.features[f.key];
          return (
            <div
              key={f.key}
              className="grid grid-cols-[72px_1fr_48px_40px] items-center gap-3"
            >
              <span className="truncate font-light text-[12px] text-foreground">
                {f.label}
              </span>
              <span className="relative h-[5px] overflow-hidden rounded-full bg-white/[0.05]">
                <span
                  className="absolute inset-y-0 left-0 rounded-full"
                  style={{
                    width: `${Math.round(v * 100)}%`,
                    background: 'linear-gradient(90deg, rgba(0,230,118,0.6) 0%, rgb(0,230,118) 100%)',
                    boxShadow: v > 0.8 ? '0 0 10px rgba(0,230,118,0.45)' : 'none',
                    transition: 'width 360ms cubic-bezier(0.22, 1, 0.36, 1)'
                  }}
                />
              </span>
              <span className="text-right font-mono text-[10px] tabular-nums text-muted">
                β {f.weight.toFixed(2)}
              </span>
              <span className="text-right font-mono text-[10px] tabular-nums text-foreground">
                {v.toFixed(2)}
              </span>
            </div>
          );
        })}
      </div>

      <div className="mt-4 rounded-md border border-white/[0.06] bg-black/40 p-3">
        <p className="whitespace-nowrap font-mono text-[11px] leading-relaxed text-foreground/90">
          <span className="text-foreground">buzz</span>(t) = σ( Σᵢ{' '}
          <span className="text-foreground">βᵢ</span> · fᵢ(t) + γ · community + ε )
        </p>
      </div>
    </div>
  );
}
