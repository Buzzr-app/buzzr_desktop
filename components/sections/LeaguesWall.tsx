import Image from 'next/image';
import { Section } from '@/components/ui/Section';
import { Badge } from '@/components/ui/Badge';
import { Marquee } from '@/components/Marquee';
import { LEAGUES, SPORT_LABELS, SPORT_ORDER, type League, type LeagueSport } from '@/src/lib/constants';
import { LeagueChip } from '@/components/sections/LeagueChip';
import { getLeagueLogo } from '@/src/lib/leagueLogos';

const GROUPED: Record<LeagueSport, League[]> = SPORT_ORDER.reduce(
  (acc, sport) => {
    acc[sport] = LEAGUES.filter((l) => l.sport === sport);
    return acc;
  },
  {} as Record<LeagueSport, League[]>
);

const LOGO_LEAGUES = LEAGUES.filter((l) => getLeagueLogo(l.label));

export function LeaguesWall() {
  return (
    <section id="leagues" aria-labelledby="leagues-title" className="relative">
      <div aria-hidden className="mx-auto w-full max-w-[1400px] px-6 pt-12 md:pt-[48px]">
        <Marquee speed={45} />
      </div>

      <Section className="pt-12 md:pt-[48px]">
        <header className="mb-10 max-w-[52ch]">
          <Badge>Coverage</Badge>
          <h2
            id="leagues-title"
            className="mt-3 text-[clamp(32px,4.5vw,48px)] font-bold uppercase leading-[0.95] tracking-[-0.04em] text-foreground"
          >
            Every league you actually watch.
          </h2>
          <p className="mt-5 text-[16px] leading-[1.5] tracking-[-0.025em] text-muted">
            47 leagues across 12 sports, from NBA Playoffs and FIFA World Cup 2026 to F1, IPL, the UFC P4P chase, and the UCL knockouts. Track upcoming events, rate live games as they finish, log historical classics to your profile, and host watch parties with friends to rate in real time. No spreads. No lines. No gambling.
          </p>
        </header>

        {/* Real league logos, shown not claimed */}
        <div className="mb-12 grid grid-cols-3 border-l border-t border-white/10 sm:grid-cols-4 md:grid-cols-6 lg:grid-cols-8">
          {LOGO_LEAGUES.map((l) => {
            const logo = getLeagueLogo(l.label)!;
            return (
              <div
                key={l.label}
                className="group flex aspect-square flex-col items-center justify-center gap-2 border-b border-r border-white/10 p-3 transition-colors hover:bg-white/[0.03]"
              >
                <Image
                  src={logo}
                  alt={l.long}
                  width={40}
                  height={40}
                  sizes="40px"
                  className="h-9 w-9 object-contain opacity-75 transition-opacity group-hover:opacity-100"
                />
                <span className="font-mono text-[9px] uppercase tracking-[0.12em] text-muted">{l.label}</span>
              </div>
            );
          })}
        </div>

        <div className="flex flex-col">
          {SPORT_ORDER.map((sport) => {
            const leagues = GROUPED[sport];
            if (leagues.length === 0) return null;
            return (
              <div
                key={sport}
                className="flex flex-col gap-3 border-t border-white/10 py-5 md:flex-row md:items-baseline md:gap-x-6 md:gap-y-3"
              >
                <div className="shrink-0 font-mono text-[12px] uppercase tracking-[0.1em] leading-[2] text-muted md:w-[140px]">
                  {SPORT_LABELS[sport]}
                </div>
                <ul className="flex flex-1 flex-wrap gap-2">
                  {leagues.map((l) => (
                    <li key={l.label}><LeagueChip league={l} /></li>
                  ))}
                </ul>
              </div>
            );
          })}
        </div>

        <p className="mt-6 text-[14px] leading-[1.43] tracking-[0.1px] text-muted">
          Live scores. More on the way.
        </p>
      </Section>
    </section>
  );
}
