import Image from 'next/image';
import { type CSSProperties } from 'react';
import { Section } from '@/components/ui/Section';
import { cn } from '@/components/utils';
import { getLeagueLogo, isRemoteLeagueLogo } from '@/src/lib/leagueLogos';
import { Avatar, type AvatarSeed } from '@/components/ui/Avatar';
import { GyroidField } from '@/components/ui/GyroidField';

type BentoCard = {
  emojis: readonly string[];
  featured?: boolean;
  preview: 'dashboard' | 'friends' | 'leagues' | 'signals' | 'bets';
  title: string;
};

type EmojiStyle = CSSProperties & {
  '--emoji-delay'?: string;
  '--emoji-x'?: string;
  '--emoji-y'?: string;
};

type DashboardWidget = {
  label: string;
  tone: 'accent' | 'cool' | 'gold' | 'neutral';
  value: string;
};

type TeamChip = {
  code: string;
  label: string;
  logo?: string;
};

const BENTO_CARDS: readonly BentoCard[] = [
  {
    title: 'Dashboards For Every Team',
    preview: 'dashboard',
    featured: true,
    emojis: ['❤️', '🏀', '⭐', '📊']
  },
  {
    title: 'Friends And Chat',
    preview: 'friends',
    emojis: ['💬', '🔥', '🙌']
  },
  {
    title: 'League Map',
    preview: 'leagues',
    emojis: ['🏆', '⚽', '🏁']
  },
  {
    title: 'Fan Signals',
    preview: 'signals',
    emojis: ['📈', '⚡', '👀']
  },
  {
    title: 'Buzzr Bets',
    preview: 'bets',
    emojis: ['✅', '💵', '🎯']
  }
];

const DASHBOARD_LEAGUES = ['NBA', 'NFL', 'MLB', 'NHL', 'MLS', 'NCAAM'] as const;

const DASHBOARD_WIDGETS: readonly DashboardWidget[] = [
  { label: 'Outlook', value: 'Quiet', tone: 'neutral' },
  { label: 'Record', value: '25-14-1', tone: 'accent' },
  { label: 'Form', value: '4-5-1', tone: 'cool' },
  { label: 'Standings', value: '#4 East', tone: 'gold' }
];

const TEAM_CHIPS: readonly TeamChip[] = [
  { code: 'DET', label: 'Detroit Pistons', logo: '/logos/pistons.png' },
  { code: 'NYK', label: 'New York Knicks', logo: '/logos/knicks.png' },
  { code: 'NYR', label: 'New York Rangers', logo: '/logos/rangers.png' },
  { code: 'NYM', label: 'New York Mets', logo: '/logos/mets.png' }
];

const LEAGUE_SORT_ROWS: ReadonlyArray<{
  code: string;
  league: string;
  metric: string;
  name: string;
  tone: 'accent' | 'cool' | 'gold';
}> = [
  { code: 'NBA', league: 'Basketball', name: 'Hawks, Knicks, Pistons', metric: '12 teams', tone: 'accent' },
  { code: 'NFL', league: 'Football', name: 'Bills, Lions, Chiefs', metric: '8 crews', tone: 'cool' },
  { code: 'MLB', league: 'Baseball', name: 'Mets, Phillies, Dodgers', metric: '6 boards', tone: 'gold' }
];

const CHAT_MESSAGES: readonly { align: 'left' | 'right'; avatarSeed: AvatarSeed; name: string; text: string; time: string }[] = [
  { align: 'left', avatarSeed: 'maya', name: 'Maya', text: 'Garden is loud. Save that block.', time: '0:18' },
  { align: 'right', avatarSeed: 'sam', name: 'You', text: 'Clip saved. Run it back after the buzzer.', time: 'now' },
  { align: 'left', avatarSeed: 'jordan', name: 'Jules', text: 'Brunson is hunting switches again.', time: '0:06' }
];

export function SurfacesGrid() {
  return (
    <Section
      id="surfaces"
      aria-labelledby="surfaces-title"
      className="max-w-[1480px] pt-10 pb-14 md:pt-14 md:pb-20"
    >
      <header className="mx-auto mb-9 max-w-[720px] text-center md:mb-11">
        <h2
          id="surfaces-title"
          className="font-hero text-[clamp(38px,5vw,68px)] font-extrabold leading-[0.94] tracking-[-0.035em] text-foreground"
        >
          Your Sports, Sorted
        </h2>
      </header>

      <div className="bento-layout">
        {BENTO_CARDS.map((card) => (
          <BentoSurfaceCard key={card.title} card={card} />
        ))}
      </div>
    </Section>
  );
}

