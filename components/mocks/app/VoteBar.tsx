'use client';

import { AnimatePresence, motion } from 'framer-motion';
import { useBuzzScene } from '@/src/hooks/useBuzzScene';

/**
 * VoteBar, web port of the mobile app's swipe VoteBar (fire vs cold).
 * Left side is cold (skip), right side is fire. Percentages tick with
 * AnimatePresence popLayout for a satisfying rollup.
 */
export function VoteBar() {
  const s = useBuzzScene();
  const firePct = Math.round(s.voteFire * 100);
  const coldPct = 100 - firePct;
  const totalLabel = s.voteTotal >= 1000 ? `${(s.voteTotal / 1000).toFixed(1)}k` : `${s.voteTotal}`;

  return (
    <div className="flex h-full flex-col justify-between rounded-xl p-6">
      <div className="flex items-center justify-between">
        <span className="font-mono text-[10px] uppercase tracking-[0.24em] text-muted">
          Crowd vote · live
        </span>
        <AnimatePresence mode="popLayout">
          <motion.span
            key={totalLabel}
            initial={{ y: -4, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ y: 4, opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="font-mono text-[11px] tabular-nums text-muted"
          >
            {totalLabel}
          </motion.span>
        </AnimatePresence>
      </div>

      <div className="flex flex-col gap-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-1.5 text-[#6C8EFF]">
            <span aria-hidden>❄️</span>
            <AnimatePresence mode="popLayout">
              <motion.span
                key={coldPct}
                initial={{ y: -4, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                exit={{ y: 4, opacity: 0 }}
                transition={{ duration: 0.18 }}
                className="font-sans text-[20px] font-light leading-none tabular-nums"
              >
                {coldPct}%
              </motion.span>
            </AnimatePresence>
          </div>
          <div className="flex items-center gap-1.5 text-foreground">
            <AnimatePresence mode="popLayout">
              <motion.span
                key={firePct}
                initial={{ y: -4, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                exit={{ y: 4, opacity: 0 }}
                transition={{ duration: 0.18 }}
                className="font-sans text-[20px] font-light leading-none tabular-nums"
              >
                {firePct}%
              </motion.span>
            </AnimatePresence>
            <span aria-hidden>🔥</span>
          </div>
        </div>

        <div className="relative flex h-[6px] w-full overflow-hidden rounded-full bg-white/[0.04]">
          <div
            className="h-full"
            style={{
              width: `${coldPct}%`,
              background: 'rgba(108, 142, 255, 0.55)',
              transition: 'width 380ms cubic-bezier(0.22, 1, 0.36, 1)'
            }}
          />
          <div
            className="h-full"
            style={{
              width: `${firePct}%`,
              background: 'linear-gradient(90deg, rgba(0,230,118,0.6) 0%, rgba(0,230,118,0.95) 100%)',
              transition: 'width 380ms cubic-bezier(0.22, 1, 0.36, 1)',
              boxShadow: firePct > 60 ? '0 0 10px rgba(0,230,118,0.45)' : 'none'
            }}
          />
        </div>
      </div>
    </div>
  );
}
