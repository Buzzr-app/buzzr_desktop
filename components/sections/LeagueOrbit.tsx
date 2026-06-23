'use client';

import Image from 'next/image';
import { type CSSProperties, useState } from 'react';
import { Section } from '@/components/ui/Section';
import { cn } from '@/components/utils';
import { LEAGUE_COUNT, type LeagueStatus } from '@/src/lib/constants';
import { LEAGUE_ORBIT_ITEMS, type LeagueOrbitItem } from '@/src/lib/leagueMedia';
import { isRemoteLeagueLogo } from '@/src/lib/leagueLogos';

type OrbitRing = {
  count: number;
  offset: number;
  radius: string;
  ring: number;
  start: number;
};

type OrbitNodeStyle = CSSProperties & {
  '--orbit-delay'?: string;
};

const ORBIT_RINGS: readonly OrbitRing[] = [
  { start: 0, count: 12, radius: 'clamp(240px, 24vw, 286px)', offset: -4, ring: 0 },
  { start: 12, count: 17, radius: 'clamp(310px, 32vw, 360px)', offset: 7, ring: 1 },
  { start: 29, count: 20, radius: 'clamp(380px, 39vw, 432px)', offset: -2, ring: 2 }
];

const STATUS_LABEL: Record<LeagueStatus, string> = {
  healthy: 'Live',
  beta: 'Beta',
  'news-only': 'News'
};

function getInitialItem(items: ReadonlyArray<LeagueOrbitItem>) {
  return items.find((item) => item.league.label === 'NBA') ?? items[0] ?? null;
}

function getOrbitRing(index: number) {
  return ORBIT_RINGS.find((ring) => index >= ring.start && index < ring.start + ring.count) ?? ORBIT_RINGS[ORBIT_RINGS.length - 1];
}

// Position a node on its ring. The enclosing .orbit-spin layer rotates the whole
// ring; this only places the node at its fixed angle and radius. The node's own
// upright correction is handled by the .orbit-node-counter wrapper inside.
function getOrbitStyle(index: number): OrbitNodeStyle {
  const ring = getOrbitRing(index);
  const position = index - ring.start;
  const angle = -90 + ring.offset + (position / ring.count) * 360;

  return {
    transform: `rotate(${angle}deg) translateX(${ring.radius}) rotate(${-angle}deg)`,
    '--orbit-delay': `${index * 18}ms`
  };
}

function OrbitRingLines() {
  return (
    <>
      {ORBIT_RINGS.map((ring) => (
        <div
          key={ring.ring}
          aria-hidden
          className="orbit-ring-line absolute left-1/2 top-1/2 rounded-full border border-white/10 bg-[radial-gradient(circle,rgb(var(--accent-rgb)_/_0.045),transparent_64%)]"
          style={{
            height: `calc(${ring.radius} * 2)`,
            transform: 'translate(-50%, -50%)',
            width: `calc(${ring.radius} * 2)`
          }}
        />
      ))}
    </>
  );
}

function LeagueNode({
  index,
  isActive,
  item,
  onActivate,
  ring
}: {
  index: number;
  isActive: boolean;
  item: LeagueOrbitItem;
  onActivate: () => void;
  ring: number;
}) {
  const hasLogo = Boolean(item.logo);

  return (
    <li className="absolute left-0 top-0 z-20" style={getOrbitStyle(index)}>
      {/* Counter-rotates against the ring's spin layer so the button stays upright. */}
      <div className={cn('orbit-node-counter -translate-x-1/2 -translate-y-1/2', `orbit-node-counter-${ring}`)}>
        <button
          type="button"
          aria-pressed={isActive}
          aria-label={`${item.league.long}, ${item.sportLabel}`}
          className={cn(
            'orbit-node group flex h-[58px] items-center justify-center rounded-[16px] border px-2 text-center focus-visible:outline-none focus-visible:shadow-[var(--shadow-focus)]',
            hasLogo ? 'w-[58px]' : 'w-[86px]',
            isActive
              ? 'orbit-node--active border-accent/80 bg-accent/14 text-foreground shadow-[0_0_34px_rgb(var(--accent-rgb)_/_0.28)]'
              : 'border-white/10 bg-white/[0.055] text-muted shadow-[0_16px_40px_rgba(0,0,0,0.28)]'
          )}
          data-testid={`league-orbit-trigger-${item.league.label}`}
          onClick={onActivate}
          onFocus={onActivate}
          onMouseEnter={onActivate}
        >
          {item.logo ? (
            <>
              <Image
                src={item.logo}
                alt=""
                width={34}
                height={34}
                sizes="34px"
                unoptimized={isRemoteLeagueLogo(item.logo)}
                className="h-[34px] w-[34px] object-contain drop-shadow-[0_8px_18px_rgba(0,0,0,0.45)]"
              />
              <span className="sr-only">{item.league.label}</span>
            </>
          ) : (
            <span className="line-clamp-2 font-mono text-[9px] font-semibold uppercase leading-[1.05] tracking-[0.06em]">
              {item.fallbackLabel}
            </span>
          )}
        </button>
      </div>
    </li>
  );
}

