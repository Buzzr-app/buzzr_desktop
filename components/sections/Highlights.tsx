import Image from 'next/image';
import { Section } from '@/components/ui/Section';
import { CalloutCard } from '@/components/ui/CalloutCard';
import { Badge } from '@/components/ui/Badge';
import { getLeagueLogo } from '@/src/lib/leagueLogos';
import { LEAGUE_COUNT } from '@/src/lib/constants';

type Clip = {
  league: string;
  matchup: string;
  subtitle: string;
  duration: string;
  buzz: number;
  views: string;
  teams: [string, string];
};

const CLIPS: Clip[] = [
  { league: 'NBA',   matchup: 'Thunder @ Nuggets',     subtitle: 'Ball Arena · OKC 112, DEN 109', duration: '9:42', buzz: 9.2, views: '1.4M', teams: ['OKC', 'DEN'] },
  { league: 'NHL',   matchup: 'Panthers @ Maple Leafs',subtitle: 'Scotiabank · OT · FLA 4, TOR 3', duration: '6:18', buzz: 9.6, views: '820k', teams: ['FLA', 'TOR'] },
  { league: 'EPL',   matchup: 'Arsenal v Spurs',       subtitle: 'Emirates · ARS 2, TOT 1',        duration: '5:27', buzz: 8.6, views: '3.1M', teams: ['ARS', 'TOT'] },
  { league: 'NCAAM', matchup: 'Yale v Auburn',         subtitle: 'OT thriller · #13 over #4',      duration: '8:04', buzz: 9.8, views: '612k', teams: ['YAL', 'AUB'] }
];

export function Highlights() {
  return (
    <Section id="highlights" aria-labelledby="highlights-title">
      <header className="mb-10 grid gap-4 lg:grid-cols-[1.1fr_0.9fr] lg:items-end lg:gap-12">
        <div>
          <Badge>Highlights</Badge>
          <h2
            id="highlights-title"
            className="mt-3 max-w-[18ch] text-[clamp(32px,4.5vw,48px)] font-bold uppercase leading-[0.95] tracking-[-0.04em] text-foreground"
          >
            Wake up. Watch last night.
          </h2>
        </div>
        <p className="max-w-[36ch] text-[16px] leading-[1.5] tracking-[-0.025em] text-muted lg:text-right">
          Post-game highlights. Linked from official channels.
        </p>
      </header>

      <CalloutCard className="mb-3 grid grid-cols-2 gap-4 md:grid-cols-4">
        <Fact value="Live"     label="on-demand" />
        <Fact value="12"       label="sports covered" />
        <Fact value={String(LEAGUE_COUNT)} label="leagues" />
        <Fact value="Quick"    label="recaps" />
      </CalloutCard>

      <ul role="list" className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-4">
        {CLIPS.map((c) => (
          <li key={c.matchup}><ClipCard clip={c} /></li>
        ))}
      </ul>

      <p className="mt-6 text-[14px] leading-[1.43] tracking-[0.1px] text-muted">
        Official channels. We link out, never rehost.
      </p>
    </Section>
  );
}

function ClipCard({ clip }: { clip: Clip }) {
  const logo = getLeagueLogo(clip.league);
  return (
    <CalloutCard className="group flex flex-col overflow-hidden p-0">
      <div className="relative aspect-video w-full overflow-hidden border-b border-border">
        <div
          aria-hidden
          className="absolute inset-0"
          style={{ background: 'linear-gradient(150deg, #0c1a12 0%, #08090b 55%, #0a120c 100%)' }}
        />
        {logo && (
          <Image
            src={logo}
            alt=""
            aria-hidden
            width={150}
            height={150}
            sizes="150px"
            className="pointer-events-none absolute -bottom-5 -right-5 h-[150px] w-[150px] object-contain opacity-[0.16]"
          />
        )}

        <div className="absolute inset-0 flex items-center justify-center">
          <span className="flex h-12 w-12 items-center justify-center border border-border bg-black/30 text-foreground backdrop-blur-sm transition-colors group-hover:border-accent group-hover:bg-accent/10 group-hover:text-accent">
            <svg width="13" height="15" viewBox="0 0 13 15" fill="none" aria-hidden>
              <path d="M1 1.2v12.6L12 7.5z" fill="currentColor" />
            </svg>
          </span>
        </div>

        <div className="absolute inset-x-0 bottom-0 flex items-center justify-center gap-2 pb-2.5">
          <span className="text-[15px] font-bold tracking-[-0.02em] text-foreground">{clip.teams[0]}</span>
          <span className="font-mono text-[10px] tracking-[0.1em] text-muted">vs</span>
          <span className="text-[15px] font-bold tracking-[-0.02em] text-foreground">{clip.teams[1]}</span>
        </div>

        <div className="absolute left-3 top-3">
          <Badge>{clip.league}</Badge>
        </div>
        <div className="absolute right-3 top-3 score-mono text-[14px] font-bold tabular-nums text-accent">
          {clip.buzz.toFixed(1)}
        </div>
        <div className="absolute bottom-3 right-3 font-mono text-[11px] tracking-[0.1em] text-muted">
          {clip.duration}
        </div>
      </div>
      <div className="flex flex-col gap-1 p-4">
        <h3 className="truncate text-[16px] font-semibold leading-[1.5] tracking-[-0.02em] text-foreground">
          {clip.matchup}
        </h3>
        <p className="truncate text-[14px] leading-[1.43] tracking-[0.1px] text-muted">
          {clip.subtitle}
        </p>
        <div className="mt-1 flex items-center justify-between font-mono text-[11px] tracking-[0.1em] text-muted">
          <span>{clip.views} views</span>
          <span>OFFICIAL</span>
        </div>
      </div>
    </CalloutCard>
  );
}

function Fact({ value, label }: { value: string; label: string }) {
  return (
    <div className="flex flex-col gap-1">
      <span className="score-mono text-[24px] leading-[1.2] tracking-[-0.025em] text-foreground">{value}</span>
      <Badge>{label}</Badge>
    </div>
  );
}
