import Link from 'next/link';
import { Section } from '@/components/ui/Section';

const RELEASE_NOTES = [
  'Scroll blends games, recaps, ratings, and friend takes into one faster feed.',
  'Dashboards now frame leagues as personal command centers.',
  'Buzzr Bets is clearly tracking for DFS slips placed elsewhere.'
] as const;

export function ChangelogPreview() {
  return (
    <Section id="changelog-preview" aria-labelledby="changelog-preview-title">
      <div className="grid gap-8 rounded-lg border border-border bg-surface p-5 shadow-[var(--shadow-card)] md:grid-cols-[0.9fr_1.1fr] md:p-7">
        <div>
          <span className="font-mono text-[11px] uppercase tracking-[0.14em] text-muted">
            App changelog
          </span>
          <h2
            id="changelog-preview-title"
            className="mt-3 max-w-[14ch] text-[clamp(30px,4vw,44px)] font-semibold leading-[1] tracking-[-0.035em] text-foreground"
          >
            What changed in Buzzr 2.0.
          </h2>
        </div>

        <div className="flex flex-col justify-between gap-6">
          <ul className="grid gap-3">
            {RELEASE_NOTES.map((note) => (
              <li key={note} className="flex gap-3 text-[15px] leading-[1.5] tracking-[-0.015em] text-muted">
                <span aria-hidden className="mt-[0.65em] h-1.5 w-1.5 shrink-0 rounded-full bg-accent" />
                <span>{note}</span>
              </li>
            ))}
          </ul>

          <Link
            href="/changelog"
            className="inline-flex w-fit min-h-[44px] items-center rounded-button border border-border px-4 py-2.5 text-[14px] font-medium tracking-[-0.01em] text-foreground transition-[border-color,background-color] duration-200 ease-out hover:border-accent/40 hover:bg-subtle focus-visible:outline-none focus-visible:shadow-[var(--shadow-focus)]"
          >
            Read the changelog
          </Link>
        </div>
      </div>
    </Section>
  );
}
