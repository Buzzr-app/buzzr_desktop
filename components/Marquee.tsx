'use client';

import { cn } from '@/components/utils';
import { LEAGUES } from '@/src/lib/constants';

export type MarqueeItem = { label: string };

const DEFAULT_ITEMS: MarqueeItem[] = LEAGUES.map((l) => ({ label: l.label }));

type MarqueeProps = {
  items?: MarqueeItem[];
  className?: string;
  /** Speed in seconds for a full loop (default 30) */
  speed?: number;
};

function MarqueeRow({ items, speed }: { items: MarqueeItem[]; speed: number }) {
  return (
    <div
      className="flex shrink-0 items-center gap-10 whitespace-nowrap pr-10 [animation-name:marquee-scroll] [animation-timing-function:linear] [animation-iteration-count:infinite] hover:[animation-play-state:paused]"
      style={{ animationDuration: `${speed}s` }}
    >
      {items.map((item, i) => (
        <span
          key={`${item.label}-${i}`}
          className="flex items-center gap-3 font-medium text-[11px] uppercase tracking-[0.22em] text-muted"
        >
          <span aria-hidden className="h-[6px] w-[6px] bg-foreground/70" />
          {item.label}
        </span>
      ))}
    </div>
  );
}

export function Marquee({ items = DEFAULT_ITEMS, className, speed = 30 }: MarqueeProps) {
  const doubled = [...items, ...items];
  return (
    <div
      className={cn('mask-edges-x overflow-hidden py-4', className)}
      aria-hidden
    >
      <div className="flex w-max">
        <MarqueeRow items={doubled} speed={speed} />
      </div>
    </div>
  );
}
