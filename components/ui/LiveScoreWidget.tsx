'use client';

import { useEffect, useMemo, useRef, useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { readableTextColor } from '@/components/utils';
// Buzz score color bands , 1:1 with the mobile app's getRatingColor().
// Inlined here (the only consumer on the landing) to keep the dependency graph flat.
const RATING_BANDS = [
  { min: 9,   color: '#16a34a', label: 'Peak'    },
  { min: 8,   color: '#22c55e', label: 'Great'   },
  { min: 6.5, color: '#fde047', label: 'Good'    },
  { min: 5,   color: '#f59e0b', label: 'Mid'     },
  { min: 3,   color: '#ef4444', label: 'Bad'     },
  { min: 0,   color: '#7c3aed', label: 'Garbage' }
] as const;

function ratingBand(score: number) {
  return RATING_BANDS.find((b) => score >= b.min) ?? RATING_BANDS[RATING_BANDS.length - 1];
}

/**
 * LiveScoreWidget , hero scoreboard. Rotates through 5 games across 5 leagues
 * to demonstrate coverage breadth. 1:1 with the real app:
 *   - league badge (brand color, exact hex from league-brand.ts)
 *   - red LIVE pulse + clock
 *   - team logo circles with team color + trigraph + full name
 *   - giant Buzz score (color from rating band)
 *   - live reactions row (🔥 💯 ❄️) , counts tick up
 *   - full league coverage strip marquee along the bottom
 */

type LiveGame = {
  league: string;
  leagueColor: string;
  clock: string;
  away:  { code: string; name: string; score: number; color: string };
  home:  { code: string; name: string; score: number; color: string };
  buzz: number;
  fire: number;
  hundred: number;
  ice: number;
  fans: string;
};

const GAMES: LiveGame[] = [
  {
    league: 'NBA', leagueColor: '#F88D24', clock: '4Q 3:11',
    away: { code: 'OKC', name: 'Thunder', score: 104, color: '#007AC1' },
    home: { code: 'DEN', name: 'Nuggets', score:  98, color: '#0E2240' },
    buzz: 8.9, fire: 512, hundred: 84, ice: 6, fans: '9.4k'
  },
  {
    league: 'NHL', leagueColor: '#014EAA', clock: 'OT 4:22',
    away: { code: 'FLA', name: 'Panthers',     score: 3, color: '#041E42' },
    home: { code: 'TOR', name: 'Maple Leafs',  score: 2, color: '#00205B' },
    buzz: 9.2, fire: 712, hundred: 128, ice: 19, fans: '4.1k'
  },
  {
    league: 'NCAAM', leagueColor: '#6C5CE7', clock: 'OT 0:12',
    away: { code: 'YAL', name: 'Yale',   score: 78, color: '#00356B' },
    home: { code: 'AUB', name: 'Auburn', score: 80, color: '#0C2340' },
    buzz: 9.8, fire: 1104, hundred: 201, ice: 4, fans: '22.8k'
  },
  {
    league: 'EPL', leagueColor: '#3D195B', clock: "85'",
    away: { code: 'ARS', name: 'Arsenal', score: 2, color: '#EF0107' },
    home: { code: 'TOT', name: 'Spurs',   score: 1, color: '#132257' },
    buzz: 8.6, fire: 433, hundred: 62, ice: 18, fans: '38.2k'
  },
  {
    league: 'F1', leagueColor: '#E10600', clock: 'L52/58',
    away: { code: 'VER', name: 'Verstappen', score: 1, color: '#1E41FF' },
    home: { code: 'NOR', name: 'Norris',     score: 2, color: '#FF8000' },
    buzz: 9.1, fire: 624, hundred: 93, ice: 11, fans: '14.7k'
  }
];

const LEAGUE_STRIP = [
  { code: 'NBA',   color: '#F88D24' },
  { code: 'NFL',   color: '#754C24' },
  { code: 'MLB',   color: '#1D3557' },
  { code: 'NHL',   color: '#014EAA' },
  { code: 'MLS',   color: '#1D8044' },
  { code: 'EPL',   color: '#3D195B' },
  { code: 'UCL',   color: '#0E1E5B' },
  { code: 'NCAAM', color: '#6C5CE7' },
  { code: 'NCAAF', color: '#8C1D40' },
  { code: 'F1',    color: '#E10600' },
  { code: 'UFC',   color: '#D20A0A' },
  { code: 'WC',    color: '#8A1538' },
  { code: 'ATP',   color: '#0066A1' },
  { code: 'NASCAR', color: '#FFD100' }
];

function useCountUp(target: number, key: string, duration = 900) {
  const [value, setValue] = useState(0);
  useEffect(() => {
    const start = performance.now();
    let raf = 0;
    const from = 0;
    const tick = (now: number) => {
      const t = Math.min((now - start) / duration, 1);
      const eased = 1 - Math.pow(1 - t, 3);
      setValue(parseFloat((from + eased * (target - from)).toFixed(1)));
      if (t < 1) raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [key, target]);
  return value;
}

function useTicker(base: number, cadenceMs = 800) {
  const [n, setN] = useState(base);
  useEffect(() => { setN(base); }, [base]);
  useEffect(() => {
    const id = window.setInterval(() => {
      setN((v) => v + Math.ceil(Math.random() * 3));
    }, cadenceMs);
    return () => window.clearInterval(id);
  }, [cadenceMs]);
  return n;
}


function ReactionCount({ emoji, value }: { emoji: string; value: number }) {
  return (
    <span className="inline-flex items-center gap-1 text-foreground">
      <span aria-hidden>{emoji}</span>
      <AnimatePresence mode="popLayout">
        <motion.span
          key={value}
          initial={{ y: -4, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          exit={{ y: 4, opacity: 0 }}
          transition={{ duration: 0.18 }}
          className="tabular-nums"
        >
          {value}
        </motion.span>
      </AnimatePresence>
    </span>
  );
}

export function LiveScoreWidget() {
  const ref = useRef<HTMLDivElement>(null);
  const [started, setStarted] = useState(false);
  const [idx, setIdx] = useState(0);
  const game = GAMES[idx];
  const key = `${game.away.code}-${game.home.code}`;
  const buzz = useCountUp(game.buzz, key);
  const band = useMemo(() => ratingBand(game.buzz), [game.buzz]);
  const leagueBadgeText = readableTextColor(game.leagueColor);
  const fire = useTicker(game.fire, 1200);
  const hundred = useTicker(game.hundred, 2600);

  // Start animation when scrolled into view
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const io = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setStarted(true);
          io.disconnect();
        }
      },
      { threshold: 0.35 }
    );
    io.observe(el);
    return () => io.disconnect();
  }, []);

  // Auto-rotate games
  useEffect(() => {
    if (!started) return;
    const id = window.setInterval(() => setIdx((i) => (i + 1) % GAMES.length), 4600);
    return () => window.clearInterval(id);
  }, [started]);

  const awayLeads = game.away.score > game.home.score;
  const [intPart, decPart] = buzz.toFixed(1).split('.');

  return (
    <div
      ref={ref}
      className="bg-canvas border border-surface relative w-full max-w-[380px] overflow-hidden rounded-2xl"
    >
      {/* Team-color gradient wash , away → home */}
      <AnimatePresence mode="wait">
        <motion.div
          key={`team-grad-${idx}`}
          aria-hidden
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.7 }}
          className="pointer-events-none absolute inset-0"
          style={{
            background: `
              radial-gradient(ellipse 80% 60% at 0% 20%,  ${game.away.color}4D 0%, transparent 60%),
              radial-gradient(ellipse 80% 60% at 100% 20%,${game.home.color}4D 0%, transparent 60%),
              linear-gradient(135deg, ${game.away.color}1F 0%, transparent 45%, transparent 55%, ${game.home.color}1F 100%)
            `
          }}
        />
      </AnimatePresence>

      {/* Ambient league-tinted glow on top */}
      <motion.div
        key={`glow-${idx}`}
        aria-hidden
        initial={{ opacity: 0 }}
        animate={{ opacity: 0.35 }}
        exit={{ opacity: 0 }}
        transition={{ duration: 0.6 }}
        className="pointer-events-none absolute inset-0"
        style={{ background: `radial-gradient(ellipse at top, ${game.leagueColor}33, transparent 60%)` }}
      />

      <div className="relative z-10 p-5">
        {/* Header: league + live */}
        <div className="mb-4 flex items-center justify-between">
          <AnimatePresence mode="wait">
            <motion.div
              key={game.league}
              initial={{ opacity: 0, x: -4 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: 4 }}
              transition={{ duration: 0.25 }}
              className="flex items-center gap-2"
            >
              <span
                className="flex h-7 items-center gap-1.5 rounded-md px-2 text-[10px] font-black uppercase tracking-[0.12em]"
                style={{ background: game.leagueColor, color: leagueBadgeText }}
              >
                <span aria-hidden className="h-1.5 w-1.5 rounded-full" style={{ background: leagueBadgeText }} />
                {game.league}
              </span>
            </motion.div>
          </AnimatePresence>
          <div className="flex items-center gap-2 text-[11px]">
            <span className="relative flex h-1.5 w-1.5">
              <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-red-500/70" />
              <span className="relative inline-flex h-1.5 w-1.5 rounded-full bg-red-500" />
            </span>
            <span className="font-mono tabular-nums text-red-400">LIVE</span>
            <span className="font-mono tabular-nums text-muted">{game.clock}</span>
          </div>
        </div>

        {/* Teams */}
        <AnimatePresence mode="wait">
          <motion.div
            key={`teams-${idx}`}
            initial={{ opacity: 0, y: 6 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -6 }}
            transition={{ duration: 0.32, ease: [0.22, 1, 0.36, 1] }}
            className="mb-5 flex items-center justify-between gap-3"
          >
            <TeamBlock team={game.away} leading={awayLeads} />
            <span className="font-mono text-[10px] font-bold uppercase tracking-wider text-muted">@</span>
            <TeamBlock team={game.home} leading={!awayLeads} align="right" />
          </motion.div>
        </AnimatePresence>

        {/* Rate action: giant score + live slider filling up */}
        <div className="mb-4">
          <div className="mb-1 flex items-center justify-between">
            <span className="font-mono text-[10px] uppercase tracking-[0.22em] text-muted">
              Rate this game
            </span>
            <span
              className="rounded-full px-2 py-0.5 font-mono text-[9px] font-bold uppercase tracking-[0.18em]"
              style={{ background: `${band.color}22`, color: band.color }}
            >
              {band.label}
            </span>
          </div>

          <div className="mb-3 flex items-baseline justify-between">
            <div className="flex items-baseline leading-none tabular-nums">
              <span
                className="font-sans text-[72px] font-light leading-none tracking-[-0.045em] transition-colors"
                style={{ color: band.color, textShadow: `0 0 24px ${band.color}66` }}
              >
                {intPart}
              </span>
              <span className="text-[40px] font-light leading-none" style={{ color: band.color }}>.</span>
              <span
                className="font-sans text-[72px] font-light leading-none tracking-[-0.045em] transition-colors"
                style={{ color: band.color, textShadow: `0 0 24px ${band.color}66` }}
              >
                {decPart}
              </span>
            </div>
            <span className="font-mono text-[11px] tabular-nums text-muted">/ 10</span>
          </div>

          {/* Auto-animating rate slider, fills from 0 to game.buzz */}
          <div className="relative mb-3 h-1.5 overflow-hidden rounded-full bg-subtle">
            <motion.div
              key={`fill-${idx}`}
              initial={{ width: '0%' }}
              animate={{ width: `${((buzz - 1) / 9) * 100}%` }}
              transition={{ duration: 0.9, ease: [0.22, 1, 0.36, 1] }}
              className="absolute inset-y-0 left-0 rounded-full"
              style={{
                background: band.color,
                boxShadow: `0 0 12px ${band.color}88`
              }}
            />
            <motion.div
              key={`thumb-${idx}`}
              aria-hidden
              initial={{ left: '0%' }}
              animate={{ left: `${((buzz - 1) / 9) * 100}%` }}
              transition={{ duration: 0.9, ease: [0.22, 1, 0.36, 1] }}
              className="pointer-events-none absolute top-1/2 h-3.5 w-3.5 -translate-x-1/2 -translate-y-1/2 rounded-full border-2 border-white"
              style={{ background: band.color }}
            />
          </div>

          <div className="flex items-center justify-between text-[9px] font-mono uppercase tracking-wider text-muted">
            <span>1</span>
            <span>drag to rate</span>
            <span>10</span>
          </div>
        </div>

        {/* Live reactions row */}
        <div className="flex items-center justify-between border-t border-border pt-3 text-[11px] font-mono tabular-nums">
          <ReactionCount emoji="🔥" value={fire} />
          <ReactionCount emoji="💯" value={hundred} />
          <ReactionCount emoji="❄️" value={game.ice} />
          <span className="text-muted">{game.fans} fans</span>
        </div>
      </div>

      {/* Full league coverage strip */}
      <div className="relative border-t border-border bg-black/30 py-2.5">
        <div className="pointer-events-none absolute inset-y-0 left-0 z-10 w-8 bg-gradient-to-r from-[#0a0a0c] to-transparent" />
        <div className="pointer-events-none absolute inset-y-0 right-0 z-10 w-8 bg-gradient-to-l from-[#0a0a0c] to-transparent" />
        <div className="flex gap-2 whitespace-nowrap" style={{ animation: 'marquee-scroll 34s linear infinite', width: 'max-content' }}>
          {[...LEAGUE_STRIP, ...LEAGUE_STRIP].map((l, i) => (
            <span
              key={`${l.code}-${i}`}
              className="inline-flex h-6 items-center gap-1.5 rounded-md px-2 font-mono text-[9px] font-bold uppercase tracking-[0.12em]"
              style={{
                background: `${l.color}26`,
                color: l.color,
                border: `1px solid ${l.color}55`
              }}
            >
              <span className="h-1.5 w-1.5 rounded-full" style={{ background: l.color }} />
              {l.code}
            </span>
          ))}
        </div>
      </div>
    </div>
  );
}

function TeamBlock({
  team,
  leading,
  align = 'left'
}: {
  team: LiveGame['away'];
  leading: boolean;
  align?: 'left' | 'right';
}) {
  return (
    <div className={`flex min-w-0 flex-1 items-center gap-3 ${align === 'right' ? 'flex-row-reverse text-right' : ''}`}>
      <span
        className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full text-[11px] font-black tracking-wider text-white"
        style={{ background: team.color }}
      >
        {team.code}
      </span>
      <div className={`flex min-w-0 flex-col ${align === 'right' ? 'items-end' : 'items-start'}`}>
        <span className={`truncate text-[10px] font-medium uppercase tracking-wider ${leading ? 'text-foreground' : 'text-muted'}`}>
          {team.name}
        </span>
        <span
          className={`font-sans text-[36px] font-light leading-none tabular-nums ${leading ? 'text-foreground' : 'text-muted'}`}
        >
          {team.score}
        </span>
      </div>
    </div>
  );
}
