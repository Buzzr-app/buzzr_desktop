'use client';

import Image from 'next/image';
import { useEffect, useMemo, useRef, useState } from 'react';
import { motion, useMotionValue, useTransform, animate } from 'framer-motion';
import { getLeagueLogo } from '@/src/lib/leagueLogos';
import { getTeamLogo } from '@/src/lib/teamLogos';

/**
 * Tinder-style card stack that auto-advances every 4.2s (pauses while the
 * user is dragging). Cards now render with league-tinted gradients, league
 * watermarks, team logos, and outlet logos , so the stack reads as a proper
 * content feed instead of a layout demo.
 */

type GameCard = {
  kind: 'game';
  leagueLabel: string;               // nav label: "NBA · Live"
  leagueName: string;                // for logo lookup: "NBA"
  leagueSlug: 'nba' | 'nhl' | 'mlb' | 'mls';
  tint: string;                      // league brand color for gradient
  clock: string;
  away: { code: string; name: string; record: string; color: string; form: string };
  home: { code: string; name: string; record: string; color: string; form: string };
  awayScore: number;
  homeScore: number;
  buzz: number;
  fire: number;
  hint: string;
};

type NewsCard = {
  kind: 'news';
  outlet: string;                    // "ESPN"
  timeAgo: string;                   // "12 m"
  headline: string;
  summary: string;
  tint: string;
};

type TakeCard = {
  kind: 'take';
  timeAgo: string;
  user: string;
  body: string;
  fire: number;
  cold: number;
  tint: string;
};

type Card = GameCard | NewsCard | TakeCard;

const CARDS: Card[] = [
  {
    kind: 'game',
    leagueLabel: 'NBA · Live',
    leagueName: 'NBA',
    leagueSlug: 'nba',
    tint: '#F88D24',
    clock: '4Q 3:11',
    away: { code: 'OKC', name: 'Thunder', record: '48-14', color: '#007AC1', form: 'WWLWW' },
    home: { code: 'DEN', name: 'Nuggets', record: '46-16', color: '#0E2240', form: 'LWWWL' },
    awayScore: 104,
    homeScore: 98,
    buzz: 9.2,
    fire: 512,
    hint: 'Ball Arena · Western Conf.'
  },
  {
    kind: 'news',
    outlet: 'ESPN',
    timeAgo: '12 m',
    headline: 'Curry drops 54, Warriors steal Game 4 in OT.',
    summary: 'A 28-foot dagger and a 2-point series lead heading back to SF.',
    tint: '#CC0000'
  },
  {
    kind: 'take',
    timeAgo: '5 m',
    user: 'tonymad',
    body: 'Super Bowl overtime. I forgot to breathe for ten minutes.',
    fire: 248,
    cold: 12,
    tint: '#00e676'
  },
  {
    kind: 'game',
    leagueLabel: 'NHL · OT',
    leagueName: 'NHL',
    leagueSlug: 'nhl',
    tint: '#014EAA',
    clock: 'OT 4:22',
    away: { code: 'FLA', name: 'Panthers',    record: '41-19', color: '#041E42', form: 'WWWLW' },
    home: { code: 'TOR', name: 'Maple Leafs', record: '38-22', color: '#00205B', form: 'LWWLW' },
    awayScore: 3,
    homeScore: 2,
    buzz: 9.6,
    fire: 712,
    hint: 'Scotiabank · East semifinals'
  },
  {
    kind: 'news',
    outlet: 'The Athletic',
    timeAgo: '1 h',
    headline: 'Inside the bracket: why this year’s #13 seed is a trap.',
    summary: 'Three upset tells the model is already flagging for round 1.',
    tint: '#E82127'
  },
  {
    kind: 'take',
    timeAgo: '18 m',
    user: 'soccerphil',
    body: 'Rated Argentina v France a clean 10. Best 120 minutes I have ever watched.',
    fire: 512,
    cold: 4,
    tint: '#00e676'
  }
];

const AUTO_ADVANCE_MS = 2600;
const SWIPE_DURATION  = 0.32;

