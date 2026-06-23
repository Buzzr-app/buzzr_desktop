'use client';

import Image from 'next/image';
import {
  type CSSProperties,
  type FocusEvent,
  useEffect,
  useMemo,
  useState
} from 'react';
import { useViewportGate } from '@/components/hooks/useViewportGate';
import { Section } from '@/components/ui/Section';
import { cn } from '@/components/utils';
import { LEAGUE_COUNT, type LeagueStatus } from '@/src/lib/constants';
import { LEAGUE_ORBIT_ITEMS, type LeagueOrbitItem } from '@/src/lib/leagueMedia';
import { isRemoteLeagueLogo } from '@/src/lib/leagueLogos';
import { type ShowcaseMark, type ShowcaseTeam } from '@/src/lib/leagueShowcase';

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

type MarkStyle = CSSProperties & {
  '--orbit-mark-hue'?: number;
};

const ORBIT_RINGS: readonly OrbitRing[] = [
  { start: 0, count: 12, radius: 'clamp(238px, 23vw, 276px)', offset: -4, ring: 0 },
  { start: 12, count: 17, radius: 'clamp(324px, 33vw, 376px)', offset: 7, ring: 1 },
  { start: 29, count: 20, radius: 'clamp(414px, 41vw, 456px)', offset: -2, ring: 2 }
];

const FLIP_DISTANCE = 6;
const TEAM_STRIDE = 5;
const AMBIENT_FLIP_COUNT = 4;
const AMBIENT_SHOWCASE_LABELS = ['NBA', 'NFL', 'MLB', 'NHL', 'MLS', 'UCL', 'F1', 'UFC'];

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
    transform: `rotate(${angle}deg) translateX(${ring.radius}) rotate(${-angle}deg)`,
    '--orbit-delay': `${index * 18}ms`
  };
}

function getNeighborSlot(index: number, activeIndex: number, total: number) {
  if (index === activeIndex) {
    return null;
  }

  for (let distance = 1; distance <= FLIP_DISTANCE; distance += 1) {
    if ((activeIndex + distance) % total === index) {
      return (distance - 1) * 2;
    }

    if ((activeIndex - distance + total) % total === index) {
      return (distance - 1) * 2 + 1;
    }
  }

  return null;
}

