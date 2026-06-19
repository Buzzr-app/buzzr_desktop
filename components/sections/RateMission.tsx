import { Section } from '@/components/ui/Section';
import { CalloutCard } from '@/components/ui/CalloutCard';
import { Badge } from '@/components/ui/Badge';

type Moment = {
  league: string;
  matchup: string;
  score: string;
  label: string;
  take: string;
  author: string;
};

const SAMPLES: Moment[] = [
  {
    league: 'NCAAM',
    matchup: 'Yale vs Auburn',
    score: '9.8',
    label: 'Elite',
    take: 'OT buzzer-beater. #13 takes down #4. Instant classic.',
    author: 'hoopshead'
  },
  {
    league: 'NBA',
    matchup: 'Thunder vs Nuggets',
    score: '7.3',
    label: 'Good',
    take: 'Solid night of hoops. Lead change in the 4th made it worth it.',
    author: 'swingkid'
  },
  {
    league: 'NFL',
    matchup: 'Rams vs Cardinals',
    score: '2.8',
    label: 'Skip',
    take: 'Blowout from the first quarter. Turned it off at halftime.',
    author: 'soccerphil'
  }
];

export function RateMission() {
  return (
    <Section id="mission" aria-labelledby="mission-title">
      <div className="grid items-start gap-12 lg:grid-cols-[0.95fr_1.05fr] lg:gap-16">
        <div className="flex flex-col gap-6">
          <Badge>The mission</Badge>
          <h2
            id="mission-title"
            className="text-[clamp(36px,5vw,48px)] font-bold uppercase leading-[0.95] tracking-[-0.04em] text-foreground"
          >
            Letterboxd, for sports.
          </h2>
          <p className="max-w-[44ch] text-[16px] leading-[1.5] tracking-[-0.025em] text-muted">
            Rate every game 1 to 10. Log the ones that moved you. Argue about the ones that didn&apos;t. A diary of everything you actually watched, not the box score.
          </p>

          <ul className="mt-2 space-y-3 text-[16px] leading-[1.5] tracking-[-0.025em] text-foreground">
            <li className="flex items-baseline gap-4">
              <span className="font-mono text-[12px] tracking-[0.1em] text-muted">01</span>
              <span>Rate by what you felt, not who won.</span>
            </li>
            <li className="flex items-baseline gap-4">
              <span className="font-mono text-[12px] tracking-[0.1em] text-muted">02</span>
              <span>Drop a take. Your watch, your words.</span>
            </li>
            <li className="flex items-baseline gap-4">
              <span className="font-mono text-[12px] tracking-[0.1em] text-muted">03</span>
              <span>Build a log of every classic you called.</span>
            </li>
          </ul>
        </div>

        <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-1 lg:gap-4">
          {SAMPLES.map((m) => (
            <CalloutCard key={m.matchup} className="flex flex-col gap-3">
              <div className="flex items-center justify-between">
                <Badge>{m.league}</Badge>
                <Badge>{m.label.toUpperCase()}</Badge>
              </div>
              <div className="flex items-baseline justify-between">
                <h3 className="text-[20px] leading-[1.4] tracking-[-0.025em] text-foreground">
                  {m.matchup}
                </h3>
                <span className="score-mono text-[36px] leading-[1.2] tracking-[-0.025em] text-foreground">
                  {m.score}
                </span>
              </div>
              <p className="text-[14px] leading-[1.43] tracking-[0.1px] text-muted">
                &ldquo;{m.take}&rdquo;
              </p>
              <div className="mt-1 flex items-center gap-2.5">
                <span className="flex h-7 w-7 items-center justify-center border border-white/15 bg-white/[0.04] text-[11px] font-bold text-foreground">
                  {m.author.slice(0, 1).toUpperCase()}
                </span>
                <span className="text-[13px] font-medium text-foreground/80">@{m.author}</span>
                <svg width="13" height="13" viewBox="0 0 24 24" className="text-accent" aria-hidden fill="currentColor">
                  <path d="M9 16.2l-3.5-3.5L4 14.2l5 5 11-11-1.5-1.5z" />
                </svg>
              </div>
            </CalloutCard>
          ))}
        </div>
      </div>
    </Section>
  );
}
