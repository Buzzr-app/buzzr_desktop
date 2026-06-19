import Link from 'next/link';
import { DeviceFrame } from '@/components/ui/DeviceFrame';
import { APP_STORE_URL, DISCORD_URL } from '@/src/lib/constants';

export function Hero() {
  return (
    <section
      id="top"
      aria-labelledby="hero-title"
      className="relative flex min-h-[100dvh] w-full items-center overflow-hidden px-6 pt-32 pb-20 md:px-10 md:pt-40"
    >
      <div className="mx-auto w-full max-w-[1320px]">
        <span className="score-mono block text-[12px] uppercase tracking-[0.24em] text-muted">
          Letterboxd for sports, 47 leagues across 12 sports
        </span>

        <h1
          id="hero-title"
          className="mt-5 text-crush text-[clamp(54px,13vw,150px)] font-black text-foreground"
        >
          Rate the game.<br />
          <span className="text-foreground/70">Not the score.</span>
        </h1>

        <div className="mt-10 grid items-end gap-12 lg:grid-cols-[1.05fr_auto]">
          <div>
            <p className="max-w-[460px] text-[16px] font-medium leading-[1.55] tracking-[-0.01em] text-foreground/80">
              Any sport, any league. Score games by entertainment, not the final whistle. Scroll, rate, and follow the moments that actually mattered.
            </p>

            <div className="mt-8 flex flex-wrap items-center gap-3">
              <Link
                href={APP_STORE_URL}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center bg-foreground px-6 py-3.5 text-[13px] font-bold uppercase tracking-[0.04em] text-canvas transition-[colors,box-shadow,transform] hover:bg-accent hover:text-on-accent hover:shadow-[0_0_0_3px_rgba(0,230,118,0.25)] active:scale-[0.98]"
              >
                Get the app
              </Link>
              <Link
                href={DISCORD_URL}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center border border-white/30 px-6 py-3.5 text-[13px] font-bold uppercase tracking-[0.04em] text-foreground transition-colors hover:border-accent hover:text-accent active:scale-[0.98]"
              >
                Join the Discord
              </Link>
            </div>

            {/* Live Buzz card — real game, brand-green fill, dominant score */}
            <div className="mt-10 max-w-[420px] border border-white/10 bg-white/[0.02] p-4">
              <div className="flex items-start justify-between gap-4">
                <div>
                  <span className="score-mono inline-flex items-center gap-2 text-[11px] uppercase tracking-[0.18em] text-foreground/80">
                    <span className="h-[7px] w-[7px] rounded-full bg-live animate-buzz-pulse" aria-hidden />
                    Live Buzz
                  </span>
                  <p className="mt-1.5 text-[13px] font-semibold tracking-[-0.01em] text-foreground">
                    Thunder 112, Nuggets 109
                  </p>
                </div>
                <span className="score-mono text-[36px] font-extrabold leading-none text-foreground">
                  9.2
                </span>
              </div>
              <div className="relative mt-3 h-[6px] w-full bg-white/[0.08]">
                <div
                  className="absolute inset-y-0 left-0 w-[92%] bg-accent"
                  style={{ boxShadow: '0 0 10px rgba(0,230,118,0.55)' }}
                />
              </div>
            </div>
          </div>

          {/* Real product — the credibility anchor the page was missing */}
          <div className="relative mx-auto hidden h-[470px] w-[340px] shrink-0 sm:block">
            <div
              aria-hidden
              className="absolute left-1/2 top-1/2 h-[320px] w-[320px] -translate-x-1/2 -translate-y-1/2 rounded-full blur-2xl"
              style={{ background: 'radial-gradient(circle, rgba(0,230,118,0.16), transparent 70%)' }}
            />
            <div className="absolute right-0 top-9 w-[180px] rotate-[5deg]">
              <DeviceFrame src="/screenshot-rate.png" alt="Rating a live game in the Buzzr app" />
            </div>
            <div className="absolute left-0 top-0 w-[214px] -rotate-[3deg]">
              <DeviceFrame src="/screenshot-home.png" alt="The Buzzr home feed" priority />
            </div>
          </div>
        </div>
      </div>

      <div className="score-mono absolute bottom-6 left-6 flex items-center gap-2 text-[12px] uppercase tracking-[0.2em] text-foreground/70 md:left-10">
        <span>Scroll to explore</span>
        <span aria-hidden className="text-[14px]">↓</span>
      </div>
    </section>
  );
}
