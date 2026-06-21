import Image from 'next/image';
import { Section } from '@/components/ui/Section';
import { Badge } from '@/components/ui/Badge';
import { LEAGUE_COUNT } from '@/src/lib/constants';

type Surface = { name: string; blurb: string; shot: string; pos: string };

const SURFACES: Surface[] = [
  { name: 'Swipe',     blurb: 'Swipe through live games and score the show 1 to 10.',                 shot: '/screenshot-rate.png',  pos: 'object-top' },
  { name: 'Games',     blurb: `Every live game across ${LEAGUE_COUNT} leagues, scored in real time.`,              shot: '/screenshot-games.png', pos: 'object-top' },
  { name: 'Swarm',     blurb: 'The community feed of ratings, takes, and reactions.',                 shot: '/screenshot-home.png',  pos: 'object-top' },
  { name: 'Crews',     blurb: 'Invite-only crews with shared brackets and a private leaderboard.',    shot: '/screenshot-home.png',  pos: 'object-center' },
  { name: 'Bets',      blurb: 'Snap a PrizePicks or Underdog slip and auto-grade it. No sportsbooks.', shot: '/screenshot-games.png', pos: 'object-center' },
  { name: 'Dashboard', blurb: 'Drag-and-drop widgets for the teams and leagues you actually follow.', shot: '/screenshot-home.png',  pos: 'object-bottom' }
];

export function ScrollRail() {
  return (
    <Section id="rail" aria-labelledby="rail-title">
      <header className="mb-8 max-w-[48ch]">
        <Badge>The app</Badge>
        <h2
          id="rail-title"
          className="mt-3 text-[clamp(32px,4.5vw,48px)] font-bold uppercase leading-[0.95] tracking-[-0.04em] text-foreground"
        >
          Built for every way you watch.
        </h2>
        <p className="mt-4 text-[14px] tracking-[-0.01em] text-muted">Scroll across the surfaces.</p>
      </header>

      <div className="-mx-6 flex snap-x snap-mandatory gap-4 overflow-x-auto px-6 pb-4 md:-mx-10 md:px-10 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
        {SURFACES.map((s) => (
          <article
            key={s.name}
            className="group w-[280px] shrink-0 snap-start overflow-hidden rounded-2xl border border-border bg-surface transition-colors hover:border-accent/40"
          >
            <div className="relative aspect-[4/5] w-full overflow-hidden bg-canvas">
              <Image
                src={s.shot}
                alt={`Buzzr ${s.name} screen`}
                fill
                sizes="280px"
                className={`object-cover ${s.pos} transition-transform duration-500 group-hover:scale-[1.04]`}
              />
              <div
                aria-hidden
                className="pointer-events-none absolute inset-0"
                style={{ background: 'linear-gradient(to bottom, transparent 52%, rgba(8,9,11,0.92))' }}
              />
              <span className="score-mono absolute bottom-3 left-4 text-[11px] uppercase tracking-[0.2em] text-accent">
                {s.name}
              </span>
            </div>
            <p className="p-4 text-[14px] leading-[1.5] tracking-[-0.01em] text-muted">{s.blurb}</p>
          </article>
        ))}
      </div>
    </Section>
  );
}
