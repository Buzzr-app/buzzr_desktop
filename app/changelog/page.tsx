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
      eyebrow="Product dossier"
      title="What shipped in Buzzr."
      description="Release notes for the AI-native sports social app, written as field files for fans and builders."
      breadcrumbs={[{ label: 'Home', href: '/' }, { label: 'Changelog' }]}
      prelude={<script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(changelogLd) }} />}
      headerAside={
        <div className="rounded-[8px] border border-white/10 bg-white/[0.04] p-5">
          <p className="font-mono text-[12px] uppercase leading-[2] tracking-[0.12em] text-white/45">
            Current file
          </p>
          <p className="mt-3 text-[15px] leading-[1.6] tracking-[0] text-white/68">
            Buzzr is converging Scroll, AI context, crews, dashboards, leagues, and DFS slip tracking into one sports graph.
          </p>
          <a
            href={APP_STORE_URL}
            target="_blank"
            rel="noopener noreferrer"
            className="mt-5 inline-flex min-h-[44px] items-center justify-center rounded-full bg-accent px-4 py-2.5 text-[14px] font-semibold leading-none tracking-[0] text-on-accent transition-colors hover:bg-accent-dim focus-visible:outline-none focus-visible:shadow-[var(--shadow-focus)]"
          >
            Get the app<span className="sr-only"> (opens in new tab)</span>
          </a>
        </div>
      }
    >
      <ol className="release-timeline relative space-y-6 before:absolute before:bottom-0 before:left-[18px] before:top-0 before:w-px before:bg-white/10 md:before:left-[92px]">
        {RELEASES.map((release) => (
          <li key={release.version} className="relative grid gap-4 pl-12 md:grid-cols-[184px_minmax(0,1fr)] md:pl-0">
            <div className="md:pr-8">
              <div className="absolute left-0 top-1 h-9 w-9 rounded-full border border-accent/45 bg-[#090e13] shadow-[0_0_0_6px_rgba(0,194,100,0.08)] md:left-[74px]" aria-hidden />
              <p className="font-mono text-[12px] uppercase leading-[2] tracking-[0.12em] text-white/45">
                Buzzr {release.version}
              </p>
              <p className="font-mono text-[12px] uppercase leading-[2] tracking-[0.12em] text-white/58">
                {release.date}
              </p>
              {release.status ? (
                <span className="mt-3 inline-flex rounded-full border border-accent/35 bg-accent/10 px-3 py-1 font-mono text-[11px] uppercase leading-none tracking-[0.12em] text-accent-text">
                  {release.status}
                </span>
              ) : null}
            </div>

            <article className="rounded-[8px] border border-white/10 bg-white/[0.04] p-5 md:p-7">
              <div className="flex flex-wrap items-center gap-2">
                <span className="font-mono text-[11px] uppercase leading-none tracking-[0.12em] text-white/42">
                  signal
                </span>
                <span className="rounded-full border border-white/10 bg-white/[0.04] px-2.5 py-1 font-mono text-[11px] uppercase leading-none tracking-[0.12em] text-white/68">
                  {release.signal}
                </span>
              </div>

              <h2 className="mt-5 max-w-[18ch] text-[30px] font-semibold leading-[1.05] tracking-[0] text-white md:text-[42px]">
                {release.headline}
              </h2>
              <p className="mt-4 max-w-[66ch] text-[16px] leading-[1.65] tracking-[0] text-white/62">
                {release.summary}
              </p>

              <div className="mt-7 divide-y divide-white/10 border-y border-white/10">
                {release.groups.map((group) => (
                  <section key={group.title} className="grid gap-4 py-5 md:grid-cols-[180px_minmax(0,1fr)]">
                    <h3 className="font-mono text-[12px] uppercase leading-[2] tracking-[0.12em] text-white">
                      {group.title}
                    </h3>
                    <ul className="space-y-3 text-[14px] leading-[1.6] tracking-[0] text-white/60">
                      {group.items.map((item) => (
                        <li key={item} className="flex gap-3">
                          <span aria-hidden className="mt-[0.7em] h-1.5 w-1.5 shrink-0 rounded-full bg-accent" />
                          <span>{item}</span>
                        </li>
                      ))}
                    </ul>
                  </section>
                ))}
              </div>

              {release.technical?.length ? (
                <details className="mt-5 border-t border-white/10 pt-5">
                  <summary className="cursor-pointer font-mono text-[12px] uppercase leading-[2] tracking-[0.12em] text-white/48">
                    Engineering notes
                  </summary>
                  <ul className="mt-4 space-y-2 text-[13px] leading-[1.6] tracking-[0] text-white/52">
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
