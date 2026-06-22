import Image from 'next/image';
import { Section } from '@/components/ui/Section';
import { CalloutCard } from '@/components/ui/CalloutCard';
import { Badge } from '@/components/ui/Badge';

type Tile = {
  number: string;
  title: string;
  body: string;
  shot: string;
  pos: string;
};

const TILES: readonly Tile[] = [
  { number: '01', title: 'News & ratings in one feed.', body: 'News, ratings, leaderboards.',           shot: '/screenshot-home.png',  pos: 'object-top' },
  { number: '02', title: 'Your sports, your widgets.',  body: 'Drag-and-drop widgets per league.',       shot: '/screenshot-home.png',  pos: 'object-center' },
  { number: '03', title: 'Every stat, one tap deep.',   body: 'Box score to odds, stacked.',             shot: '/screenshot-games.png', pos: 'object-top' },
  { number: '04', title: 'Yell about it together.',     body: 'DMs, crews, live per-game threads.',       shot: '/screenshot-home.png',  pos: 'object-center' },
  { number: '05', title: 'Crews for bracket warfare.',  body: 'Invite-only crews and squads, shared leaderboards.',   shot: '/screenshot-games.png', pos: 'object-bottom' },
  { number: '06', title: 'Brackets you can’t put down.', body: 'Madness, playoffs, World Cup.',          shot: '/screenshot-games.png', pos: 'object-bottom' }
];

export function SurfacesGrid() {
  return (
    <Section id="surfaces" aria-labelledby="surfaces-title">
      <header className="mb-10 max-w-[44ch]">
        <h2
          id="surfaces-title"
          className="mt-3 text-[clamp(32px,4.5vw,48px)] font-bold uppercase leading-[0.95] tracking-[-0.04em] text-foreground"
        >
          One app. Six ways in.
        </h2>
      </header>

      <div className="grid grid-cols-1 gap-3 md:grid-cols-2 lg:grid-cols-3">
        {TILES.map((t) => (
          <TileCard key={t.title} tile={t} />
        ))}
      </div>
    </Section>
  );
}

function TileCard({ tile }: { tile: Tile }) {
  const { number, title, body, shot, pos } = tile;
  return (
    <CalloutCard className="group flex h-full flex-col gap-5">
      <div className="flex items-baseline gap-3">
        <Badge>{number}</Badge>
      </div>
      <div className="flex flex-col gap-2">
        <h3 className="text-[20px] font-semibold leading-[1.4] tracking-[-0.02em] text-foreground">{title}</h3>
        <p className="text-[14px] leading-[1.43] tracking-[0.1px] text-muted">{body}</p>
      </div>
      <div className="relative mt-auto aspect-[5/4] w-full overflow-hidden border border-border bg-canvas">
        <Image
          src={shot}
          alt={`Buzzr app: ${title}`}
          fill
          sizes="(max-width: 768px) 100vw, 33vw"
          className={`object-cover ${pos} transition-transform duration-500 group-hover:scale-[1.04]`}
        />
        <div
          aria-hidden
          className="pointer-events-none absolute inset-0"
          style={{ background: 'linear-gradient(to bottom, transparent 50%, rgba(8,9,11,0.88))' }}
        />
      </div>
    </CalloutCard>
  );
}
