'use client';

import { useBuzzScene } from '@/src/hooks/useBuzzScene';

/**
 * WinProbBar, web port of `LiveWinProbabilityBar`. A thin split-fill bar
 * showing live win probability between away (OKC) and home (DEN). Team colors
 * on each side, leader gets full opacity + glow.
 */
export function WinProbBar() {
  const s = useBuzzScene();
  const awayPct = Math.round(s.winProbAway * 100);
  const homePct = 100 - awayPct;
  const awayLeads = awayPct > homePct;
  const tied = awayPct === homePct;

  return (
    <div className="flex h-full flex-col justify-between rounded-xl p-6">
      <div className="flex items-center justify-between">
        <span className="font-mono text-[10px] uppercase tracking-[0.24em] text-muted">
          Win probability · live
        </span>
        <span className="font-mono text-[10px] tabular-nums text-muted">
          model · v1.4
        </span>
      </div>

      <div className="flex flex-col gap-3">
        <div className="flex items-center justify-between font-mono text-[11px] tabular-nums">
          <div className="flex items-center gap-2">
            <span
              className="h-2 w-2 rounded-full"
              style={{ background: s.away.color }}
              aria-hidden
            />
            <span
              className="font-medium uppercase tracking-[0.14em]"
              style={{ color: awayLeads || tied ? 'rgb(var(--foreground))' : 'rgb(var(--muted-foreground))' }}
            >
              {s.away.code}
            </span>
            <span
              className="font-sans text-[20px] font-light leading-none"
              style={{ color: awayLeads || tied ? 'rgb(var(--foreground))' : 'rgb(var(--muted-foreground))' }}
            >
              {awayPct}%
            </span>
          </div>
          <div className="flex items-center gap-2">
            <span
              className="font-sans text-[20px] font-light leading-none"
              style={{ color: !awayLeads || tied ? 'rgb(var(--foreground))' : 'rgb(var(--muted-foreground))' }}
            >
              {homePct}%
            </span>
            <span
              className="font-medium uppercase tracking-[0.14em]"
              style={{ color: !awayLeads || tied ? 'rgb(var(--foreground))' : 'rgb(var(--muted-foreground))' }}
            >
              {s.home.code}
            </span>
            <span
              className="h-2 w-2 rounded-full"
              style={{ background: '#2563EB' }}
              aria-hidden
            />
          </div>
        </div>

        <div className="relative h-[6px] w-full overflow-hidden rounded-full bg-white/[0.04]">
          <div
            className="absolute inset-y-0 left-0"
            style={{
              width: `${awayPct}%`,
              background: `linear-gradient(90deg, ${s.away.color} 0%, ${s.away.color}CC 100%)`,
              opacity: awayLeads ? 1 : 0.6,
              transition: 'width 420ms cubic-bezier(0.22, 1, 0.36, 1), opacity 250ms ease'
            }}
          />
          <div
            className="absolute inset-y-0 right-0"
            style={{
              width: `${homePct}%`,
              background: `linear-gradient(270deg, #2563EB 0%, #2563EBCC 100%)`,
              opacity: !awayLeads ? 1 : 0.6,
              transition: 'width 420ms cubic-bezier(0.22, 1, 0.36, 1), opacity 250ms ease'
            }}
          />
          <div
            aria-hidden
            className="absolute top-0 h-full w-[2px] rounded-full"
            style={{
              left: `${awayPct}%`,
              transform: 'translateX(-1px)',
              background: 'rgba(0, 230, 118, 0.9)',
              boxShadow: '0 0 8px rgba(0, 230, 118, 0.7)',
              transition: 'left 420ms cubic-bezier(0.22, 1, 0.36, 1)'
            }}
          />
        </div>
      </div>
    </div>
  );
}
