import { Section } from '@/components/ui/Section';
import { PhoneShowcase } from '@/components/ui/PhoneShowcase';
import { ScrollReveal } from '@/components/ScrollReveal';

const BETS_STEPS = [
  ['Add', 'Scan a DFS slip or enter picks by hand.'],
  ['Grade', 'Connect legs to supported game results.'],
  ['Compare', 'Track history with friends and crews.']
] as const;

export function ScrollRail() {
  return (
    <Section id="rail" aria-labelledby="rail-title">
      <div className="grid items-center gap-10 lg:grid-cols-[1.02fr_0.98fr] lg:gap-16">
        <div>
          <ScrollReveal>
            <h2
              id="rail-title"
              className="max-w-[14ch] text-[clamp(34px,4.8vw,56px)] font-semibold leading-[0.98] tracking-[-0.04em] text-foreground"
            >
              Buzzr Bets tracks the slips, not the book.
            </h2>
            <p className="mt-4 max-w-[40ch] text-[16px] leading-[1.5] tracking-[-0.02em] text-muted">
              DFS slip tracking for picks placed elsewhere. No sportsbook integrations.
            </p>
          </ScrollReveal>

          <div className="mt-8 grid gap-3 sm:grid-cols-3 lg:grid-cols-1">
            {BETS_STEPS.map(([title, body], index) => (
              <ScrollReveal key={title} delay={(index + 1) as 1 | 2 | 3}>
                <div className="group rounded-lg border border-border bg-surface p-4 shadow-[var(--shadow-card)] transition-[border-color,background-color,transform] duration-200 [transition-timing-function:cubic-bezier(0.23,1,0.32,1)] active:scale-[0.985] [@media(hover:hover)]:hover:-translate-y-0.5 [@media(hover:hover)]:hover:border-accent/30 [@media(hover:hover)]:hover:bg-subtle/60">
                  <span className="font-mono text-[11px] uppercase tracking-[0.14em] text-muted transition-colors duration-200 [@media(hover:hover)]:group-hover:text-accent-text">
                    {String(index + 1).padStart(2, '0')}
                  </span>
                  <h3 className="mt-3 text-[18px] font-semibold leading-[1.25] tracking-[-0.025em] text-foreground">
                    {title}
                  </h3>
                  <p className="mt-1 text-[14px] leading-[1.45] tracking-[-0.01em] text-muted">{body}</p>
                </div>
              </ScrollReveal>
            ))}
          </div>
        </div>

        <ScrollReveal delay={2} className="mx-auto w-full max-w-[460px]">
          <div className="relative">
            <PhoneShowcase
              src="/app-screens/bets.png"
              alt="Buzzr Bets game context and rating screen"
              aura
              size="standard"
              className="mx-auto"
            />
            <div className="absolute bottom-10 left-4 right-4 rounded-lg border border-white/10 bg-black/72 p-4 text-white backdrop-blur-md">
              <div className="flex items-center justify-between gap-4">
                <span className="font-mono text-[11px] uppercase tracking-[0.16em] text-white/50">
                  Slip status
                </span>
                <span className="rounded-full bg-accent px-2 py-1 font-mono text-[10px] uppercase tracking-[0.12em] text-canvas">
                  Tracking
                </span>
              </div>
              <p className="mt-3 text-[22px] font-semibold leading-[1.08] tracking-[-0.03em]">
                Picks stay with the game context.
              </p>
            </div>
          </div>
        </ScrollReveal>
      </div>
    </Section>
  );
}