function getShowcaseTeam(
  item: LeagueOrbitItem,
  neighborSlot: number,
  showcaseSeed: number
) {
  const offset = Math.max(0, showcaseSeed - 1);
  const teamIndex = (neighborSlot * TEAM_STRIDE + offset) % item.showcase.teams.length;

  return item.showcase.teams[teamIndex];
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

function VisualMark({
  className,
  mark,
  size = 'node'
}: {
  className?: string;
  mark: ShowcaseMark;
  size?: 'center' | 'node' | 'rail' | 'team';
}) {
  if (mark.kind === 'image') {
    return (
      <span className={cn('orbit-visual-mark', `orbit-visual-mark-${size}`, className)}>
        <Image
          src={mark.src}
          alt=""
          width={96}
          height={96}
          sizes={size === 'center' ? '96px' : '42px'}
          unoptimized={isRemoteLeagueLogo(mark.src)}
          className="orbit-visual-mark__image h-full w-full object-contain"
        />
        <span aria-hidden className="orbit-visual-mark__fallback">
          {mark.code}
        </span>
      </span>
    );
  }

  return (
    <span
      aria-hidden
      className={cn('orbit-visual-mark orbit-visual-mark-crest', `orbit-visual-mark-${size}`, className)}
      style={{ '--orbit-mark-hue': mark.hue } as MarkStyle}
    >
      <span>{mark.code}</span>
    </span>
  );
}

function PlayerChips({
  item,
  variant = 'desktop'
}: {
  item: LeagueOrbitItem;
  variant?: 'desktop' | 'mobile';
}) {
  return (
    <ul
      aria-label={`${item.league.label} showcase players`}
      className={cn(
        'mt-3 flex max-w-[280px] flex-wrap justify-center gap-1.5',
        variant === 'mobile' && 'mx-auto max-w-[320px]'
      )}
    >
      {item.showcase.players.map((player) => (
        <li
          key={player.code}
          data-testid={`league-orbit-player-chip-${item.league.label}-${player.code}`}
          data-orbit-tier="player"
          className="orbit-player-chip inline-flex items-center gap-1.5 rounded-full border border-white/[0.09] bg-black/24 px-2 py-1 text-[10px] leading-none text-white/82"
        >
          <span className="grid size-5 place-items-center rounded-full bg-accent/16 font-mono text-[9px] font-bold text-accent-text">
            {player.code}
          </span>
          <span className="font-semibold tracking-[0]">{player.name}</span>
        </li>
      ))}
    </ul>
  );
}

function OrbitCenter({ item }: { item: LeagueOrbitItem }) {
  return (
    <div key={item.league.label} className="orbit-aura__logo orbit-aura__panel text-center">
      <VisualMark mark={item.visualMark} size="center" />
      <p className="orbit-center__name mt-4 text-[19px] font-semibold leading-none tracking-[0] text-foreground">
        {item.league.long}
      </p>
      <div className="mt-3 flex items-center justify-center gap-2">
        <span className="inline-flex items-center gap-1.5 rounded-full border border-accent/35 bg-accent/10 px-3 py-1 font-mono text-[11px] uppercase leading-none tracking-[0.12em] text-accent-text">
          <span aria-hidden className="orbit-live-dot" />
          {STATUS_LABEL[item.league.status]}
        </span>
        <span className="rounded-full border border-white/[0.08] bg-white/[0.055] px-3 py-1 font-mono text-[11px] uppercase leading-none tracking-[0.1em] text-white/66">
          {item.showcase.teams.length} teams
        </span>
        <span className="rounded-full border border-white/[0.08] bg-white/[0.055] px-3 py-1 font-mono text-[11px] uppercase leading-none tracking-[0.1em] text-white/66">
          {item.showcase.players.length} players
        </span>
      </div>
      <div className="orbit-hierarchy mt-3 grid grid-cols-3 gap-1.5" aria-hidden>
        <span data-orbit-tier="league">League</span>
        <span data-orbit-tier="team">Teams</span>
        <span data-orbit-tier="player">Players</span>
      </div>
      <PlayerChips item={item} />
    </div>
  );
}

function LeagueNode({
  activeLeagueLabel,
  index,
  isActive,
  isDimmed,
  item,
  onActivate,
  ring,
  team
}: {
  activeLeagueLabel: string;
  index: number;
  isActive: boolean;
  isDimmed: boolean;
  item: LeagueOrbitItem;
  onActivate: () => void;
  ring: number;
  team: ShowcaseTeam | null;
}) {
  const isFlipped = Boolean(team);

  return (
    <li
      className="absolute left-0 top-0 z-20"
      style={getOrbitStyle(index)}
    >
      <div className={cn('orbit-node-counter', `orbit-node-counter-${ring}`)}>
        <button
          type="button"
          aria-pressed={isActive}
          aria-label={
            team
              ? `${team.name}, ${activeLeagueLabel} showcase team`
              : `${item.league.long}, ${item.sportLabel}`
          }
          className={cn(
            'orbit-node group flex h-[60px] w-[60px] items-center justify-center rounded-[17px] border p-0 text-center focus-visible:outline-none focus-visible:shadow-[var(--shadow-focus)]',
            isActive
              ? 'orbit-node--active border-accent/80 bg-accent/14 text-foreground shadow-[0_0_34px_rgb(var(--accent-rgb)_/_0.28)]'
              : 'border-white/10 bg-white/[0.055] text-muted shadow-[0_16px_40px_rgba(0,0,0,0.28)]',
            isDimmed && 'orbit-node--dimmed'
          )}
          data-testid={`league-orbit-trigger-${item.league.label}`}
          data-orbit-tier="league"
          onClick={onActivate}
          onFocus={onActivate}
          onMouseEnter={onActivate}
        >
          <span className="orbit-node__flip" data-flipped={isFlipped ? 'true' : 'false'}>
            <span className="orbit-node__face orbit-node__face-front">
              <VisualMark mark={item.visualMark} size="node" />
              <span className="sr-only">{item.league.label}</span>
            </span>
            {team ? (
              <span
                className="orbit-node__face orbit-node__face-back"
                data-orbit-tier="team"
                data-team-code={team.code}
                data-testid={`league-orbit-team-node-${activeLeagueLabel}-${team.code}`}
              >
                <VisualMark mark={team.mark} size="team" />
                <span className="mt-1 max-w-[50px] truncate font-mono text-[9px] font-bold uppercase tracking-[0.02em] text-white/84">
                  {team.code}
                </span>
              </span>
            ) : null}
          </span>
        </button>
      </div>
    </li>
  );
}

function MobileShowcasePanel({ item }: { item: LeagueOrbitItem }) {
  return (
    <div className="orbit-mobile-showcase mt-5 rounded-[22px] border border-white/[0.08] bg-white/[0.04] p-4 shadow-[inset_0_1px_0_rgba(255,255,255,0.05)]">
      <div className="flex items-center justify-between gap-3">
        <span className="font-mono text-[10px] font-semibold uppercase tracking-[0.14em] text-accent-text">
          {item.league.label} teams
        </span>
        <span className="font-mono text-[10px] uppercase tracking-[0.12em] text-white/42">
          {item.showcase.players.length} players
        </span>
      </div>
      <ul className="mt-3 grid grid-cols-4 gap-2">
        {item.showcase.teams.map((teamItem) => (
          <li key={teamItem.code} className="orbit-mobile-team grid place-items-center rounded-[14px] border border-white/[0.07] bg-black/22 px-1 py-2 text-center">
            <VisualMark mark={teamItem.mark} size="rail" />
            <span className="sr-only">{teamItem.name}</span>
            <span className="mt-1 max-w-full truncate font-mono text-[9px] font-bold text-white/74">
              {teamItem.code}
            </span>
          </li>
        ))}
      </ul>
      <PlayerChips item={item} variant="mobile" />
    </div>
  );
}

function MobileLeagueRail({
  activeItem,
  items,
  onActivate
}: {
  activeItem: LeagueOrbitItem;
  items: ReadonlyArray<LeagueOrbitItem>;
  onActivate: (label: string) => void;
}) {
  return (
    <div className="mt-8 lg:hidden">
      <div className="orbit-aura mx-auto aspect-square w-[min(320px,82vw)]">
        <div aria-hidden className="orbit-aura__bloom" />
        <div aria-hidden className="orbit-aura__core" />
        <div aria-hidden className="orbit-aura__grain" />
        <div aria-hidden className="orbit-aura__vignette" />
        <OrbitCenter item={activeItem} />
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
                    'orbit-rail-node flex min-h-[58px] min-w-[126px] items-center gap-2 rounded-[16px] border px-3 text-left focus-visible:outline-none focus-visible:shadow-[var(--shadow-focus)]',
                    isActive
                      ? 'border-accent/80 bg-accent text-on-accent'
                      : 'border-white/10 bg-white/[0.055] text-muted'
                  )}
                  data-testid={`league-orbit-mobile-trigger-${item.league.label}`}
                  onClick={() => onActivate(item.league.label)}
                >
                  <VisualMark mark={item.visualMark} size="rail" />
                  <span className="min-w-0">
                    <span className="block truncate font-mono text-[11px] font-semibold uppercase tracking-[0.08em]">
                      {item.league.label}
                    </span>
                    <span className={cn('mt-1 block text-[11px]', isActive ? 'text-on-accent/70' : 'text-muted/70')}>
                      {item.showcase.teams.length} teams
                    </span>
                  </span>
                </button>
              </li>
            );
          })}
        </ul>
      </div>

      <MobileShowcasePanel item={activeItem} />
    </div>
  );
}

