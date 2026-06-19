'use client';

import { AnimatePresence, motion } from 'framer-motion';
import { useBuzzScene } from '@/src/hooks/useBuzzScene';

/**
 * PollenLevel, web port of `PollenLevelBar`. Level badge + progress track
 * + numerator/denominator. Level ticks up at the `final` beat when the user
 * gets XP from their rating.
 */
export function PollenLevel() {
  const s = useBuzzScene();
  const pollenInLevel = s.pollenLifetime - s.pollenLevelFloor;
  const pollenNeeded = s.pollenLevelCeiling - s.pollenLevelFloor;
  const progress = Math.max(0.02, pollenInLevel / pollenNeeded);

  return (
    <div className="flex h-full flex-col justify-between rounded-xl p-6">
      <div className="flex items-center justify-between">
        <span className="font-mono text-[10px] uppercase tracking-[0.24em] text-muted">
          Pollen · you
        </span>
        <AnimatePresence>
          {s.phase === 'final' || s.phase === 'reactions' ? (
            <motion.span
              key="delta"
              initial={{ opacity: 0, y: -4 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -4 }}
              transition={{ duration: 0.22 }}
              className="rounded-full bg-foreground/15 px-2 py-0.5 font-mono text-[10px] font-bold tabular-nums text-foreground"
            >
              +12 XP
            </motion.span>
          ) : null}
        </AnimatePresence>
      </div>

      <div className="my-2 flex items-center gap-3">
        <div className="inline-flex items-center gap-1.5 rounded-xs bg-foreground/15 px-2.5 py-1">
          <span aria-hidden className="text-[14px]">🌼</span>
          <span className="font-mono text-xs font-bold tabular-nums text-foreground">
            Lv. {s.pollenLevel}
          </span>
        </div>
        <AnimatePresence mode="popLayout">
          <motion.span
            key={s.pollenLifetime}
            initial={{ y: -4, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ y: 4, opacity: 0 }}
            transition={{ duration: 0.18 }}
            className="font-sans text-[22px] font-light leading-none tabular-nums text-foreground"
          >
            {s.pollenLifetime.toLocaleString()}
          </motion.span>
        </AnimatePresence>
      </div>

      <div className="flex flex-col gap-1.5">
        <div className="relative h-[6px] w-full overflow-hidden rounded-full bg-white/[0.05]">
          <div
            className="absolute inset-y-0 left-0 rounded-full bg-foreground"
            style={{
              width: `${progress * 100}%`,
              boxShadow: '0 0 10px rgba(0,230,118,0.45)',
              transition: 'width 420ms cubic-bezier(0.22, 1, 0.36, 1)'
            }}
          />
        </div>
        <div className="flex items-center justify-between font-mono text-[10px] tabular-nums text-muted">
          <span>
            {pollenInLevel}/{pollenNeeded}
          </span>
          <span>to Lv. {s.pollenLevel + 1}</span>
        </div>
      </div>
    </div>
  );
}
