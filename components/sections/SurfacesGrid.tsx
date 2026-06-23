import Image from 'next/image';
import { Section } from '@/components/ui/Section';
import { getLeagueLogo, isRemoteLeagueLogo } from '@/src/lib/leagueLogos';
import { Avatar, type AvatarSeed } from '@/components/ui/Avatar';
import { DashboardScreen } from '@/components/ui/DashboardScreen';

type BentoCard = {
  label: string;
  body: string;
  preview: 'scroll' | 'dashboard' | 'friends' | 'leagues' | 'feed' | 'bets';
};

const BENTO_CARDS: readonly BentoCard[] = [
  {
    label: '01 Scroll',
    body: 'A fast stream tuned by game state and your leagues.',
    preview: 'scroll'
  },
  {
    label: '02 Dashboards',
    body: 'Teams, scores, standings, and context in one place.',
    preview: 'dashboard'
  },
  {
    label: '03 Friends and Chat',
    body: 'Threads, crews, replies, and reactions attached to the game.',
    preview: 'friends'
  },
  {
    label: '04 Leagues',
    body: 'Verified marks where assets exist, clean chips where they do not.',
    preview: 'leagues'
  },
  {
    label: '05 AI Feed',
    body: 'Ratings, recaps, news, and friend signals in one sports graph.',
    preview: 'feed'
  },
  {
    label: '06 Bets',
    body: 'DFS slip tracking for picks placed elsewhere.',
    preview: 'bets'
  }
];

export function SurfacesGrid() {
  return (
    <Section
      id="surfaces"
      aria-labelledby="surfaces-title"
      className="max-w-[1480px] py-16 md:py-24"
    >
      <header className="mx-auto mb-10 max-w-[760px] text-center md:mb-12">
        <div className="font-mono text-[11px] font-semibold uppercase leading-none tracking-[0.34em] text-accent-text">
          <span aria-hidden className="mr-5 inline-block h-px w-8 translate-y-[-3px] bg-accent/70" />
          Everything Buzzr
          <span aria-hidden className="ml-5 inline-block h-px w-8 translate-y-[-3px] bg-accent/70" />
        </div>
        <h2
          id="surfaces-title"
          className="font-hero mt-5 text-[clamp(38px,5vw,68px)] font-extrabold leading-[0.94] tracking-[-0.035em] text-foreground"
        >
          Sports. Social. Seamless.
        </h2>
      </header>

      <div className="grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-3">
        {BENTO_CARDS.map((card) => (
          <BentoSurfaceCard key={card.label} card={card} />
        ))}
      </div>
    </Section>
  );
}

function BentoSurfaceCard({ card }: { card: BentoCard }) {
  const [number, ...titleParts] = card.label.split(' ');
  const title = titleParts.join(' ');

  return (
    <article className="bento-card group">
      <div className="bento-card__preview">
        <SurfacePreview type={card.preview} />
      </div>
      <div className="bento-card__copy">
        <h3 className="font-hero flex items-baseline gap-3 text-[clamp(24px,2.8vw,32px)] font-extrabold leading-none tracking-[-0.035em] text-foreground">
          <span className="score-mono text-[28px] font-medium tracking-[-0.04em] text-white/82">
            {number}
          </span>
          <span>{title}</span>
        </h3>
      </div>
    </article>
  );
}

function SurfacePreview({ type }: { type: BentoCard['preview'] }) {
  if (type === 'scroll') {
    return <ScrollFeedPreview />;
  }

  if (type === 'dashboard') {
    return <DashboardCardPreview />;
  }

  if (type === 'friends') {
    return <SocialFeedPreview />;
  }

  if (type === 'leagues') {
    return <LeagueClusterPreview />;
  }

  if (type === 'feed') {
    return <AiFeedPreview />;
  }

  return <BetsPanelPreview />;
}

function DashboardCardPreview() {
  return (
    <div className="relative h-full min-h-[210px] overflow-hidden rounded-[calc(var(--bento-radius)_-_10px)] border border-white/[0.08] bg-canvas shadow-[inset_0_1px_0_rgba(255,255,255,0.06)]">
      <div className="absolute inset-x-0 top-0" style={{ aspectRatio: '9 / 19.5' }}>
        <DashboardScreen />
      </div>
      <div
        aria-hidden
        className="absolute inset-x-0 bottom-0 h-2/5 bg-gradient-to-t from-canvas via-canvas/20 to-transparent"
      />
    </div>
  );
}

const STACK_SEEDS: readonly AvatarSeed[] = ['maya', 'sid', 'marcus', 'nina', 'jordan', 'devin'];

function AvatarStack() {
  return (
    <div className="flex -space-x-2.5">
      {STACK_SEEDS.map((seed) => (
        <Avatar
          key={seed}
          seed={seed}
          size={36}
          className="border-2 border-[#080b0d] shadow-[0_10px_24px_rgba(0,0,0,0.34)]"
        />
      ))}
    </div>
  );
}