function BentoSurfaceCard({ card }: { card: BentoCard }) {
  return (
    <article
      className={cn('bento-card group', card.featured && 'bento-card--featured')}
      data-preview={card.preview}
    >
      <div className="bento-card__preview">
        <SurfacePreview type={card.preview} />
      </div>
      <div className="bento-card__copy">
        <h3 className="font-hero text-[clamp(24px,2.6vw,32px)] font-extrabold leading-[0.98] tracking-[-0.035em] text-foreground">
          {card.title}
        </h3>
      </div>
      <EmojiBurst items={card.emojis} />
    </article>
  );
}

function SurfacePreview({ type }: { type: BentoCard['preview'] }) {
  if (type === 'dashboard') {
    return <DashboardProofPreview />;
  }

  if (type === 'friends') {
    return <FriendsPreview />;
  }

  if (type === 'leagues') {
    return <LeagueSortPreview />;
  }

  if (type === 'signals') {
    return <FanSignalsPreview />;
  }

  return <BetsSlipPreview />;
}

function DashboardProofPreview() {
  return (
    <div className="bento-preview-shell bento-preview-dashboard">
      <div className="dashboard-proof-preview" aria-label="Buzzr dashboard sorting preview">
        <div className="dashboard-proof-preview__topbar">
          <span>
            <strong>My Teams</strong>
            <small>4 dashboards</small>
          </span>
          <span className="dashboard-proof-preview__action">Add league</span>
        </div>

        <div className="dashboard-proof-preview__league-tabs" aria-label="League filters">
          {DASHBOARD_LEAGUES.map((label, index) => (
            <span key={label} data-active={index === 0}>
              <LeagueChipLogo label={label} />
              {label}
            </span>
          ))}
        </div>

        <div className="dashboard-proof-preview__body">
          <div className="dashboard-proof-preview__team">
            <TeamLogo logo="/logos/pistons.png" label="Detroit Pistons" />
            <span>
              <small>NBA dashboard</small>
              <strong>Detroit Pistons</strong>
              <em>Updated now</em>
            </span>
          </div>

          <div className="dashboard-proof-preview__widgets">
            {DASHBOARD_WIDGETS.map((widget) => (
              <span key={widget.label} data-tone={widget.tone}>
                <small>{widget.label}</small>
                <strong>{widget.value}</strong>
              </span>
            ))}
          </div>
        </div>

        <div className="dashboard-proof-preview__teams" aria-label="Favorite teams">
          {TEAM_CHIPS.map((team) => (
            <span key={team.code}>
              <TeamLogo logo={team.logo} label={team.label} compact />
              <strong>{team.code}</strong>
              <small>saved</small>
            </span>
          ))}
        </div>
      </div>
    </div>
  );
}

function FriendsPreview() {
  return (
    <div className="bento-preview-shell bento-preview-chat">
      <ChatProofPreview />
    </div>
  );
}

function ChatProofPreview() {
  return (
    <div className="chat-proof-preview" aria-label="Buzzr friends and chat preview">
      <div className="chat-proof-preview__score">
        <span>BOS</span>
        <strong>102</strong>
        <em>Q4 1:12</em>
        <strong>99</strong>
        <span>NYK</span>
      </div>

      <div className="chat-proof-preview__header">
        <span className="chat-proof-preview__avatar-stack" aria-hidden>
          <span><Avatar seed="maya" size={30} className="block" /></span>
          <span><Avatar seed="jordan" size={30} className="block" /></span>
          <span><Avatar seed="sid" size={30} className="block" /></span>
        </span>
        <span className="chat-proof-preview__title">
          <strong>Celtics Crew</strong>
          <small>9 active in live thread</small>
        </span>
        <span className="chat-proof-preview__live">Live</span>
      </div>

      <div className="chat-proof-preview__messages">
        {CHAT_MESSAGES.map((message) => (
          <span key={`${message.name}-${message.text}`} data-align={message.align}>
            <em><Avatar seed={message.avatarSeed} size={28} className="block" /></em>
            <span>
              <small>
                {message.name} <b>{message.time}</b>
              </small>
              {message.text}
            </span>
          </span>
        ))}
      </div>

      <div className="chat-proof-preview__meta">
        <span>🔥 12 reacts</span>
        <span>🎥 3 clips</span>
        <span>💬 crew takes</span>
      </div>
    </div>
  );
}

