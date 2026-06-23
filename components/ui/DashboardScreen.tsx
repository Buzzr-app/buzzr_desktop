import Image from 'next/image';
import {
  Bell,
  ChevronDown,
  Compass,
  Globe,
  LayoutGrid,
  MessageCircle,
  Plus,
  Search,
  SquarePen,
  Users
} from 'lucide-react';

// Faithful in-code rebuild of the Buzzr app dashboard screen (replaces the flat
// PNG screenshot). Color comes from brand tokens + white-alpha only; the Pistons
// crest is the real downloaded logo. The root is a container-query context so the
// em-based type scales with whatever phone/card width it is dropped into.
const LEAGUES = ['NBA', 'NCAAM', 'NHL', 'MLS'] as const;
const FORM = ['W', 'L', 'W', 'L', 'T'] as const;
const STANDINGS: readonly [string, string][] = [
  ['Oklahoma', '153-44-9'],
  ['San Antonio', '152-54-5'],
  ['New York', '138-65-8'],
  ['Detroit', '135-59-1']
];

export function DashboardScreen({ className = '' }: { className?: string }) {
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

        {/* search row */}
        <div className="flex items-center gap-2 px-[5%] pt-[3.5%]">
          <Bell className="size-[1.3em] shrink-0 text-white/65" strokeWidth={1.8} />
          <span className="flex h-[2.6em] flex-1 items-center gap-1.5 rounded-full border border-accent/55 bg-white/[0.04] px-2.5 text-white/45">
            <Search className="size-[1.1em]" strokeWidth={2} />
            <span className="text-[0.92em]">Search...</span>
          </span>
          <span className="font-bold text-accent-text">$</span>
          <span className="size-[1.9em] shrink-0 rounded-full bg-gradient-to-br from-accent to-accent-dim" />
        </div>

        {/* My Teams */}
        <div className="mt-[3%] flex items-center justify-between px-[5%]">
          <span className="flex items-center gap-1.5">
            <LayoutGrid className="size-[1.15em] text-white/55" strokeWidth={1.8} />
            <span className="leading-tight">
              <span className="block font-bold">My Teams</span>
              <span className="block text-[0.8em] text-white/45">1 dashboard</span>
            </span>
          </span>
          <ChevronDown className="size-[1.2em] text-white/55" strokeWidth={2} />
        </div>

        {/* edit / add */}
        <div className="mt-[2.5%] flex items-center justify-end gap-2 px-[5%] text-[0.82em]">
          <span className="flex items-center gap-1 text-white/70">
            <SquarePen className="size-[1.05em]" strokeWidth={1.8} /> Edit page
          </span>
          <span className="flex items-center gap-1 rounded-full border border-accent/45 px-2 py-[0.3em] text-accent-text">
            <Plus className="size-[1.05em]" strokeWidth={2.2} /> Add league
          </span>
        </div>

        {/* league chips */}
        <div className="mt-[3%] flex gap-1.5 px-[5%]">
          {LEAGUES.map((lg, i) => (
            <span
              key={lg}
              className={`rounded-full px-2.5 py-[0.35em] text-[0.8em] font-semibold ${
                i === 0 ? 'bg-accent text-on-accent' : 'bg-white/[0.06] text-white/55'
              }`}
            >
              {lg}
            </span>
          ))}
        </div>

        {/* Pistons header */}
        <div className="mx-[5%] mt-[3%] flex items-center gap-2 rounded-[0.9em] border border-white/[0.06] bg-white/[0.04] px-2.5 py-2">
          <Image src="/logos/pistons.png" alt="" width={40} height={40} className="size-[2.6em] shrink-0" />
          <span className="flex-1 leading-tight">
            <span className="block text-[1.02em] font-bold">Detroit Pistons</span>
            <span className="block text-[0.78em] text-white/55">NBA · #4</span>
          </span>
          <span className="flex items-center gap-1 text-[0.72em] font-semibold uppercase tracking-wide text-accent-text">
            <span className="size-[0.5em] rounded-full bg-accent" /> Updated now
          </span>
        </div>

        {/* widgets */}
        <div className="mt-[3%] grid grid-cols-2 gap-[3%] px-[5%]">
          <Widget label="Outlook">
            <span className="text-[1.5em] font-bold leading-none">Quiet</span>
            <span className="mt-1.5 flex items-end gap-[3px]">
              {[5, 8, 6, 9, 7].map((h, i) => (
                <span key={i} className="w-[0.5em] rounded-[1px] bg-white/30" style={{ height: `${h}px` }} />
              ))}
            </span>
          </Widget>
          <Widget label="Record">
            <span className="font-mono text-[1.55em] font-bold leading-none tracking-tight">25-14-1</span>
            <span className="mt-1.5 flex gap-1">
              {FORM.map((r, i) => (
                <span
                  key={i}
                  className={`grid size-[1.4em] place-items-center rounded-[4px] text-[0.62em] font-bold ${
                    r === 'W' ? 'bg-accent/20 text-accent-text' : 'bg-white/[0.07] text-white/45'
                  }`}
                >
                  {r}
                </span>
              ))}
            </span>
          </Widget>
          <Widget label="Schedule">
            <span className="text-[1.25em] font-bold leading-none">No game set</span>
            <span className="mt-1 block text-[0.72em] text-white/40">EDT</span>
          </Widget>
          <Widget label="Form">
            <span className="font-mono text-[1.4em] font-bold leading-none tracking-tight">4-5-1 L10</span>
            <span className="mt-1.5 flex items-end gap-[3px]">
              {[6, 4, 8, 5, 7, 4].map((h, i) => (
                <span key={i} className="w-[0.5em] rounded-[1px] bg-accent/45" style={{ height: `${h}px` }} />
              ))}
            </span>
          </Widget>
        </div>

        {/* standings + top players */}
        <div className="mt-[3%] grid grid-cols-2 gap-[3%] px-[5%]">
          <div className="rounded-[0.8em] border border-white/[0.06] bg-white/[0.035] p-2">
            <span className="text-[0.7em] font-semibold uppercase tracking-[0.1em] text-white/45">
              Standings
            </span>
            <span className="mt-1.5 block">
              {STANDINGS.map(([team, rec], i) => (
                <span key={team} className="mb-[3px] flex items-center gap-1.5 text-[0.74em] last:mb-0">
                  <span className="text-accent-text">{i + 1}</span>
                  <span className="flex-1 truncate text-white/80">{team}</span>
                  <span className="font-mono text-white/40">{rec}</span>
                </span>
              ))}
            </span>
          </div>
          <div className="flex flex-col rounded-[0.8em] border border-white/[0.06] bg-white/[0.035] p-2">
            <span className="text-[0.7em] font-semibold uppercase tracking-[0.1em] text-white/45">
              Top players
            </span>
            <span className="flex flex-1 flex-col items-center justify-center gap-1 py-2 text-center">
              <Plus className="size-[1.5em] text-accent-text" strokeWidth={2} />
              <span className="text-[0.74em] text-white/45">Add players for stat lines</span>
            </span>
          </div>
        </div>

        {/* tab bar */}
        <div className="mt-auto flex items-center justify-around border-t border-white/[0.06] px-[5%] pb-[5%] pt-[3%]">
          {[LayoutGrid, Globe, Compass, Users, MessageCircle].map((Icon, i) => (
            <Icon
              key={i}
              className={`size-[1.4em] ${i === 0 ? 'text-white' : 'text-white/35'}`}
              strokeWidth={1.8}
            />
          ))}
        </div>
      </div>
    </div>
  );
}

function Widget({ children, label }: { children: React.ReactNode; label: string }) {
  return (
    <div className="rounded-[0.8em] border border-white/[0.06] bg-white/[0.035] p-2">
      <span className="text-[0.7em] font-semibold uppercase tracking-[0.1em] text-white/45">{label}</span>
      <span className="mt-1.5 flex flex-col">{children}</span>
    </div>
  );
}
