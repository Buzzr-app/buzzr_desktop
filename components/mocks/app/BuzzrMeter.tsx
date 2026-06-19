'use client';

import { useBuzzScene } from '@/src/hooks/useBuzzScene';

/**
 * BuzzrMeter, web port of `BuzzrMeterBar`. Horizontal fill bar + big tabular
 * score. The fill width is driven by scene.buzz / 10.
 */
export function BuzzrMeter() {
  const s = useBuzzScene();
  const pct = Math.max(0, Math.min(1, s.buzz / 10)) * 100;
  const [intPart, decPart] = s.buzz.toFixed(1).split('.');

  return (
    <div className="flex h-full flex-col justify-between rounded-xl p-6">
      <div className="flex items-center justify-between">
        <span className="font-mono text-[10px] uppercase tracking-[0.24em] text-muted">
          Buzzr Score
        </span>
        <span
          className="rounded-full px-2 py-0.5 font-mono text-[9px] font-bold uppercase tracking-[0.18em]"
          style={{ background: `${s.bandColor}22`, color: s.bandColor }}
        >
          {s.bandLabel}
        </span>
      </div>

      <div className="flex items-baseline gap-2 tabular-nums">
        <span
          className="font-sans text-[64px] font-light leading-none tracking-[-0.04em]"
          style={{
            color: s.bandColor,
            textShadow: `0 0 22px ${s.bandColor}55`,
            transition: 'color 250ms ease'
          }}
        >
          {intPart}
        </span>
        <span
          className="text-[32px] font-light leading-none"
          style={{ color: s.bandColor }}
        >
          .
        </span>
        <span
          className="font-sans text-[64px] font-light leading-none tracking-[-0.04em]"
          style={{
            color: s.bandColor,
            textShadow: `0 0 22px ${s.bandColor}55`
          }}
        >
          {decPart}
        </span>
        <span className="ml-auto font-mono text-[11px] tabular-nums text-muted">
          / 10
        </span>
      </div>

      <div className="flex flex-col gap-2">
        <div className="relative h-[6px] w-full overflow-hidden rounded-full bg-white/[0.06]">
          <div
            className="absolute inset-y-0 left-0 rounded-full"
            style={{
              width: `${pct}%`,
              background: `linear-gradient(90deg, ${s.bandColor}AA 0%, ${s.bandColor} 100%)`,
              boxShadow: `0 0 12px ${s.bandColor}88`,
              transition: 'width 320ms cubic-bezier(0.22, 1, 0.36, 1), background 320ms ease'
            }}
          />
        </div>
        <div className="flex justify-between font-mono text-[9px] uppercase tracking-[0.22em] text-muted">
          <span>1</span>
          <span>5</span>
          <span>10</span>
        </div>
      </div>
    </div>
  );
}