function LeagueSortPreview() {
  return (
    <div className="bento-preview-shell bento-preview-leagues">
      <div className="league-sort-preview" aria-label="Buzzr league sorting preview">
        <div className="league-sort-preview__tabs">
          {['NBA', 'NCAAM', 'NHL', 'MLS'].map((label, index) => (
            <span key={label} data-active={index === 0}>
              <LeagueChipLogo label={label} />
              {label}
            </span>
          ))}
        </div>

        <div className="league-sort-preview__panel">
          <span className="league-sort-preview__count">
            <strong>49</strong>
            <small>leagues</small>
          </span>
          <div className="league-sort-preview__rows">
            {LEAGUE_SORT_ROWS.map((row) => (
              <span key={row.code} data-tone={row.tone}>
                <LeagueChipLogo label={row.code} />
                <span>
                  <small>{row.league}</small>
                  <strong>{row.name}</strong>
                </span>
                <em>{row.metric}</em>
              </span>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

function LeagueChipLogo({ label }: { label: string }) {
  const logo = getLeagueLogo(label);

  return (
    <span className="league-chip-logo" aria-hidden>
      {logo ? (
        <Image
          src={logo}
          alt=""
          width={28}
          height={28}
          unoptimized={isRemoteLeagueLogo(logo)}
          className="h-full w-full object-contain"
        />
      ) : (
        <span>{label.slice(0, 2)}</span>
      )}
    </span>
  );
}

function TeamLogo({
  compact = false,
  label,
  logo
}: {
  compact?: boolean;
  label: string;
  logo?: string;
}) {
  return (
    <span className={cn('team-proof-logo', compact && 'team-proof-logo--compact')} aria-hidden>
      {logo ? (
        <Image
          src={logo}
          alt=""
          width={compact ? 30 : 44}
          height={compact ? 30 : 44}
          className="h-full w-full object-contain"
        />
      ) : (
        <span>{label.slice(0, 2)}</span>
      )}
    </span>
  );
}

function FanSignalsPreview() {
  return (
    <div className="bento-preview-shell bento-preview-signals">
      <div className="fan-signal-card">
        <div className="flex items-center justify-between">
          <span className="font-mono text-[11px] uppercase tracking-[0.14em] text-white/48">
            Heat
          </span>
          <span className="rounded-full bg-accent/14 px-2 py-1 font-mono text-[10px] text-accent-text">
            Live
          </span>
        </div>
        <svg viewBox="0 0 260 104" role="img" aria-label="Buzzr fan signal chart">
          <path
            d="M4 78 C 36 60, 48 84, 74 58 S 122 30, 146 50 185 88, 216 38 244 25, 256 20"
            fill="none"
            stroke="currentColor"
            strokeLinecap="round"
            strokeWidth="5"
          />
          <path
            d="M4 88 C 38 74, 56 90, 84 72 S 130 58, 154 68 194 92, 224 58 246 50, 256 46"
            fill="none"
            stroke="currentColor"
            strokeLinecap="round"
            strokeOpacity="0.26"
            strokeWidth="4"
          />
        </svg>
        <div className="grid grid-cols-3 gap-2">
          {[
            ['🔥', '246'],
            ['💯', '81'],
            ['❄️', '19']
          ].map(([emoji, value]) => (
            <span key={emoji} className="fan-signal-reaction">
              <span>{emoji}</span>
              <strong>{value}</strong>
            </span>
          ))}
        </div>
      </div>
    </div>
  );
}

function BetsSlipPreview() {
  return (
    <div className="bento-preview-shell bento-preview-bets relative overflow-hidden">
      <GyroidField variant="hex" className="absolute inset-0 z-0" />
      <div className="bets-slip-preview relative z-10" aria-label="Buzzr Bets tracked slip preview">
        <div className="bets-slip-preview__top">
          <span>Tracked slip</span>
          <strong>Live</strong>
        </div>
        <div className="bets-slip-preview__summary">
          <span>
            <small>Potential</small>
            $124.80
          </span>
          <span>
            <small>Legs</small>
            3
          </span>
        </div>
        <div className="bets-slip-preview__legs">
          {[
            ['DET +2.5', 'tracking'],
            ['Brunson 24.5 pts', 'hit'],
            ['BOS moneyline', 'open']
          ].map(([label, state]) => (
            <span key={label} data-state={state}>
              <em />
              {label}
            </span>
          ))}
        </div>
      </div>
    </div>
  );
}

function EmojiBurst({ items }: { items: readonly string[] }) {
  return (
    <div className="emoji-burst" aria-hidden>
      {items.map((emoji, index) => (
        <span
          key={`${emoji}-${index}`}
          style={{
            '--emoji-delay': `${index * 70}ms`,
            '--emoji-x': `${18 + index * 24}%`,
            '--emoji-y': `${18 + (index % 2) * 42}%`
          } as EmojiStyle}
        >
          {emoji}
        </span>
      ))}
    </div>
  );
}
