'use client';

import { AnimatePresence, motion } from 'framer-motion';
import { useBuzzScene } from '@/src/hooks/useBuzzScene';

/**
 * EventTicker, rows fly in from the right as the scene progresses. Shows
 * the provider firing each event (ESPN, Google News, YouTube, Supabase,
 * Claude), so "wired to the whole sports internet" is literal.
 */
export function EventTicker() {
  const s = useBuzzScene();
  // Newest first, cap at 5 visible rows.
  const rows = [...s.events].reverse().slice(0, 5);

  return (
    <div className="flex h-full flex-col rounded-2xl p-6">
      <div className="mb-4 flex items-center justify-between">
        <span className="font-mono text-[10px] uppercase tracking-[0.24em] text-muted">
          Provider feed · live
        </span>
        <span className="inline-flex items-center gap-1.5 font-mono text-[10px] uppercase tracking-[0.22em] text-foreground">
          <span className="relative flex h-1.5 w-1.5">
            <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-foreground/60" />
            <span className="relative inline-flex h-1.5 w-1.5 rounded-full bg-foreground" />
          </span>
          listening
        </span>
      </div>

      <ul role="list" className="relative flex-1 overflow-hidden">
        <AnimatePresence initial={false} mode="popLayout">
          {rows.map((e) => (
            <motion.li
              key={e.id}
              layout
              initial={{ opacity: 0, x: 24, filter: 'blur(4px)' }}
              animate={{ opacity: 1, x: 0, filter: 'blur(0px)' }}
              exit={{ opacity: 0, x: -24, filter: 'blur(4px)' }}
              transition={{ duration: 0.28, ease: [0.22, 1, 0.36, 1] }}
              className="grid grid-cols-[54px_auto_1fr] items-center gap-3 border-b border-white/[0.04] py-2.5 last:border-b-0"
            >
              <span className="font-mono text-[10px] tabular-nums text-muted">
                {e.ts}
              </span>
              <span
                className="inline-flex items-center gap-1.5 rounded-sm px-1.5 py-0.5 font-mono text-[9px] font-bold uppercase tracking-[0.14em]"
                style={{
                  background: `${e.providerColor}22`,
                  color: e.providerColor,
                  border: `1px solid ${e.providerColor}44`
                }}
              >
                <span aria-hidden className="h-1 w-1 rounded-full" style={{ background: e.providerColor }} />
                {e.provider}
              </span>
              <span className="truncate text-[12px] font-light text-foreground">
                {e.body}
              </span>
            </motion.li>
          ))}
        </AnimatePresence>
        {rows.length === 0 && (
          <li className="flex h-full items-center justify-center text-[11px] font-light text-muted">
            Waiting on the first tick…
          </li>
        )}
      </ul>
    </div>
  );
}
