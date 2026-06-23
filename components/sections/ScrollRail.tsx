import { ScanLine, CircleCheckBig, TrendingUp, type LucideIcon } from 'lucide-react';
import { Section } from '@/components/ui/Section';
import { PhoneShowcase } from '@/components/ui/PhoneShowcase';
import { BetsScreen } from '@/components/ui/BetsScreen';
import { FluidBackground } from '@/components/ui/FluidBackground';
import { MoneyField } from '@/components/ui/MoneyField';
import { ScrollReveal } from '@/components/ScrollReveal';

// Fluid preset: Cellular - MINT - ASCII - pixelate 9 - zoom 4 - warp 9 - speed 3 - grain 0.25 - seed 80
const FLUID_BETS_SRC =
  'https://fluid.krackeddevs.com/#p=3,4,9,0.25,9,5,1,5,80.23,0.8,0.85,1,0,1,2,2,0,0,0,0,0,0,0,0,0.19';

const BETS_STEPS: ReadonlyArray<{ icon: LucideIcon; title: string; body: string }> = [
  { icon: ScanLine, title: 'Add', body: 'Snap a DFS slip from PrizePicks, Underdog, or Sleeper, or enter picks by hand.' },
  { icon: CircleCheckBig, title: 'Grade', body: 'Every leg auto-grades against live box scores as the games finish.' },
  { icon: TrendingUp, title: 'Compare', body: 'ROI, streaks, and history roll up so your crew sees who actually hits.' }
];

export function ScrollRail() {
  return (
    <Section id="rail" aria-labelledby="rail-title" className="overflow-hidden">
      {/* Full-bleed live Fluid field (Cellular/ASCII/MINT) spanning the whole
          section, with a scrim that keeps the left-side copy readable and feathers
          the top/bottom into the neighbouring sections. */}
      <div className="pointer-events-none absolute inset-y-0 left-1/2 z-0 w-screen -translate-x-1/2">
        <FluidBackground src={FLUID_BETS_SRC} className="absolute inset-0 opacity-90" />
        <div
          aria-hidden
          className="absolute inset-0 bg-[linear-gradient(90deg,var(--color-canvas)_0%,color-mix(in_srgb,var(--color-canvas)_72%,transparent)_30%,transparent_52%,transparent_84%,color-mix(in_srgb,var(--color-canvas)_60%,transparent)_100%)]"
        />
        <div
          aria-hidden
          className="absolute inset-0 bg-[linear-gradient(180deg,var(--color-canvas)_0%,transparent_20%,transparent_80%,var(--color-canvas)_100%)]"
        />
      </div>

      {/* Cash-blower: bills wrap the phone with real depth - the back plane
          streams behind the device, the front plane passes over it. */}
      <MoneyField layer="back" className="absolute inset-0 z-[1]" />

      <div className="relative z-10 grid items-center gap-10 lg:grid-cols-[1.02fr_0.98fr] lg:gap-16">
        <div>
          <ScrollReveal>
            <h2
              id="rail-title"
              className="max-w-[14ch] text-[clamp(34px,4.8vw,56px)] font-semibold leading-[0.98] tracking-[-0.04em] text-foreground"
            >
              Buzzr Bets tracks the slips, not the book.
            </h2>
          </ScrollReveal>

          <div className="mt-8 grid gap-3 sm:grid-cols-3 lg:grid-cols-1">
            {BETS_STEPS.map(({ icon: Icon, title, body }, index) => (
              <ScrollReveal key={title} delay={(index + 1) as 1 | 2 | 3}>
                <div className="group rounded-card border border-border bg-surface p-4 shadow-[var(--shadow-card)] transition-[border-color,background-color,transform] duration-200 [transition-timing-function:cubic-bezier(0.23,1,0.32,1)] active:scale-[0.985] [@media(hover:hover)]:hover:-translate-y-0.5 [@media(hover:hover)]:hover:border-accent/30 [@media(hover:hover)]:hover:bg-subtle/60">
                  <div className="flex items-center justify-between">
                    <span className="grid size-9 place-items-center rounded-[11px] border border-accent/20 bg-accent/[0.08] text-accent-text transition-colors duration-200 [@media(hover:hover)]:group-hover:border-accent/35 [@media(hover:hover)]:group-hover:bg-accent/15">
                      <Icon size={17} strokeWidth={2} aria-hidden />
                    </span>
                    <span className="font-mono text-[11px] uppercase tracking-[0.14em] text-muted/70 transition-colors duration-200 [@media(hover:hover)]:group-hover:text-accent-text">
                      {String(index + 1).padStart(2, '0')}
                    </span>
                  </div>
                  <h3 className="mt-3.5 text-[18px] font-semibold leading-[1.25] tracking-[-0.025em] text-foreground">
                    {title}
                  </h3>
                  <p className="mt-1 text-[14px] leading-[1.45] tracking-[-0.01em] text-muted">{body}</p>
                </div>
              </ScrollReveal>
            ))}
          </div>
        </div>

        <ScrollReveal delay={2} className="mx-auto w-full max-w-[460px]">
          <PhoneShowcase size="standard" className="mx-auto">
            <BetsScreen />
          </PhoneShowcase>
        </ScrollReveal>
      </div>

      {/* Front plane of the cash-blower - paints over the phone (z-10). */}
      <MoneyField layer="front" className="absolute inset-0 z-20" />
    </Section>
  );
}
