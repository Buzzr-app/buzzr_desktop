import Image from 'next/image';
import { Check, Globe, LayoutGrid, MessageCircle, Receipt, Users, X } from 'lucide-react';

// In-code rebuild of a single Buzzr Bets slip screen (replaces the flat PNG of a
// scrolling feed - one game at a time). Color comes from brand tokens + white-alpha
// only; the crests are the real downloaded team logos. The root is a container-query
// context so the em-based type scales with whatever phone/card width it sits in.
// Pick legs are illustrative prop categories (no invented player names).
const LEGS: readonly [string, string, boolean][] = [
  ['Shots on goal', 'o2.5', true],
  ['Points', 'o1.5', true],
  ['Blocks', 'o1.5', false]
];

export function BetsScreen({ className = '' }: { className?: string }) {
  return (
    <div className={`h-full w-full ${className}`} style={{ containerType: 'inline-size' }}>
      <div
        className="flex h-full w-full flex-col overflow-hidden bg-canvas text-white"
        style={{ fontSize: 'clamp(8px, 3.9cqw, 13px)' }}
      >
        {/* status bar */}
        <div className="flex items-center justify-between px-[5%] pt-[3.5%] text-[0.85em] font-semibold text-white/90">
          <span className="tabular-nums">2:35</span>
          <span className="flex items-center gap-1.5">
            <span className="flex items-end gap-[1.5px]">
              {[3, 4, 5, 6].map((h) => (
                <span key={h} className="w-[2px] rounded-[1px] bg-white" style={{ height: `${h}px` }} />
              ))}
            </span>
            <span className="flex h-[9px] w-[15px] items-center rounded-[3px] border border-white/70 p-[1.5px]">
              <span className="block h-full w-[68%] rounded-[1px] bg-white" />
            </span>
          </span>
        </div>

        {/* title */}
        <div className="mt-[3.5%] flex items-center justify-between px-[5%]">
          <span className="flex items-center gap-1.5">
            <Receipt className="size-[1.25em] text-accent-text" strokeWidth={1.8} />
            <span className="text-[1.05em] font-bold">Your slip</span>
          </span>
          <span className="rounded-full bg-white/[0.06] px-2 py-[0.3em] text-[0.78em] font-semibold text-white/55">
            NHL
          </span>
        </div>

        {/* game card - one matchup, real crests */}
        <div className="mx-[5%] mt-[3.5%] rounded-[1em] border border-white/[0.07] bg-white/[0.04] p-[4%]">
          <div className="flex items-center justify-between text-[0.72em] font-semibold uppercase tracking-[0.1em] text-white/45">
            <span>Final</span>
            <span className="flex items-center gap-1 text-accent-text">
              <span className="size-[0.5em] rounded-full bg-accent" /> Graded
            </span>
          </div>

          <div className="mt-[4%] flex items-center justify-between">
            <Team logo="/logos/bruins.png" name="Boston" score={4} winner />
            <span className="px-2 text-[0.8em] font-semibold text-white/35">FT</span>
            <Team logo="/logos/rangers.png" name="Rangers" score={3} align="right" />
          </div>

          {/* Buzzr Score */}
          <div className="mt-[4%] flex items-center justify-between rounded-[0.7em] bg-black/30 px-2.5 py-[0.6em]">
            <span className="text-[0.74em] font-semibold uppercase tracking-[0.1em] text-white/45">
              Buzzr Score
            </span>
            <span className="flex items-baseline gap-1">
              <span className="font-mono text-[1.4em] font-bold leading-none text-accent-text">8.4</span>
              <span className="text-[0.72em] font-semibold text-white/45">Great</span>
            </span>
          </div>
        </div>

        {/* slip legs - auto-graded against the box score */}
        <div className="mx-[5%] mt-[3.5%] flex-1 rounded-[1em] border border-white/[0.07] bg-white/[0.035] p-[4%]">
          <span className="text-[0.7em] font-semibold uppercase tracking-[0.1em] text-white/45">
            3 legs · PrizePicks
          </span>
          <div className="mt-[3%] flex flex-col gap-[3%]">
            {LEGS.map(([label, line, hit]) => (
              <div key={label} className="flex items-center gap-2">
                <span
                  className={`grid size-[1.6em] shrink-0 place-items-center rounded-full ${
                    hit ? 'bg-accent/20 text-accent-text' : 'bg-live/15 text-live'
                  }`}
                >
                  {hit ? (
                    <Check className="size-[1em]" strokeWidth={2.6} />
                  ) : (
                    <X className="size-[1em]" strokeWidth={2.6} />
                  )}
                </span>
                <span className="flex-1 text-[0.84em] text-white/80">{label}</span>
                <span className="font-mono text-[0.8em] text-white/45">{line}</span>
              </div>
            ))}
          </div>
        </div>

        {/* slip result */}
        <div className="mx-[5%] mt-[3.5%] flex items-center justify-between rounded-[0.9em] border border-accent/30 bg-accent/[0.08] px-3 py-[0.7em]">
          <span className="text-[0.8em] font-semibold text-white/70">2 of 3 legs hit</span>
          <span className="font-mono text-[0.95em] font-bold text-accent-text">+1.8u</span>
        </div>

        {/* tab bar */}
        <div className="mt-[3.5%] flex items-center justify-around border-t border-white/[0.06] px-[5%] pb-[5%] pt-[3%]">
          {[LayoutGrid, Globe, Receipt, Users, MessageCircle].map((Icon, i) => (
            <Icon
              key={i}
              className={`size-[1.4em] ${i === 2 ? 'text-white' : 'text-white/35'}`}
              strokeWidth={1.8}
            />
          ))}
        </div>
      </div>
    </div>
  );
}

function Team({
  logo,
  name,
  score,
  winner = false,
  align = 'left'
}: {
  logo: string;
  name: string;
  score: number;
  winner?: boolean;
  align?: 'left' | 'right';
}) {
  return (
    <span className={`flex flex-1 items-center gap-2 ${align === 'right' ? 'flex-row-reverse text-right' : ''}`}>
      <Image src={logo} alt="" width={40} height={40} className="size-[2.4em] shrink-0" />
      <span className="leading-tight">
        <span className={`block text-[0.92em] ${winner ? 'font-bold text-white' : 'font-semibold text-white/70'}`}>
          {name}
        </span>
        <span className={`block font-mono text-[1.3em] font-bold leading-none ${winner ? 'text-white' : 'text-white/55'}`}>
          {score}
        </span>
      </span>
    </span>
  );
}
