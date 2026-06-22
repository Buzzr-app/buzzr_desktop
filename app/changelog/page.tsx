import type { Metadata } from 'next';
import { APP_STORE_URL, BASE_URL, SITE_NAME } from '@/src/lib/constants';
import { EditorialShell } from '@/components/blog/EditorialShell';

const PAGE_TITLE = `Changelog · ${SITE_NAME}`;
const PAGE_DESCRIPTION =
  'Product release notes for Buzzr, the AI-native sports social app.';

export const metadata: Metadata = {
  title: PAGE_TITLE,
  description: PAGE_DESCRIPTION,
  alternates: {
    canonical: '/changelog',
    languages: {
      'en-US': `${BASE_URL}/changelog`,
      'x-default': `${BASE_URL}/changelog`
    }
  },
  openGraph: {
    type: 'article',
    url: `${BASE_URL}/changelog`,
    siteName: SITE_NAME,
    title: PAGE_TITLE,
    description: PAGE_DESCRIPTION
  },
  twitter: {
    card: 'summary_large_image',
    title: PAGE_TITLE,
    description: PAGE_DESCRIPTION,
    site: '@the_real_buzzr',
    creator: '@the_real_buzzr'
  }
};

type Release = {
  version: string;
  date: string;
  status?: 'Current' | 'Major' | 'Polish';
  signal: string;
  headline: string;
  summary: string;
  groups: Array<{ title: string; items: string[] }>;
  technical?: string[];
};

const RELEASES: readonly Release[] = [
  {
    version: '2.0',
    date: 'June 2026',
    status: 'Current',
    signal: 'Connected graph',
    headline: 'AI-native sports social comes into focus.',
    summary:
      'This release tightens the app around Scroll, dashboards, friends, leagues, and Buzzr Bets so the product feels like one connected sports graph.',
    groups: [
      {
        title: 'AI Feed and Scroll',
        items: [
          'Scroll now blends live games, recaps, ratings, friend takes, and league context into one faster stream.',
          'Buzzr Score language is clearer across cards, feeds, and social surfaces.',
          'AI context is framed as the layer that helps the app decide what belongs on each sports card.'
        ]
      },
      {
        title: 'Dashboards and Leagues',
        items: [
          'League surfaces now highlight schedules, scores, standings, form, and coverage status more clearly.',
          'Verified local league marks are used where available, with text chips for uncovered logo assets.',
          'Dashboard copy now focuses on personal league command centers instead of generic widgets.'
        ]
      },
      {
        title: 'Friends and Chat',
        items: [
          'Friend threads, reactions, crews, and shared game context are now presented as one social loop.',
          'Copy across the landing page now keeps conversation attached to the game that caused it.'
        ]
      },
      {
        title: 'Buzzr Bets',
        items: [
          'Buzzr Bets is now described as DFS slip tracking for picks placed elsewhere.',
          'The app does not integrate sportsbooks, place wagers, or sell odds.',
          'Slip scan, manual entry, auto grading, crew pools, and history are grouped into one clearer product story.'
        ]
      }
    ],
    technical: [
      'Clean Craft landing refresh from PR #20 remains the foundation.',
      'The landing site uses raw Three.js for the hero scene and keeps React Three Fiber out of the dependency graph.',
      'Content guard tests enforce no em dashes and block stale landing copy.'
    ]
  },
  {
    version: '1.5',
    date: 'May 2026',
    status: 'Major',
    signal: 'Deeper game context',
    headline: 'Game pages, league detail, and self-updating DFS tracking.',
    summary:
      'Buzzr got deeper game detail, safer league coverage, and a more reliable Buzzr Bets workflow.',
    groups: [
      {
        title: 'Game Detail',
        items: [
          'Game cards gained period, clock, airing network, and richer line score context.',
          'League detail tables became safer across ball sports, motorsports, tennis, combat, esports, and cricket.',
          'League landing previews became cleaner and more consistent.'
        ]
      },
      {
        title: 'Buzzr Bets',
        items: [
          'Manual player and game pickers landed for DFS slip tracking.',
          'Pending slips can re-check against scoreboards when a tracked game updates.',
          'Book classification is constrained to supported DFS providers for cleaner tracking.'
        ]
      },
      {
        title: 'Ratings and Notifications',
        items: [
          'Sports-aware tag catalogs make rating sheets feel native to each sport.',
          'Notification rows and push taps can deep link back to their source.'
        ]
      }
    ],
    technical: [
      'Supabase error handling, realtime types, invite tokens, and notifications settings were hardened.',
      'Security-sensitive random paths were tightened.'
    ]
  },
  {
    version: '1.4',
    date: 'May 2026',
    status: 'Major',
    signal: 'Social performance',
    headline: 'Social feed performance and the first Buzzr Bets foundation.',
    summary:
      'The app improved social feed performance, expanded dashboards, and introduced the foundation for DFS slip tracking.',
    groups: [
      {
        title: 'Friends and Chat',
        items: [
          'Chat streaks and stacked message timestamps made active threads easier to follow.',
          'Comment threads became shared with Explore so game conversation stayed connected.',
          'Realtime feed signals and cache boundaries were hardened.'
        ]
      },
      {
        title: 'Dashboards',
        items: [
          'Motorsport, tennis, UFC, boxing, and school pride surfaces received more complete context.',
          'Dashboard sync and cold start paths became faster and more resilient.'
        ]
      },
      {
        title: 'Buzzr Bets',
        items: [
          'DFS slip parsing, manual entry, bet lists, result tracking, and settlement watchers began shipping behind safer boundaries.',
          'The app kept sportsbook UI behind feature flags while the tracker matured.'
        ]
      }
    ],
    technical: [
      'Server-side sync, MMKV cold start, league freshness, and social feed cache paths were improved.'
    ]
  },
  {
    version: '1.3',
    date: 'April 2026',
    status: 'Polish',
    signal: 'Cleaner core',
    headline: 'A cleaner sports social core.',
    summary:
      'Buzzr narrowed around rating games, social context, dashboards, and league coverage.',
    groups: [
      {
        title: 'Core Product',
        items: [
          'Game rating flows became faster and easier to revisit.',
          'The social feed moved closer to game cards and friend activity.',
          'Dashboard configuration moved toward league and entity based pages.'
        ]
      },
      {
        title: 'Design',
        items: [
          'The app began consolidating around a more consistent visual system.',
          'Buttons, cards, and section rhythm were reduced into fewer reusable patterns.'
        ]
      }
    ]
  }
];