type SwipeKind = 'saved' | 'skipped';

export function SwipeStack() {
  const [index, setIndex] = useState(0);
  const [paused, setPaused] = useState(false);

  const topCard   = CARDS[index % CARDS.length];
  const nextCard  = CARDS[(index + 1) % CARDS.length];
  const thirdCard = CARDS[(index + 2) % CARDS.length];

  const x = useMotionValue(0);
  const rotate         = useTransform(x, [-200, 0, 200], [-12, 0, 12]);
  const savedOpacity   = useTransform(x, [0, 100], [0, 1]);
  const skippedOpacity = useTransform(x, [-100, 0], [1, 0]);
  // Emerald / red edge-glow intensity while dragging, cleaner than rubber stamps.
  const savedGlow   = useTransform(x, [0, 120], [0, 0.7]);
  const skippedGlow = useTransform(x, [-120, 0], [0.7, 0]);

  const advance = (_kind: SwipeKind) => {
    setIndex((i) => i + 1);
    x.set(0);
  };

  // Auto-advance. Pause while dragging or when tab is hidden.
  useEffect(() => {
    if (paused) return;
    if (typeof document !== 'undefined' && document.hidden) return;

    const id = window.setTimeout(() => {
      // Alternate between "saved" (right) and "skipped" (left) to keep it lively.
      const toRight = index % 2 === 0;
      animate(x, toRight ? 380 : -380, {
        duration: SWIPE_DURATION,
        ease: [0.22, 1, 0.36, 1],
        onComplete: () => advance(toRight ? 'saved' : 'skipped')
      });
    }, AUTO_ADVANCE_MS);

    return () => window.clearTimeout(id);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [index, paused]);

  // Respect page visibility: pause timers when tab is backgrounded.
  useEffect(() => {
    const onVis = () => setPaused((p) => (document.hidden ? true : p));
    document.addEventListener('visibilitychange', onVis);
    return () => document.removeEventListener('visibilitychange', onVis);
  }, []);

  const handleDragEnd = (_: unknown, info: { offset: { x: number }; velocity: { x: number } }) => {
    const threshold = 90;
    const { offset, velocity } = info;
    setPaused(false);
    if (offset.x > threshold || velocity.x > 500) {
      animate(x, 400, { duration: SWIPE_DURATION, onComplete: () => advance('saved') });
    } else if (offset.x < -threshold || velocity.x < -500) {
      animate(x, -400, { duration: SWIPE_DURATION, onComplete: () => advance('skipped') });
    } else {
      animate(x, 0, { type: 'spring', stiffness: 400, damping: 30 });
    }
  };

  const stack = useMemo(
    () => [
      { card: thirdCard, depth: 2 },
      { card: nextCard,  depth: 1 },
      { card: topCard,   depth: 0 }
    ],
    [thirdCard, nextCard, topCard]
  );

  return (
    <div
      className="relative h-[460px] w-full select-none"
      onMouseEnter={() => setPaused(true)}
      onMouseLeave={() => setPaused(false)}
    >
      {stack.map(({ card, depth }) => {
        const isTop = depth === 0;
        return (
          <motion.div
            key={`${depth}-${index}`}
            className="absolute inset-0 mx-auto flex max-w-[340px] flex-col"
            style={{
              zIndex: 10 - depth,
              ...(isTop ? { x, rotate } : {})
            }}
            initial={isTop ? false : { scale: 1 - depth * 0.04, y: depth * 10, opacity: 1 - depth * 0.1 }}
            animate={isTop ? {} : { scale: 1 - depth * 0.04, y: depth * 10, opacity: 1 - depth * 0.1 }}
            drag={isTop ? 'x' : false}
            dragElastic={0.18}
            dragConstraints={{ left: 0, right: 0 }}
            onDragStart={isTop ? () => setPaused(true) : undefined}
            onDragEnd={isTop ? handleDragEnd : undefined}
            whileTap={isTop ? { cursor: 'grabbing' } : undefined}
          >
            <div
              className="bg-canvas border border-surface relative h-full overflow-hidden rounded-2xl"
              style={{
                background: cardBackground(card)
              }}
            >
              {isTop && (
                <>
                  {/* Clean edge-glow during drag (replaces rubber stamps) */}
                  <motion.span
                    aria-hidden
                    className="pointer-events-none absolute inset-0 z-20 rounded-2xl"
                    style={{
                      opacity: savedGlow,
                      boxShadow: 'inset 0 0 0 2px rgba(0,230,118,0.9), inset 0 0 60px rgba(0,230,118,0.25)'
                    }}
                  />
                  <motion.span
                    aria-hidden
                    className="pointer-events-none absolute inset-0 z-20 rounded-2xl"
                    style={{
                      opacity: skippedGlow,
                      boxShadow: 'inset 0 0 0 2px rgba(239,68,68,0.9), inset 0 0 60px rgba(239,68,68,0.25)'
                    }}
                  />
                  <motion.span
                    style={{ opacity: savedOpacity }}
                    aria-hidden
                    className="pointer-events-none absolute right-5 top-5 z-30 font-mono text-[11px] font-black uppercase tracking-[0.32em] text-foreground"
                  >
                    Save
                  </motion.span>
                  <motion.span
                    style={{ opacity: skippedOpacity }}
                    aria-hidden
                    className="pointer-events-none absolute left-5 top-5 z-30 font-mono text-[11px] font-black uppercase tracking-[0.32em] text-red-400"
                  >
                    Skip
                  </motion.span>
                </>
              )}
              <CardBody card={card} />
            </div>
          </motion.div>
        );
      })}

    </div>
  );
}

/* ─── Card chrome ─────────────────────────────────────────────────────── */

function cardBackground(card: Card): string {
  // Team-color gradients on game cards for maximum saturation / on-brand
  // vibe. News + take cards keep a league/tint wash.
  if (card.kind === 'game') {
    return `
      radial-gradient(ellipse 75% 60% at 0% 0%,   ${card.away.color}99 0%, transparent 55%),
      radial-gradient(ellipse 75% 60% at 100% 100%, ${card.home.color}99 0%, transparent 55%),
      linear-gradient(155deg, rgb(18, 19, 23) 0%, rgb(10, 10, 13) 100%)
    `;
  }
  const tint = card.tint;
  return `
    radial-gradient(ellipse 70% 50% at 85% 0%,  ${tint}70 0%, transparent 58%),
    radial-gradient(ellipse 80% 60% at 0% 100%, ${tint}44 0%, transparent 55%),
    linear-gradient(155deg, rgb(18, 19, 23) 0%, rgb(10, 10, 13) 100%)
  `;
}

// Buzz band color (1:1 with app's getRatingColor())
function buzzColor(score: number): string {
  if (score >= 9) return '#00e676';
  if (score >= 7) return '#22c55e';
  if (score >= 5) return '#f59e0b';
  if (score >= 3) return '#ef4444';
  return '#7c3aed';
}
function buzzLabel(score: number): string {
  if (score >= 9) return 'Peak';
  if (score >= 8) return 'Great';
  if (score >= 6.5) return 'Good';
  if (score >= 5) return 'Mid';
  if (score >= 3) return 'Bad';
  return 'Garbage';
}

function CardBody({ card }: { card: Card }) {
  if (card.kind === 'game') return <GameBody card={card} />;
  if (card.kind === 'news') return <NewsBody card={card} />;
  return <TakeBody card={card} />;
}

/* ── Game card ── */

function GameBody({ card }: { card: GameCard }) {
  const logo = getLeagueLogo(card.leagueName);
  const awayLogo = getTeamLogo(card.leagueSlug, card.away.code);
  const homeLogo = getTeamLogo(card.leagueSlug, card.home.code);
  const awayLead = card.awayScore > card.homeScore;
  const bColor = buzzColor(card.buzz);
  const bLabel = buzzLabel(card.buzz);

  return (
    <div className="relative flex h-full flex-col justify-between p-5">
      {/* Faint league-logo watermark */}
      {logo && (
        <Image
          src={logo}
          alt=""
          aria-hidden
          width={200}
          height={200}
          sizes="200px"
          className="pointer-events-none absolute -right-10 -top-10 h-[200px] w-[200px] object-contain opacity-[0.07]"
        />
      )}

      <div className="relative flex items-center justify-between">
        <div className="flex items-center gap-2">
          {logo && (
            <span className="inline-flex h-5 w-5 items-center justify-center overflow-hidden rounded-full bg-white ring-1 ring-white/20">
              <Image
                src={logo}
                alt=""
                width={15}
                height={15}
                sizes="15px"
                unoptimized
                className="h-[15px] w-[15px] object-contain"
              />
            </span>
          )}
          <span className="font-medium text-[10px] uppercase tracking-[0.22em] text-foreground">
            {card.leagueLabel}
          </span>
        </div>
        <div className="flex items-center gap-1.5 font-mono text-[10px] font-bold tabular-nums text-red-400">
          <span className="relative flex h-1.5 w-1.5">
            <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-red-500/70" />
            <span className="relative inline-flex h-1.5 w-1.5 rounded-full bg-red-500" />
          </span>
          {card.clock}
        </div>
      </div>

      {/* Teams with live scores */}
      <div className="relative flex items-center justify-between gap-2">
        <TeamColumn
          code={card.away.code}
          name={card.away.name}
          record={card.away.record}
          form={card.away.form}
          score={card.awayScore}
          color={card.away.color}
          logo={awayLogo}
          leading={awayLead}
        />
        <span className="font-mono text-[10px] font-medium uppercase tracking-wider text-muted">@</span>
        <TeamColumn
          code={card.home.code}
          name={card.home.name}
          record={card.home.record}
          form={card.home.form}
          score={card.homeScore}
          color={card.home.color}
          logo={homeLogo}
          leading={!awayLead}
          align="right"
        />
      </div>

      {/* Buzz row: band-colored giant score + pill label + reactions */}
      <div className="relative">
        <div className="mb-1 flex items-center justify-between">
          <div className="font-mono text-[9px] uppercase tracking-[0.22em] text-muted">
            Buzzr Score
          </div>
          <span
            className="rounded-full px-2 py-0.5 font-mono text-[9px] font-bold uppercase tracking-[0.18em]"
            style={{ background: `${bColor}28`, color: bColor }}
          >
            {bLabel}
          </span>
        </div>
        <div className="flex items-end justify-between">
          <div
            className="font-sans text-[56px] font-light leading-none tabular-nums"
            style={{ color: bColor, textShadow: `0 0 18px ${bColor}55` }}
          >
            {card.buzz.toFixed(1)}
          </div>
          <div className="flex items-center gap-2.5 pb-1.5 font-mono text-[10px] tabular-nums">
            <span className="inline-flex items-center gap-0.5 text-[#f97316]">🔥 {card.fire}</span>
            <span className="text-muted">· {card.hint.split('·')[0].trim()}</span>
          </div>
        </div>
      </div>
    </div>
  );
}

function TeamColumn({
  code,
  name,
  record,
  form,
  score,
  color,
  logo,
  leading,
  align = 'left'
}: {
  code: string;
  name: string;
  record: string;
  form: string;
  score: number;
  color: string;
  logo: string;
  leading: boolean;
  align?: 'left' | 'right';
}) {
  const [logoBroken, setLogoBroken] = useState(false);

  return (
    <div className={`flex min-w-0 flex-1 flex-col gap-1.5 ${align === 'right' ? 'items-end text-right' : 'items-start'}`}>
      {/* Logo in team-color circle */}
      <span
        className="inline-flex h-11 w-11 items-center justify-center overflow-hidden rounded-full ring-2 ring-white/10"
        style={{ background: color }}
      >
        {logoBroken ? (
          <span className="font-mono text-[10px] font-bold uppercase tracking-wide text-white">
            {code}
          </span>
        ) : (
          <Image
            src={logo}
            alt=""
            width={32}
            height={32}
            sizes="32px"
            className="h-8 w-8 object-contain"
            onError={() => setLogoBroken(true)}
          />
        )}
      </span>
      <div className={`flex items-baseline gap-2 ${align === 'right' ? 'flex-row-reverse' : ''}`}>
        <span className={`font-sans text-[22px] font-light leading-none tabular-nums ${leading ? 'text-foreground' : 'text-muted'}`}>
          {code}
        </span>
        <span className={`font-sans text-[32px] font-light leading-none tabular-nums ${leading ? 'text-foreground' : 'text-muted'}`}>
          {score}
        </span>
      </div>
      <span className="truncate text-[10px] font-light leading-tight text-muted">
        {name} · {record}
      </span>
      {/* Form dots */}
      <div className={`flex gap-1 ${align === 'right' ? 'flex-row-reverse' : ''}`} aria-hidden>
        {form.split('').slice(0, 5).map((c, i) => (
          <span
            key={i}
            className="h-1.5 w-1.5 rounded-full"
            style={{
              background: c === 'W' ? '#22c55e' : c === 'L' ? '#ef4444' : '#fbbf24'
            }}
          />
        ))}
      </div>
    </div>
  );
}

/* ── News card ── */

function NewsBody({ card }: { card: NewsCard }) {
  const initials = card.outlet
    .split(/[^A-Za-z0-9]+/)
    .filter(Boolean)
    .map((part) => part[0])
    .join('')
    .slice(0, 3)
    .toUpperCase();

  return (
    <div className="relative flex h-full flex-col gap-4 p-5">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <span className="inline-flex h-5 min-w-5 items-center justify-center rounded-full bg-white/92 px-1 font-mono text-[8px] font-bold uppercase tracking-[0.08em] text-canvas ring-1 ring-white/20">
            {initials}
          </span>
          <span className="font-medium text-[10px] uppercase tracking-[0.22em] text-foreground">
            {card.outlet} · {card.timeAgo}
          </span>
        </div>
        <span className="font-mono text-[9px] uppercase tracking-[0.22em] text-foreground">
          News
        </span>
      </div>

      <div className="font-sans text-[24px] font-medium leading-[1.12] tracking-[-0.025em] text-foreground">
        {card.headline}
      </div>

      <div className="mt-auto text-[12px] font-light leading-relaxed text-muted">
        {card.summary}
      </div>

      <div className="flex items-center justify-between pt-2 text-[10px] font-light text-muted">
        <span className="inline-flex items-center gap-1.5">
          <span className="h-1 w-1 rounded-full bg-foreground" />
          AI-summarized · 3 s read
        </span>
        <span className="font-mono">read ↗</span>
      </div>
    </div>
  );
}

/* ── Take card ── */

function TakeBody({ card }: { card: TakeCard }) {
  return (
    <div className="relative flex h-full flex-col gap-4 p-5">
      <div className="flex items-center justify-between">
        <span className="font-medium text-[10px] uppercase tracking-[0.22em] text-foreground">
          Hot take · {card.timeAgo}
        </span>
        <div className="flex items-center gap-3 font-mono text-[10px] tabular-nums">
          <span className="text-foreground">🔥 {card.fire}</span>
          <span className="text-muted">🧊 {card.cold}</span>
        </div>
      </div>

      <div className="flex items-center gap-2">
        <span className="flex h-8 w-8 items-center justify-center rounded-full bg-foreground/85 text-[11px] font-medium text-canvas">
          {card.user.slice(0, 2).toUpperCase()}
        </span>
        <div className="flex flex-col">
          <span className="text-[12px] font-medium text-foreground">@{card.user}</span>
          <span className="text-[10px] font-light text-muted">Swarm · community</span>
        </div>
      </div>

      <div className="font-sans text-[24px] font-medium leading-[1.15] tracking-[-0.02em] text-foreground">
        “{card.body}”
      </div>

      <div className="mt-auto flex items-center justify-between text-[10px] font-light text-muted">
        <span>Reply to argue ↗</span>
        <span className="font-mono">{card.fire - card.cold > 0 ? `+${card.fire - card.cold}` : card.fire - card.cold}</span>
      </div>
    </div>
  );
}
