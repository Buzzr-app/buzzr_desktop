import { Section } from '@/components/ui/Section';

const NPM_SEARCH = 'https://www.npmjs.com/search?q=%40buzzr';

type Pkg = { name: string; desc: string };

// Live @buzzr packages on npm (the Buzzr Bets + scoring internals).
const PACKAGES: Pkg[] = [
  { name: '@buzzr/dfs-engine', desc: 'DFS Settlement OS core: book policies, pure grading, and settlement orchestration.' },
  { name: '@buzzr/bets-core', desc: 'Buzzr Bets domain contracts, odds math, ROI rollups, and settlement adapters.' },
  { name: '@buzzr/entertainment-engine', desc: 'Transparent sports entertainment scoring and hybrid ML prediction.' },
  { name: '@buzzr/dfs-engine-espn', desc: 'ESPN gamelog, boxscore, and injury fetchers as a turnkey data layer.' },
  { name: '@buzzr/dfs-react', desc: 'Framework-agnostic view-model helpers for rendering settlements.' },
  { name: '@buzzr/dfs-cli', desc: 'Grade a DFS entry from JSON fixtures straight from the command line.' },
  { name: '@buzzr/dfs-testkit', desc: 'Fixture builders and mock providers for dfs-engine consumers.' },
  { name: '@buzzr/dfs-engine-test-vectors', desc: 'Golden entry, gamelog, and settlement fixtures for integrators.' }
];

export function OpenSource() {
  return (
    <Section id="developers" aria-labelledby="developers-title">
      <header className="mb-10 flex flex-col gap-5 md:mb-12 md:flex-row md:items-end md:justify-between">
        <div>
          <span className="font-mono text-[11px] uppercase tracking-[0.18em] text-accent-text">
            For developers
          </span>
          <h2
            id="developers-title"
            className="mt-3 max-w-[18ch] text-[clamp(30px,4vw,48px)] font-semibold leading-[1.02] tracking-[-0.035em] text-foreground"
          >
            We open-sourced parts of Buzzr.
          </h2>
        </div>
        <a
          href={NPM_SEARCH}
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex w-fit shrink-0 items-center gap-2 rounded-control border border-border px-4 py-2.5 text-[14px] font-medium tracking-[-0.01em] text-foreground transition-[border-color,background-color] duration-200 ease-out hover:border-accent/40 hover:bg-subtle focus-visible:outline-none focus-visible:shadow-[var(--shadow-focus)]"
        >
          View all on npm
          <span aria-hidden>&rarr;</span>
        </a>
      </header>

      <ul className="grid gap-px overflow-hidden rounded-card border border-border bg-border">
        {PACKAGES.map((pkg) => (
          <li key={pkg.name}>
            <a
              href={`https://www.npmjs.com/package/${pkg.name}`}
              target="_blank"
              rel="noopener noreferrer"
              className="group flex flex-col gap-1.5 bg-surface px-5 py-4 transition-colors duration-200 hover:bg-subtle focus-visible:bg-subtle focus-visible:outline-none sm:flex-row sm:items-center sm:gap-5"
            >
              <code className="shrink-0 font-mono text-[13px] tracking-[-0.01em] text-foreground sm:w-[268px]">
                {pkg.name}
              </code>
              <span className="flex-1 text-[14px] leading-[1.45] tracking-[-0.01em] text-muted">
                {pkg.desc}
              </span>
              <span
                aria-hidden
                className="hidden shrink-0 text-whisper transition-[color,transform] duration-200 group-hover:translate-x-0.5 group-hover:text-accent-text sm:block"
              >
                &rarr;
              </span>
            </a>
          </li>
        ))}
      </ul>
    </Section>
  );
}