function MobileLeagueRail({
  activeItem,
  items,
  setActiveLabel
}: {
  activeItem: LeagueOrbitItem;
  items: ReadonlyArray<LeagueOrbitItem>;
  setActiveLabel: (label: string) => void;
}) {
  return (
    <div className="mt-8 lg:hidden">
      <div className="orbit-aura mx-auto aspect-square w-[min(280px,72vw)]">
        <div aria-hidden className="orbit-aura__bloom" />
        <div aria-hidden className="orbit-aura__core" />
        <div aria-hidden className="orbit-aura__grain" />
        <div aria-hidden className="orbit-aura__vignette" />
        <div className="orbit-aura__logo text-center">
          {activeItem.logo ? (
            <Image
              src={activeItem.logo}
              alt=""
              width={72}
              height={72}
              sizes="72px"
              unoptimized={isRemoteLeagueLogo(activeItem.logo)}
              className="h-[72px] w-[72px] object-contain drop-shadow-[0_10px_24px_rgba(0,0,0,0.5)]"
            />
          ) : (
            <span className="font-mono text-[18px] font-semibold uppercase tracking-[0.04em] text-foreground">
              {activeItem.league.label}
            </span>
          )}
          <p className="mt-3 text-[15px] font-semibold leading-none tracking-[0] text-foreground">
            {activeItem.league.long}
          </p>
          <span className="mt-2 inline-flex items-center gap-1.5 rounded-full border border-accent/35 bg-accent/10 px-2.5 py-1 font-mono text-[10px] uppercase leading-none tracking-[0.12em] text-accent-text">
            <span aria-hidden className="orbit-live-dot" />
            {STATUS_LABEL[activeItem.league.status]}
          </span>
        </div>
      </div>

      <div className="-mx-6 mt-5 overflow-x-auto px-6 pb-2">
        <ul className="flex snap-x gap-2">
          {items.map((item) => {
            const isActive = item.league.label === activeItem.league.label;

            return (
              <li key={item.league.label} className="snap-start">
                <button
                  type="button"
                  aria-pressed={isActive}
                  className={cn(
                    'orbit-rail-node flex min-h-[58px] min-w-[118px] items-center gap-2 rounded-[16px] border px-3 text-left focus-visible:outline-none focus-visible:shadow-[var(--shadow-focus)]',
                    isActive
                      ? 'border-accent/80 bg-accent text-on-accent'
                      : 'border-white/10 bg-white/[0.055] text-muted'
                  )}
                  data-testid={`league-orbit-mobile-trigger-${item.league.label}`}
                  onClick={() => setActiveLabel(item.league.label)}
                >
                  {item.logo ? (
                    <Image
                      src={item.logo}
                      alt=""
                      width={28}
                      height={28}
                      sizes="28px"
                      unoptimized={isRemoteLeagueLogo(item.logo)}
                      className="h-7 w-7 object-contain"
                    />
                  ) : null}
                  <span className="min-w-0">
                    <span className="block truncate font-mono text-[11px] font-semibold uppercase tracking-[0.08em]">
                      {item.league.label}
                    </span>
                    <span className={cn('mt-1 block text-[11px]', isActive ? 'text-on-accent/70' : 'text-muted/70')}>
                      {STATUS_LABEL[item.league.status]}
                    </span>
                  </span>
                </button>
              </li>
            );
          })}
        </ul>
      </div>
    </div>
  );
}

