'use client';

import Image from 'next/image';
import { useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { useBuzzScene } from '@/src/hooks/useBuzzScene';
import { readableTextColor } from '@/components/utils';

/**
 * SceneScoreboard, the bento's hero card. One live NBA scoreboard driven
 * entirely by the shared buzz-scene clock.
 */
export function SceneScoreboard() {
  const s = useBuzzScene();
  const awayLeads = s.away.score > s.home.score;
  const tied = s.away.score === s.home.score;
  const isFinal = s.periodLabel === 'FINAL';
  const leagueBadgeText = readableTextColor('#F88D24');

  return (
    <div className="relative h-full w-full overflow-hidden rounded-2xl">
      {/* Team-color gradient wash */}
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0"
        style={{
          background: `
            radial-gradient(ellipse 80% 60% at 0% 20%,  ${s.away.color}44 0%, transparent 60%),
            radial-gradient(ellipse 80% 60% at 100% 20%,${s.home.color}55 0%, transparent 60%),
            linear-gradient(135deg, ${s.away.color}1F 0%, transparent 45%, transparent 55%, ${s.home.color}1F 100%)
          `
        }}
      />
      {/* Buzzr-accent glow on top */}
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 opacity-40"
        style={{
          background: 'radial-gradient(ellipse at top, rgba(0,230,118,0.22), transparent 60%)'
        }}
      />

      <div className="relative z-10 flex h-full flex-col p-6">
        <div className="mb-5 flex items-center justify-between">
          <span
            className="inline-flex items-center gap-1.5 rounded-md px-2 py-1 font-mono text-[10px] font-bold uppercase tracking-[0.16em]"
            style={{ background: '#F88D24', color: leagueBadgeText }}
          >
            <span aria-hidden className="h-1.5 w-1.5 rounded-full" style={{ background: leagueBadgeText }} />
            NBA
          </span>
          <div className="flex items-center gap-2 font-mono text-[11px] tabular-nums">
            {!isFinal && (
              <span className="relative flex h-1.5 w-1.5">
                <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-red-500/70" />
                <span className="relative inline-flex h-1.5 w-1.5 rounded-full bg-red-500" />
              </span>
            )}
            <span className={isFinal ? 'text-foreground' : 'text-red-400'}>
              {isFinal ? 'FINAL' : 'LIVE'}
            </span>
            <span className="text-muted">{s.clock}</span>
          </div>
        </div>

        <div className="flex flex-1 items-center justify-between gap-4">
          <TeamBlock
            code={s.away.code}
            name={s.away.name}
            color={s.away.color}
            logoUrl={s.away.logoUrl}
            score={s.away.score}
            leading={awayLeads || tied}
          />
          <span className="shrink-0 font-mono text-[10px] font-bold uppercase tracking-wider text-muted">
            @
          </span>
          <TeamBlock
            code={s.home.code}
            name={s.home.name}
            color={s.home.color}
            logoUrl={s.home.logoUrl}
            score={s.home.score}
            leading={!awayLeads || tied}
            align="right"
          />
        </div>

        <div className="mt-5 flex items-center justify-between">
          <AnimatePresence mode="wait">
            <motion.span
              key={s.phase}
              initial={{ opacity: 0, y: 4 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -4 }}
              transition={{ duration: 0.22, ease: [0.22, 1, 0.36, 1] }}
              className="font-mono text-[10px] uppercase tracking-[0.22em] text-muted"
            >
              {phaseLabel(s.phase)}
            </motion.span>
          </AnimatePresence>
          <span
            className="rounded-full px-2 py-0.5 font-mono text-[9px] font-bold uppercase tracking-[0.18em]"
            style={{ background: `${s.bandColor}22`, color: s.bandColor }}
          >
            {s.bandLabel}
          </span>
        </div>
      </div>
    </div>
  );
}

function TeamBlock({
  code,
  name,
  color,
  logoUrl,
  score,
  leading,
  align = 'left'
}: {
  code: string;
  name: string;
  color: string;
  logoUrl: string;
  score: number;
  leading: boolean;
  align?: 'left' | 'right';
}) {
  const [logoBroken, setLogoBroken] = useState(false);

  return (
    <div
      className={`flex min-w-0 flex-1 items-center gap-3 ${
        align === 'right' ? 'flex-row-reverse text-right' : ''
      }`}
    >
      <span
        className="flex h-12 w-12 shrink-0 items-center justify-center overflow-hidden rounded-full bg-white/95 ring-1 ring-white/10 transition-opacity"
        style={{ opacity: leading ? 1 : 0.55 }}
      >
        {logoBroken ? (
          <span className="font-mono text-[10px] font-bold uppercase tracking-wide text-canvas">
            {code}
          </span>
        ) : (
          <Image
            src={logoUrl}
            alt=""
            width={40}
            height={40}
            sizes="40px"
            className="h-10 w-10 object-contain"
            onError={() => setLogoBroken(true)}
          />
        )}
      </span>
      <div
        className={`flex min-w-0 flex-col ${align === 'right' ? 'items-end' : 'items-start'}`}
      >
        <span
          className="truncate text-[10px] font-medium uppercase tracking-wider"
          style={{ color: leading ? '#ffffff' : 'rgb(var(--muted-foreground))' }}
        >
          {name}
        </span>
        <AnimatePresence mode="popLayout">
          <motion.span
            key={score}
            initial={{ y: -6, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ y: 6, opacity: 0 }}
            transition={{ duration: 0.22, ease: [0.22, 1, 0.36, 1] }}
            className="font-sans text-[40px] font-light leading-none tabular-nums"
            style={{ color: leading ? '#ffffff' : 'rgb(var(--muted-foreground))' }}
          >
            {score}
          </motion.span>
        </AnimatePresence>
        <span
          aria-hidden
          className="mt-1 h-[2px] w-6 rounded-full"
          style={{ background: color, opacity: leading ? 0.9 : 0.25 }}
        />
      </div>
    </div>
  );
}

function phaseLabel(p: string) {
  switch (p) {
    case 'idle':      return 'Fourth quarter';
    case 'run1':      return 'DEN on a run';
    case 'run2':      return '10-0 run';
    case 'run3':      return 'Jokic assist';
    case 'catchup':   return 'Two-point game';
    case 'tied':      return 'Tied · clutch window';
    case 'overtime':  return 'Overtime';
    case 'final':     return 'Game over';
    case 'reactions': return 'Reactions pouring in';
    default:          return '';
  }
}