type ChangeTag = { label: string; className: string };

const TAG_ADDED: ChangeTag = {
  label: 'Added',
  className: 'border-accent/30 bg-accent/[0.08] text-accent-text'
};
const TAG_IMPROVED: ChangeTag = {
  label: 'Improved',
  className: 'border-white/12 bg-white/[0.04] text-foreground/75'
};
const TAG_FIXED: ChangeTag = {
  label: 'Fixed',
  className: 'border-white/12 bg-white/[0.02] text-muted'
};

// Map a release group to a restrained change tag for the changelog timeline.
function groupTag(title: string): ChangeTag {
  const key = title.toLowerCase();
  if (key.includes('buzzr bets') || key.includes('detail') || key.includes('feed') || key.includes('scroll')) {
    return TAG_ADDED;
  }
  if (key.includes('design') || key.includes('notification') || key.includes('rating')) {
    return TAG_FIXED;
  }
  return TAG_IMPROVED;
}

export default function ChangelogPage() {
  const changelogLd = {
    '@context': 'https://schema.org',
    '@type': 'CollectionPage',
    name: PAGE_TITLE,
    description: PAGE_DESCRIPTION,
    url: `${BASE_URL}/changelog`,
    mainEntity: RELEASES.map((release) => ({
      '@type': 'SoftwareSourceCode',
      name: `${SITE_NAME} ${release.version}`,
      dateModified: release.date,
      description: release.summary
    }))
  };

  return (
    <EditorialShell
      labelledBy="changelog-title"
      eyebrow="Release notes"
      title="What shipped in Buzzr."
      description="Every release that moved the app forward, from Scroll and dashboards to leagues and Buzzr Bets. Newest first."
      breadcrumbs={[{ label: 'Home', href: '/' }, { label: 'Changelog' }]}
      prelude={<script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(changelogLd) }} />}
      headerAside={
        <div className="lg:pl-8 lg:text-right">
          <p className="font-mono text-[12px] uppercase leading-[2] tracking-[0.12em] text-muted">
            Where it is now
          </p>
          <p className="mt-3 text-[15px] leading-[1.6] tracking-[0] text-foreground/75">
            Scroll, AI context, crews, dashboards, leagues, and DFS slip tracking are converging into one sports graph.
          </p>
          <a
            href={APP_STORE_URL}
            target="_blank"
            rel="noopener noreferrer"
            className="mt-5 inline-flex min-h-[44px] items-center justify-center rounded-full bg-accent px-4 py-2.5 text-[14px] font-semibold leading-none tracking-[0] text-on-accent transition-[transform,background-color] duration-200 ease-out hover:bg-accent-dim active:scale-[0.97] focus-visible:outline-none focus-visible:shadow-[var(--shadow-focus)] lg:ml-auto"
          >
            Get the app<span className="sr-only"> (opens in new tab)</span>
          </a>
        </div>
      }
    >
      <ol className="release-timeline relative space-y-0">
        {RELEASES.map((release, index) => (
          <li
            key={release.version}
            className="group relative grid gap-y-6 border-t border-white/10 py-12 first:border-t-0 first:pt-0 md:grid-cols-[200px_minmax(0,1fr)] md:gap-x-12 md:py-16 md:first:pt-2"
          >
            <div className="md:sticky md:top-24 md:self-start">
              <p className="font-mono text-[12px] uppercase leading-[2] tracking-[0.14em] text-muted">
                {release.date}
              </p>
              <p className="mt-1 font-mono text-[13px] leading-[1.6] tracking-[0.04em] text-foreground/80">
                Buzzr {release.version}
              </p>
              {release.status ? (
                <span className="mt-4 inline-flex items-center rounded-full border border-accent/30 bg-accent/[0.08] px-2.5 py-1 font-mono text-[11px] uppercase leading-none tracking-[0.12em] text-accent-text">
                  {release.status}
                </span>
              ) : null}
            </div>

            <article className="min-w-0">
              <h2 className="max-w-[24ch] text-[26px] font-semibold leading-[1.12] tracking-[-0.02em] text-foreground md:text-[34px]">
                {release.headline}
              </h2>
              <p className="mt-4 max-w-[68ch] text-[16px] leading-[1.65] tracking-[0] text-muted">
                {release.summary}
              </p>
              <p className="mt-4 font-mono text-[11px] uppercase leading-none tracking-[0.12em] text-muted/80">
                <span className="text-foreground/55">signal</span>{' '}
                <span className="text-foreground/80">{release.signal}</span>
              </p>

              <div className="mt-9 space-y-8">
                {release.groups.map((group) => {
                  const tag = groupTag(group.title);
                  return (
                    <section key={group.title}>
                      <div className="flex items-center gap-3">
                        <span className={`inline-flex items-center rounded-md border px-2 py-0.5 font-mono text-[11px] uppercase leading-none tracking-[0.1em] ${tag.className}`}>
                          {tag.label}
                        </span>
                        <h3 className="text-[14px] font-medium leading-none tracking-[0] text-foreground/85">
                          {group.title}
                        </h3>
                      </div>
                      <ul className="mt-4 space-y-2.5 border-l border-white/10 pl-5 text-[15px] leading-[1.6] tracking-[0] text-muted">
                        {group.items.map((item) => (
                          <li key={item} className="relative">
                            <span aria-hidden className="absolute -left-[21px] top-[0.62em] h-1.5 w-1.5 rounded-full bg-foreground/25" />
                            {item}
                          </li>
                        ))}
                      </ul>
                    </section>
                  );
                })}
              </div>

              {release.technical?.length ? (
                <details className="group/notes mt-9 border-t border-white/10 pt-6">
                  <summary className="flex cursor-pointer list-none items-center gap-2 font-mono text-[12px] uppercase leading-[2] tracking-[0.12em] text-muted transition-colors duration-200 ease-out hover:text-foreground/80">
                    <span aria-hidden className="text-foreground/40 transition-transform duration-200 ease-out group-open/notes:rotate-90">&rsaquo;</span>
                    Engineering notes
                  </summary>
                  <ul className="mt-4 space-y-2 pl-5 text-[13px] leading-[1.6] tracking-[0] text-muted/85">
                    {release.technical.map((item) => (
                      <li key={item}>{item}</li>
                    ))}
                  </ul>
                </details>
              ) : null}
            </article>
          </li>
        ))}
      </ol>
    </EditorialShell>
  );
}