export function LeagueOrbit() {
  const items = LEAGUE_ORBIT_ITEMS;
  const initialItem = getInitialItem(items);
  const [sectionRef, isStageVisible] = useViewportGate<HTMLElement>({
    rootMargin: '700px 0px'
  });
  const [activeLabel, setActiveLabel] = useState(initialItem?.league.label ?? '');
  const [isInteracting, setIsInteracting] = useState(false);
  const [showcaseSeed, setShowcaseSeed] = useState(0);
  const activeItem =
    items.find((item) => item.league.label === activeLabel) ?? initialItem;
  const activeIndex = Math.max(
    0,
    items.findIndex((item) => item.league.label === activeItem?.league.label)
  );
  const ambientLabels = useMemo(
    () => AMBIENT_SHOWCASE_LABELS.filter((label) =>
      items.some((item) => item.league.label === label)
    ),
    [items]
  );
  const ambientTeamSlots = useMemo(() => {
    const slots = new Set<number>();

    for (let index = 0; index < AMBIENT_FLIP_COUNT; index += 1) {
      slots.add((showcaseSeed + index * 3) % (FLIP_DISTANCE * 2));
    }

    return slots;
  }, [showcaseSeed]);

  useEffect(() => {
    if (!isStageVisible || isInteracting || ambientLabels.length === 0) {
      return;
    }

    const id = window.setInterval(() => {
      setShowcaseSeed((seed) => seed + 1);
      setActiveLabel((currentLabel) => {
        const currentIndex = ambientLabels.indexOf(currentLabel);
        const nextIndex = currentIndex === -1
          ? 0
          : (currentIndex + 3) % ambientLabels.length;

        return ambientLabels[nextIndex];
      });
    }, 2800);

    return () => {
      window.clearInterval(id);
    };
  }, [ambientLabels, isInteracting, isStageVisible]);

  if (!activeItem) {
    return null;
  }

  const activateLeague = (label: string) => {
    setActiveLabel(label);
    setIsInteracting(true);
    setShowcaseSeed((seed) => seed + 1);
  };

  const handleStageBlur = (event: FocusEvent<HTMLDivElement>) => {
    const nextTarget = event.relatedTarget;

    if (!nextTarget || !event.currentTarget.contains(nextTarget)) {
      setIsInteracting(false);
    }
  };

  return (
    <Section
      ref={sectionRef}
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
        <div className="orbit-interaction-cue mt-5" aria-label="League graph interaction guide">
          <span>Hover or tap a league.</span>
          <span>Nearby nodes flip into teams.</span>
          <span>Players light up in the center.</span>
        </div>
      </header>

      <div
        className="orbit-stage relative mt-12 hidden min-h-[980px] lg:block"
        data-interacting={isInteracting ? 'true' : 'false'}
        onBlur={handleStageBlur}
        onMouseLeave={() => setIsInteracting(false)}
      >
        <div aria-hidden className="orbit-core-glow" />
        <OrbitRingLines />

        <div className="orbit-aura z-10">
          <div aria-hidden className="orbit-aura__bloom" />
          <div aria-hidden className="orbit-aura__core" />
          <div aria-hidden className="orbit-aura__grain" />
          <div aria-hidden className="orbit-aura__vignette" />
          <OrbitCenter item={activeItem} />
        </div>

        <ul className="absolute inset-0" aria-label="Covered leagues">
          {ORBIT_RINGS.map((ring) => (
            <li key={ring.ring} className={cn('orbit-spin', `orbit-spin-${ring.ring}`)}>
              <ul>
                {items
                  .map((item, index) => ({ item, index }))
                  .filter(({ index }) => index >= ring.start && index < ring.start + ring.count)
                  .map(({ item, index }) => {
                    const neighborSlot = getNeighborSlot(index, activeIndex, items.length);
                    const shouldShowTeam =
                      neighborSlot !== null &&
                      (isInteracting || ambientTeamSlots.has(neighborSlot));
                    const team = !shouldShowTeam || neighborSlot === null
                      ? null
                      : getShowcaseTeam(activeItem, neighborSlot, showcaseSeed);
                    const isActive = item.league.label === activeItem.league.label;

                    return (
                      <LeagueNode
                        key={item.league.label}
                        activeLeagueLabel={activeItem.league.label}
                        index={index}
                        ring={ring.ring}
                        isActive={isActive}
                        isDimmed={isInteracting && !isActive && !team}
                        item={item}
                        team={team}
                        onActivate={() => activateLeague(item.league.label)}
                      />
                    );
                  })}
              </ul>
            </li>
          ))}
        </ul>
      </div>

      <MobileLeagueRail
        activeItem={activeItem}
        items={items}
        onActivate={activateLeague}
      />
    </Section>
  );
}
