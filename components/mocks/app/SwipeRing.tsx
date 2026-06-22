'use client';

import { AnimatePresence, motion } from 'framer-motion';
import { useBuzzScene } from '@/src/hooks/useBuzzScene';

/**
 * ScrollRing, web port of `SwipeStatsBar`. SVG daily-goal ring that fills
 * toward 25 scroll actions. Pulses when the scene's `final` beat ticks up +1.
 */
const DAILY_GOAL = 25;
const RING_SIZE = 56;
const RING_STROKE = 4;
const RING_RADIUS = (RING_SIZE - RING_STROKE) / 2;
const RING_CIRC = 2 * Math.PI * RING_RADIUS;

export function SwipeRing() {
  const s = useBuzzScene();
  const todayCount = s.swipeCount;
  const streakDays = 9;
  const progress = Math.min(todayCount / DAILY_GOAL, 1);
  const isComplete = todayCount >= DAILY_GOAL;
  const dashoffset = RING_CIRC * (1 - progress);
  const ringColor = isComplete ? '#00e676' : '#00e676';

  return (
    <div className="flex h-full flex-col justify-between rounded-2xl p-6">
      <div className="flex items-center justify-between">
        <span className="font-mono text-[10px] uppercase tracking-[0.24em] text-muted">
          Your scrolls · today
        </span>
        <span className="inline-flex items-center gap-1 rounded-full border border-white/25 bg-canvas px-2 py-0.5 font-mono text-[10px] font-bold tabular-nums text-foreground">
          🔥 {streakDays}-day
        </span>
      </div>

      <div className="flex items-center gap-4">
        <div className="relative shrink-0" style={{ width: RING_SIZE, height: RING_SIZE }}>
          <svg width={RING_SIZE} height={RING_SIZE} style={{ transform: 'rotate(-90deg)' }}>
            <circle
              cx={RING_SIZE / 2}
              cy={RING_SIZE / 2}
              r={RING_RADIUS}
              fill="none"
              stroke="rgba(245, 251, 255, 0.1)"
              strokeWidth={RING_STROKE}
            />
            <circle
              cx={RING_SIZE / 2}
              cy={RING_SIZE / 2}
              r={RING_RADIUS}
              fill="none"
              stroke={ringColor}
              strokeWidth={RING_STROKE}
              strokeLinecap="round"
              strokeDasharray={RING_CIRC}
              strokeDashoffset={dashoffset}
              style={{
                transition: 'stroke-dashoffset 420ms cubic-bezier(0.22, 1, 0.36, 1)',
                filter: 'drop-shadow(0 0 6px rgba(0, 230, 118, 0.45))'
              }}
            />
          </svg>
          <div className="absolute inset-0 flex items-center justify-center">
            <AnimatePresence mode="popLayout">
              <motion.span
                key={todayCount}
                initial={{ y: -4, opacity: 0, scale: 0.9 }}
                animate={{ y: 0, opacity: 1, scale: 1 }}
                exit={{ y: 4, opacity: 0 }}
                transition={{ duration: 0.22, ease: [0.22, 1, 0.36, 1] }}
                className="font-mono text-[13px] font-bold tabular-nums text-foreground"
              >
                {todayCount}
              </motion.span>
            </AnimatePresence>
          </div>
        </div>
        <div className="min-w-0 flex flex-col gap-1">
          <span className="truncate font-sans text-[18px] font-light leading-tight text-foreground">
            {isComplete ? 'Goal reached.' : 'Keep scrolling.'}
          </span>
          <span className="text-[11px] font-light text-muted">
            {todayCount} / {DAILY_GOAL} today
          </span>
        </div>
      </div>
    </div>
  );
}
