import Image from 'next/image';
import { Section } from '@/components/ui/Section';

type Surface = {
  title: string;
  body: string;
  shot: string;
  featured?: boolean;
  className?: string;
  imageClassName?: string;
};

const SURFACES: readonly Surface[] = [
  {
    title: 'AI Feed',
    body: 'Ratings, recaps, news, and friend signals in one sports graph.',
    shot: '/app-screens/feed.png',
    featured: true,
    className: 'md:col-span-2 md:row-span-2',
    imageClassName: 'object-top'
  },
  {
    title: 'Scroll',
    body: 'A fast stream tuned by game state and your leagues.',
    shot: '/app-screens/games.png',
    imageClassName: 'object-top'
  },
  {
    title: 'Dashboards',
    body: 'Teams, scores, standings, and context in one place.',
    shot: '/app-screens/dashboard.png',
    imageClassName: 'object-top'
  },
  {
    title: 'Friends and Chat',
    body: 'Threads, crews, replies, and reactions attached to the game.',
    shot: '/app-screens/friends-chat.png',
    imageClassName: 'object-center'
  },
  {
    title: 'Leagues',
    body: 'Verified marks where assets exist, clean chips where they do not.',
    shot: '/app-screens/leagues.png',
    imageClassName: 'object-bottom'
  },
  {
    title: 'Buzzr Bets',
    body: 'DFS slip tracking for picks placed elsewhere.',
    shot: '/app-screens/bets.png',
    imageClassName: 'object-top'
  }
];

export function SurfacesGrid() {
  return (
    <Section id="surfaces" aria-labelledby="surfaces-title">
      <header className="mx-auto mb-10 max-w-[680px] text-center">
        <h2
          id="surfaces-title"
          className="text-[clamp(34px,5vw,56px)] font-semibold leading-[1] tracking-[-0.04em] text-foreground"
        >
          The app map, without the clutter.
        </h2>
      </header>

      <div className="grid grid-cols-1 gap-4 md:grid-cols-4">
        {SURFACES.map((surface) => (
          <SurfaceCard key={surface.title} surface={surface} />
        ))}
      </div>
    </Section>
  );
}

function SurfaceCard({ surface }: { surface: Surface }) {
  return (
    <article
      className={`group flex min-h-[320px] flex-col overflow-hidden rounded-lg border border-border bg-surface shadow-[var(--shadow-card)] transition-[border-color,background-color,transform] duration-200 ease-out hover:border-accent/35 hover:bg-subtle/55 active:scale-[0.995] ${surface.className ?? ''}`}
    >
      <div className="relative min-h-[210px] flex-1 overflow-hidden bg-canvas">
        <Image
          src={surface.shot}
          alt={`Buzzr ${surface.title} screen`}
          fill
          sizes="(max-width: 768px) 100vw, 25vw"
          className={`object-cover ${surface.imageClassName ?? ''}`}
        />
        <div
          aria-hidden
          className="pointer-events-none absolute inset-x-0 bottom-0 h-1/2"
          style={{ background: 'linear-gradient(to top, rgba(0,0,0,0.72), transparent)' }}
        />
      </div>
      <div className="border-t border-border p-5">
        <h3 className="text-[18px] font-semibold leading-[1.25] tracking-[-0.025em] text-foreground">
          {surface.title}
        </h3>
        <p className="mt-2 max-w-[32ch] text-[14px] leading-[1.45] tracking-[-0.01em] text-muted">
          {surface.body}
        </p>
      </div>
    </article>
  );
}