export function LeagueOrbit() {
  const items = LEAGUE_ORBIT_ITEMS;
  const initialItem = getInitialItem(items);
  const [activeLabel, setActiveLabel] = useState(initialItem?.league.label ?? '');
  const activeItem =
    items.find((item) => item.league.label === activeLabel) ?? initialItem;

  if (!activeItem) {
    return null;
  }

  return (
    <Section
      id="leagues"
      aria-labelledby="leagues-title"
      className="max-w-[1380px] overflow-hidden py-16 md:py-20"
    >
      <header className="mx-auto max-w-[760px] text-center">
        <p className="font-mono text-[12px] uppercase leading-[2] tracking-[0.12em] text-accent-text">
          League orbit
        </p>
        <h2
          id="leagues-title"
          className="mt-3 text-[clamp(36px,5.2vw,72px)] font-semibold leading-[0.95] tracking-[0] text-foreground"
        >
          All {LEAGUE_COUNT} leagues in one sports graph.
        </h2>
      </header>

      <div className="orbit-stage relative mt-12 hidden min-h-[920px] lg:block">
        <div aria-hidden className="orbit-core-glow" />
        <OrbitRingLines />

        {/* Galaxy core: active league logo inside a grained green aura.
            Sized + centered purely in CSS (.orbit-aura) so it locks to the
            dead center of the rings regardless of content height. */}
        <div className="orbit-aura z-10">
          <div aria-hidden className="orbit-aura__bloom" />
          <div aria-hidden className="orbit-aura__core" />
          <div aria-hidden className="orbit-aura__grain" />
          <div aria-hidden className="orbit-aura__vignette" />
          <div key={activeItem.league.label} className="orbit-aura__logo text-center">
            {activeItem.logo ? (
              <Image
                src={activeItem.logo}
                alt=""
                width={96}
                height={96}
                sizes="96px"
                unoptimized={isRemoteLeagueLogo(activeItem.logo)}
                className="h-[96px] w-[96px] object-contain drop-shadow-[0_12px_30px_rgba(0,0,0,0.5)]"
              />
            ) : (
              <span className="font-mono text-[24px] font-semibold uppercase tracking-[0.04em] text-foreground">
                {activeItem.league.label}
              </span>
            )}
            <p className="mt-4 text-[19px] font-semibold leading-none tracking-[0] text-foreground">
              {activeItem.league.long}
            </p>
            <span className="mt-3 inline-flex items-center gap-1.5 rounded-full border border-accent/35 bg-accent/10 px-3 py-1 font-mono text-[11px] uppercase leading-none tracking-[0.12em] text-accent-text">
              <span aria-hidden className="orbit-live-dot" />
              {STATUS_LABEL[activeItem.league.status]}
            </span>
          </div>
        </div>

        {/* One spinning layer per ring; nodes counter-rotate to stay upright. */}
        <ul className="absolute inset-0" aria-label="Covered leagues">
          {ORBIT_RINGS.map((ring) => (
            <li key={ring.ring} className={cn('orbit-spin', `orbit-spin-${ring.ring}`)}>
              <ul>
                {items
                  .map((item, index) => ({ item, index }))
                  .filter(({ index }) => index >= ring.start && index < ring.start + ring.count)
                  .map(({ item, index }) => (
                    <LeagueNode
                      key={item.league.label}
                      index={index}
                      ring={ring.ring}
                      isActive={item.league.label === activeItem.league.label}
                      item={item}
                      onActivate={() => setActiveLabel(item.league.label)}
                    />
                  ))}
              </ul>
            </li>
          ))}
        </ul>
      </div>

      <MobileLeagueRail
        activeItem={activeItem}
        items={items}
        setActiveLabel={setActiveLabel}
      />
    </Section>
  );
}
