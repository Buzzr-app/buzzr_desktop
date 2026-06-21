import Link from 'next/link';
import { ScrollClayPhone } from '@/components/ui/ScrollClayPhone';
import { MagneticButton } from '@/components/ui/MagneticButton';
import { APP_STORE_URL, DISCORD_URL, LEAGUE_COUNT } from '@/src/lib/constants';

export function Hero() {
  return (
    <section
      id="top"
      aria-labelledby="hero-title"
      className="relative flex min-h-[92dvh] w-full items-center overflow-hidden px-6 pt-32 pb-24 md:px-10 md:pt-40"
    >
      <div className="relative mx-auto w-full max-w-[1240px]">
        <span className="block animate-fade-in-up font-mono text-[12px] uppercase tracking-[0.14em] text-muted">
          Letterboxd for sports · {LEAGUE_COUNT} leagues, 12 sports
        </span>

        <h1
          id="hero-title"
          className="mt-6 max-w-[16ch] animate-fade-in-up stagger-1 text-[clamp(40px,8vw,72px)] font-semibold leading-[1.04] tracking-[-0.032em] text-foreground"
        >
          Rate the game.{' '}
          <span className="text-muted">Not the score.</span>
        </h1>

        <div className="mt-10 grid items-end gap-12 lg:grid-cols-[1.05fr_auto]">
          <div>
            <p className="max-w-[500px] animate-fade-in-up stagger-2 text-[17px] leading-[1.6] tracking-[-0.011em] text-muted">
              Every live game gets a 1 to 10 for how good it actually was to watch. Swipe through the night, rate what hit, and stop sitting through blowouts on faith.
            </p>

            <div className="mt-9 flex animate-fade-in-up stagger-3 flex-wrap items-center gap-3">
              <MagneticButton
                href={APP_STORE_URL}
                external
                className="inline-flex items-center rounded-button bg-accent px-5 py-3 text-[15px] font-medium tracking-[-0.01em] text-on-accent shadow-[var(--shadow-card)] hover:bg-accent-dim focus-visible:outline-none focus-visible:shadow-[var(--shadow-focus)]"
              >
                Get the app<span className="sr-only"> (opens in new tab)</span>
              </MagneticButton>
              <Link
                href={DISCORD_URL}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center rounded-button border border-border bg-surface px-5 py-3 text-[15px] font-medium tracking-[-0.01em] text-foreground transition-[background-color,border-color,transform] duration-200 ease-out hover:-translate-y-0.5 hover:bg-subtle active:translate-y-0 focus-visible:outline-none focus-visible:shadow-[var(--shadow-focus)]"
              >
                Join the Discord<span className="sr-only"> (opens in new tab)</span>
              </Link>
            </div>

            {/* Live Buzz card — real game, brand-green fill, dominant score */}
            <div className="mt-12 max-w-[420px] animate-fade-in-up stagger-4 rounded-callout border border-border bg-surface p-5 shadow-[var(--shadow-card)]">
              <div className="flex items-start justify-between gap-4">
                <div>
                  <span className="inline-flex items-center gap-2 font-mono text-[11px] uppercase tracking-[0.12em] text-muted">
                    <span className="h-[7px] w-[7px] rounded-full bg-live animate-buzz-pulse" aria-hidden />
                    Live Buzz
                  </span>
                  <p className="mt-2 text-[14px] font-medium tracking-[-0.011em] text-foreground">
                    Thunder 112, Nuggets 109
                  </p>
                </div>
                <span className="font-mono text-[34px] font-semibold leading-none tracking-[-0.02em] text-foreground tabular-nums">
                  9.2
                </span>
              </div>
              <div className="relative mt-4 h-[6px] w-full overflow-hidden rounded-full bg-subtle">
                <div className="absolute inset-y-0 left-0 w-[92%] rounded-full bg-accent" />
              </div>
            </div>
          </div>

        </div>

        {/* Real product — a huge clay iPhone that turns on scroll */}
        <ScrollClayPhone className="pointer-events-none absolute right-0 top-1/2 hidden -translate-y-1/2 animate-fade-in-up stagger-3 lg:block" />
      </div>

      <div className="absolute bottom-7 left-6 flex animate-fade-in-up stagger-5 items-center gap-2 font-mono text-[11px] uppercase tracking-[0.14em] text-whisper md:left-10">
        <span>Scroll to explore</span>
        <span aria-hidden>↓</span>
      </div>
    </section>
  );
}