function SocialFeedPreview() {
  return (
    <div className="flex h-full min-h-[210px] flex-col justify-between rounded-[calc(var(--bento-radius)_-_10px)] border border-white/[0.08] bg-[#080b0d] p-4 shadow-[inset_0_1px_0_rgba(255,255,255,0.06)]">
      <div className="flex items-center justify-between gap-3">
        <AvatarStack />
        <span className="rounded-full border border-white/10 px-2.5 py-1 font-mono text-[10px] uppercase tracking-[0.12em] text-accent-text">
          12 live
        </span>
      </div>
      <div className="mt-5 space-y-2.5">
        <MessageBubble seed="sid" name="Sid" text="That 8.6 is real. This match is chaos." />
        <MessageBubble seed="maya" name="Maya" text="Pinned the finals thread. Get in here." align="right" />
        <MessageBubble seed="marcus" name="Dre" text="Crowd signal just flipped green." />
      </div>
    </div>
  );
}

function MessageBubble({
  align = 'left',
  name,
  seed,
  text
}: {
  align?: 'left' | 'right';
  name: string;
  seed: AvatarSeed;
  text: string;
}) {
  return (
    <div className={`flex items-end gap-2 ${align === 'right' ? 'justify-end' : 'justify-start'}`}>
      {align === 'left' && <Avatar seed={seed} size={26} className="shrink-0" />}
      <div
        className={`max-w-[78%] rounded-[18px] px-3.5 py-2.5 ${
          align === 'right'
            ? 'bg-accent text-on-accent'
            : 'border border-white/[0.08] bg-white/[0.065] text-white'
        }`}
      >
        <p className="font-hero text-[12px] font-bold leading-none tracking-[-0.01em] opacity-80">
          {name}
        </p>
        <p className="mt-1.5 text-[13px] leading-[1.28] tracking-[-0.01em]">{text}</p>
      </div>
      {align === 'right' && <Avatar seed={seed} size={26} className="shrink-0" />}
    </div>
  );
}

const LEAGUE_CHIPS = ['NBA', 'NFL', 'MLB', 'NHL', 'MLS', 'UCL', 'F1', 'ATP', 'CS2'];

function LeagueClusterPreview() {
  return (
    <div className="grid h-full min-h-[210px] place-items-center rounded-[calc(var(--bento-radius)_-_10px)] border border-white/[0.08] bg-[radial-gradient(circle_at_50%_42%,rgba(0,194,100,0.16),transparent_58%),#080b0d] p-4 shadow-[inset_0_1px_0_rgba(255,255,255,0.06)]">
      <div className="grid grid-cols-3 gap-2.5">
        {LEAGUE_CHIPS.map((label) => {
          const logo = getLeagueLogo(label);

          return (
            <span
              key={label}
              className="flex min-h-14 min-w-20 items-center justify-center rounded-[16px] border border-white/[0.08] bg-white/[0.065] px-3 text-center shadow-[0_14px_30px_rgba(0,0,0,0.26)]"
            >
              {logo ? (
                <Image
                  src={logo}
                  alt=""
                  width={30}
                  height={30}
                  unoptimized={isRemoteLeagueLogo(logo)}
                  className="h-8 w-8 object-contain"
                />
              ) : (
                <span className="font-mono text-[11px] font-semibold uppercase tracking-[0.08em] text-white/74">
                  {label}
                </span>
              )}
            </span>
          );
        })}
      </div>
    </div>
  );
}

const SCROLL_GAMES = [
  { a: 'pistons', b: 'knicks', sa: '102', sb: '98', status: 'Q4 2:14' },
  { a: 'mets', b: 'phillies', sa: '4', sb: '3', status: 'Top 8' },
  { a: 'rangers', b: 'bruins', sa: '2', sb: '2', status: '3rd 5:30' }
] as const;

function ScrollFeedPreview() {
  return (
    <div className="flex h-full min-h-[210px] flex-col rounded-[calc(var(--bento-radius)_-_10px)] border border-white/[0.08] bg-[#080b0d] p-4 shadow-[inset_0_1px_0_rgba(255,255,255,0.06)]">
      <div className="flex items-center justify-between">
        <span className="inline-flex items-center gap-1.5 font-mono text-[10px] uppercase tracking-[0.16em] text-accent-text">
          <span aria-hidden className="size-1.5 rounded-full bg-accent motion-safe:animate-buzz-pulse" />
          Live now
        </span>
        <span className="font-mono text-[10px] uppercase tracking-[0.12em] text-white/40">12 games</span>
      </div>
      <div className="mt-3 space-y-2">
        {SCROLL_GAMES.map((g) => (
          <div
            key={g.a}
            className="flex items-center gap-2 rounded-[14px] border border-white/[0.07] bg-white/[0.045] px-2.5 py-2"
          >
            <Image src={`/logos/${g.a}.png`} alt="" width={26} height={26} className="size-[26px] rounded-full bg-white/10 p-0.5" />
            <span className="font-mono text-[15px] font-bold tabular-nums text-white">{g.sa}</span>
            <span className="flex-1 text-center font-mono text-[9px] uppercase tracking-[0.1em] text-accent-text">
              {g.status}
            </span>
            <span className="font-mono text-[15px] font-bold tabular-nums text-white">{g.sb}</span>
            <Image src={`/logos/${g.b}.png`} alt="" width={26} height={26} className="size-[26px] rounded-full bg-white/10 p-0.5" />
          </div>
        ))}
      </div>
    </div>
  );
}

