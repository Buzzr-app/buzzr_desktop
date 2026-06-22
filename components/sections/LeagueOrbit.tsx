'use client';

import Image from 'next/image';
import { type CSSProperties, useState } from 'react';
import { Section } from '@/components/ui/Section';
import { VideoSurface } from '@/components/ui/VideoSurface';
import { cn } from '@/components/utils';
import { LEAGUE_COUNT, type LeagueStatus } from '@/src/lib/constants';
import { LEAGUE_ORBIT_ITEMS, type LeagueOrbitItem } from '@/src/lib/leagueMedia';

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

function getOrbitStyle(index: number): OrbitNodeStyle {
  const ring = getOrbitRing(index);
  const position = index - ring.start;
  const angle = -90 + ring.offset + (position / ring.count) * 360;

  return {
    transform: `translate(-50%, -50%) rotate(${angle}deg) translateX(${ring.radius}) rotate(${-angle}deg)`,
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
          className="absolute left-1/2 top-1/2 rounded-full border border-white/10 bg-[radial-gradient(circle,rgba(0,194,100,0.045),transparent_64%)]"
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
  onActivate
}: {
  index: number;
  isActive: boolean;
  item: LeagueOrbitItem;
  onActivate: () => void;
}) {
  const hasLogo = Boolean(item.logo);

  return (
    <li className="absolute left-1/2 top-1/2 z-20" style={getOrbitStyle(index)}>
      <button
        type="button"
        aria-pressed={isActive}
        aria-label={`${item.league.long}, ${item.sportLabel}`}
        className={cn(
          'group flex h-[58px] items-center justify-center rounded-[16px] border px-2 text-center transition-[border-color,background-color,box-shadow,color] duration-200 focus-visible:outline-none focus-visible:shadow-[var(--shadow-focus)]',
          hasLogo ? 'w-[58px]' : 'w-[86px]',
          isActive
            ? 'border-accent/80 bg-accent/14 text-white shadow-[0_0_34px_rgba(0,194,100,0.28)]'
            : 'border-white/10 bg-white/[0.055] text-white/72 shadow-[0_16px_40px_rgba(0,0,0,0.28)] hover:border-accent/50 hover:bg-white/[0.08] hover:text-white'
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
      <VideoSurface
        key={activeItem.league.label}
        description={activeItem.media.description}
        eyebrow={activeItem.media.eyebrow}
        fallbackUrl={activeItem.media.fallbackUrl}
        posterAlt={activeItem.media.posterAlt}
        posterSrc={activeItem.media.posterSrc}
        title={activeItem.media.title}
        youtubeId={activeItem.media.youtubeId}
      />

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
                    'flex min-h-[58px] min-w-[118px] items-center gap-2 rounded-[16px] border px-3 text-left transition-colors focus-visible:outline-none focus-visible:shadow-[var(--shadow-focus)]',
                    isActive
                      ? 'border-accent/80 bg-accent text-on-accent'
                      : 'border-white/10 bg-white/[0.055] text-white/72'
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
                      className="h-7 w-7 object-contain"
                    />
                  ) : null}
                  <span className="min-w-0">
                    <span className="block truncate font-mono text-[11px] font-semibold uppercase tracking-[0.08em]">
                      {item.league.label}
                    </span>
                    <span className={cn('mt-1 block text-[11px]', isActive ? 'text-on-accent/70' : 'text-white/46')}>
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
        <p className="mx-auto mt-4 max-w-[560px] text-[16px] leading-[1.55] tracking-[0] text-muted">
          Verified marks where assets exist, clean text nodes where they do not, and one focused league surface at a time.
        </p>
      </header>

      <div className="relative mt-12 hidden min-h-[920px] lg:block">
        <div
          aria-hidden
          className="absolute left-1/2 top-1/2 h-[520px] w-[520px] -translate-x-1/2 -translate-y-1/2 rounded-full bg-accent/12 blur-[92px]"
        />
        <OrbitRingLines />

        <div className="absolute left-1/2 top-1/2 z-10 w-[min(456px,38vw)] -translate-x-1/2 -translate-y-1/2">
          <div className="mb-3 flex items-center justify-between gap-3 rounded-[16px] border border-white/10 bg-[#090e13]/82 px-4 py-3 shadow-[0_24px_70px_rgba(0,0,0,0.38)] backdrop-blur-xl">
            <div className="min-w-0">
              <p className="font-mono text-[11px] uppercase leading-none tracking-[0.12em] text-white/42">
                Focused league
              </p>
              <p className="mt-2 truncate text-[18px] font-semibold leading-none tracking-[0] text-white">
                {activeItem.league.long}
              </p>
            </div>
            <span className="shrink-0 rounded-full border border-accent/35 bg-accent/10 px-3 py-1 font-mono text-[11px] uppercase leading-none tracking-[0.12em] text-accent-text">
              {STATUS_LABEL[activeItem.league.status]}
            </span>
          </div>

          <VideoSurface
            key={activeItem.league.label}
            className="shadow-[0_30px_90px_rgba(0,0,0,0.45)]"
            description={activeItem.media.description}
            eyebrow={activeItem.media.eyebrow}
            fallbackUrl={activeItem.media.fallbackUrl}
            posterAlt={activeItem.media.posterAlt}
            posterSrc={activeItem.media.posterSrc}
            title={activeItem.media.title}
            youtubeId={activeItem.media.youtubeId}
          />
        </div>

        <ul className="absolute inset-0" aria-label="Covered leagues">
          {items.map((item, index) => (
            <LeagueNode
              key={item.league.label}
              index={index}
              isActive={item.league.label === activeItem.league.label}
              item={item}
              onActivate={() => setActiveLabel(item.league.label)}
            />
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