const AI_FEED_ROWS = [
  { a: 'pistons', b: 'knicks', match: 'Pistons · Knicks', league: 'NBA', score: '8.4', signal: 'friend heat' },
  { a: 'mets', b: 'phillies', match: 'Mets · Phillies', league: 'MLB', score: '7.1', signal: 'trending' },
  { a: 'rangers', b: 'bruins', match: 'Rangers · Bruins', league: 'NHL', score: '6.5', signal: 'live recap' }
] as const;

function AiFeedPreview() {
  return (
    <div className="flex h-full min-h-[210px] flex-col rounded-[calc(var(--bento-radius)_-_10px)] border border-white/[0.08] bg-[#080b0d] p-4 shadow-[inset_0_1px_0_rgba(255,255,255,0.06)]">
      <div className="rounded-[18px] border border-white/[0.08] bg-white/[0.055] px-4 py-3">
        <span className="font-mono text-[10px] uppercase tracking-[0.16em] text-accent-text">
          AI feed
        </span>
        <p className="mt-1 font-hero text-[18px] font-bold leading-tight tracking-[-0.03em] text-white">
          Your night, ranked by what matters.
        </p>
      </div>
      <div className="mt-3 space-y-2">
        {AI_FEED_ROWS.map((row) => (
          <div
            key={row.match}
            className="flex items-center gap-3 rounded-[16px] border border-white/[0.07] bg-white/[0.045] px-3 py-2.5"
          >
            <span className="flex shrink-0 -space-x-2">
              {[row.a, row.b].map((team) => (
                <Image
                  key={team}
                  src={`/logos/${team}.png`}
                  alt=""
                  width={28}
                  height={28}
                  className="size-7 rounded-full bg-white/10 p-1 ring-1 ring-black/50"
                />
              ))}
            </span>
            <span className="min-w-0 flex-1">
              <span className="block truncate text-[13px] font-semibold text-white">{row.match}</span>
              <span className="block text-[11px] text-muted">
                {row.league} · {row.signal}
              </span>
            </span>
            <span className="grid size-8 shrink-0 place-items-center rounded-full bg-accent/16 font-mono text-[12px] font-semibold text-accent-text">
              {row.score}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}

function BetsPanelPreview() {
  return (
    <div className="flex h-full min-h-[210px] flex-col justify-between rounded-[calc(var(--bento-radius)_-_10px)] border border-white/[0.08] bg-[#080b0d] p-4 shadow-[inset_0_1px_0_rgba(255,255,255,0.06)]">
      <div className="flex items-center justify-between">
        <span className="rounded-full bg-accent px-3 py-1 font-hero text-[12px] font-bold text-on-accent">
          Buzzr Bets
        </span>
        <span className="font-mono text-[10px] uppercase tracking-[0.14em] text-white/42">
          DFS tracker
        </span>
      </div>
      <div className="mt-5 rounded-[18px] border border-white/[0.08] bg-white/[0.055] p-4">
        <div className="flex items-center justify-between gap-3">
          <span className="flex items-center gap-2.5">
            <Image
              src="/logos/pistons.png"
              alt=""
              width={34}
              height={34}
              className="size-9 shrink-0 rounded-full bg-white/10 p-1 ring-1 ring-black/50"
            />
            <span>
              <span className="block text-[13px] font-semibold text-white">Detroit Pistons</span>
              <span className="mt-1 block text-[11px] text-muted">NBA · 24</span>
            </span>
          </span>
          <span className="font-mono text-[11px] uppercase tracking-[0.12em] text-accent-text">
            updated
          </span>
        </div>
        <div className="mt-4 grid grid-cols-3 gap-2">
          {[
            ['Spread', '-1.5'],
            ['Moneyline', '+120'],
            ['Total', '217.5']
          ].map(([label, value]) => (
            <span key={label} className="rounded-[14px] bg-black/28 px-2.5 py-3 text-center">
              <span className="block text-[11px] text-muted">{label}</span>
              <span className="mt-1 block font-mono text-[14px] text-white">{value}</span>
            </span>
          ))}
        </div>
      </div>
      <p className="mt-3 text-[12px] leading-[1.35] text-muted">
        Track slips placed elsewhere. No sportsbook integration.
      </p>
    </div>
  );
}
