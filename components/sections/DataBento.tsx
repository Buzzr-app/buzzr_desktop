'use client';

import { useEffect, useRef, useState } from 'react';
import { Section } from '@/components/ui/Section';
import { PhoneShowcase } from '@/components/ui/PhoneShowcase';
import { LEAGUE_COUNT } from '@/src/lib/constants';

type DashboardStep = {
  body: string;
  detail: string;
  label: string;
  progress: number;
  title: string;
  value: string;
};

const DASHBOARD_STEPS: readonly DashboardStep[] = [
  {
    label: 'Live score',
    title: 'The game state stays attached.',
    body: 'Score, clock, league, and matchup context stay in one surface.',
    value: '94-90',
    detail: 'Q4 2:16',
    progress: 74
  },
  {
    label: 'Buzzr Score',
    title: 'One read on how alive it feels.',
    body: 'Stakes, stars, rivalry, chaos, and crowd heat collapse into a fast signal.',
    value: '7.9',
    detail: 'GOOD',
    progress: 79
  },
  {
    label: 'Win probability',
    title: 'Momentum has a shape.',
    body: 'Fans see the swing without leaving the social surface.',
    value: '75%',
    detail: 'OKC edge',
    progress: 75
  },
  {
    label: 'Crowd signal',
    title: 'The room changes the read.',
    body: 'Friends, crews, ratings, and replies turn data into a social pulse.',
    value: '51%',
    detail: 'fan lean',
    progress: 51
  },
  {
    label: 'Standings',
    title: 'Every league has a home.',
    body: `${LEAGUE_COUNT} leagues with verified marks where local assets exist.`,
    value: String(LEAGUE_COUNT),
    detail: 'leagues',
    progress: 88
  }
];

export function DataBento() {
  const [activeIndex, setActiveIndex] = useState(0);
  const itemRefs = useRef<Array<HTMLLIElement | null>>([]);

  useEffect(() => {
    const reduce = window.matchMedia('(prefers-reduced-motion: reduce)');
    if (reduce.matches) return;

    const observer = new IntersectionObserver(
      (entries) => {
        const visible = entries
          .filter((entry) => entry.isIntersecting)
          .sort((a, b) => b.intersectionRatio - a.intersectionRatio);
        const index = Number(visible[0]?.target.getAttribute('data-step-index'));
        if (Number.isFinite(index)) {
          setActiveIndex(index);
        }
      },
      {
        rootMargin: '-34% 0px -42% 0px',
        threshold: [0.2, 0.45, 0.7]
      }
    );

    itemRefs.current.forEach((item) => {
      if (item) observer.observe(item);
    });

    return () => {
      observer.disconnect();
    };
  }, []);

  const active = DASHBOARD_STEPS[activeIndex] ?? DASHBOARD_STEPS[0];

  return (
    <Section id="data" aria-labelledby="data-title" className="max-w-none px-0 py-0">
      <div className="mx-auto max-w-[1200px] px-6 py-20 md:py-28">
        <header className="mx-auto mb-16 max-w-[700px] text-center md:mb-20">
          <span className="font-mono text-[11px] uppercase tracking-[0.22em] text-accent-text">
            Live signal
          </span>
          <h2
            id="data-title"
            className="mt-4 text-[clamp(34px,4.8vw,58px)] font-semibold leading-[0.98] tracking-[-0.045em] text-foreground"
          >
            Dashboards that stay calm when games do not.
          </h2>
        </header>

        <div className="grid gap-12 lg:grid-cols-[0.96fr_1.04fr] lg:gap-16">
          <div className="lg:sticky lg:top-24 lg:flex lg:h-[calc(100vh-7rem)] lg:items-center">
            <div className="relative mx-auto grid w-full max-w-[520px] gap-5 rounded-xl border border-white/10 bg-surface p-4 shadow-[0_32px_100px_-58px_rgba(0,194,100,0.6)]">
              <div
                aria-hidden
                className="pointer-events-none absolute inset-x-0 -top-px h-px bg-gradient-to-r from-transparent via-white/15 to-transparent"
              />
              <div className="grid items-center gap-5 sm:grid-cols-[0.82fr_1fr] lg:grid-cols-1 xl:grid-cols-[0.82fr_1fr]">
                <PhoneShowcase
                  src="/app-screens/dashboard.png"
                  alt="Buzzr dashboard screen with team and league context"
                  priority
                  aura
                  size="compact"
                  className="mx-auto"
                />
                <DashboardSignal step={active} />
              </div>
            </div>
          </div>

          <ol className="grid gap-5 lg:gap-8">
            {DASHBOARD_STEPS.map((step, index) => (
              <li
                key={step.label}
                data-step-index={index}
                ref={(node) => {
                  itemRefs.current[index] = node;
                }}
                className="lg:flex lg:min-h-[42vh] lg:items-center"
              >
                <DashboardStepCard
                  step={step}
                  index={index}
                  active={index === activeIndex}
                />
              </li>
            ))}
          </ol>
        </div>
      </div>
    </Section>
  );
}

function DashboardSignal({ step }: { step: DashboardStep }) {
  return (
    <div className="rounded-xl border border-white/10 bg-white/[0.045] p-5 text-foreground shadow-[inset_0_1px_0_rgba(255,255,255,0.08)]">
      <div className="flex items-center justify-between gap-4">
        <span className="font-mono text-[11px] uppercase tracking-[0.18em] text-whisper">
          {step.label}
        </span>
        <span className="inline-flex items-center gap-1.5 rounded-full bg-accent/[0.14] px-2.5 py-1 font-mono text-[10px] uppercase tracking-[0.14em] text-accent-text">
          <span
            aria-hidden
            className="size-1.5 rounded-full bg-accent-text motion-safe:animate-buzz-pulse"
          />
          Live
        </span>
      </div>
      <div
        key={step.label}
        className="mt-6 flex items-end justify-between gap-4 motion-safe:animate-fade-in"
      >
        <span className="score-mono text-[clamp(42px,7vw,72px)] leading-none tracking-[-0.05em] text-accent-text">
          {step.value}
        </span>
        <span className="pb-2 font-mono text-[11px] uppercase tracking-[0.16em] text-whisper">
          {step.detail}
        </span>
      </div>
      <div className="mt-6 h-2 overflow-hidden rounded-full bg-white/[0.1]">
        <div
          aria-hidden
          className="h-full rounded-full bg-accent transition-transform duration-500 [transition-timing-function:cubic-bezier(0.23,1,0.32,1)] motion-reduce:transition-none"
          style={{ transform: `scaleX(${step.progress / 100})`, transformOrigin: 'left' }}
        />
      </div>
    </div>
  );
}

function DashboardStepCard({
  active,
  index,
  step
}: {
  active: boolean;
  index: number;
  step: DashboardStep;
}) {
  return (
    <article
      aria-current={active ? 'true' : undefined}
      className={`group relative w-full overflow-hidden rounded-xl border p-6 shadow-[var(--shadow-card)] transition-[border-color,background-color,transform,box-shadow] duration-300 [transition-timing-function:cubic-bezier(0.23,1,0.32,1)] motion-safe:active:scale-[0.99] ${
        active
          ? 'border-accent/45 bg-subtle'
          : 'border-border bg-surface motion-safe:[@media(hover:hover)]:hover:border-accent/30 motion-safe:[@media(hover:hover)]:hover:bg-subtle/55'
      }`}
    >
      <span
        aria-hidden
        className={`absolute inset-y-5 left-0 w-px rounded-full bg-accent transition-opacity duration-300 [transition-timing-function:cubic-bezier(0.23,1,0.32,1)] ${
          active ? 'opacity-100' : 'opacity-0'
        }`}
      />
      <span className="flex items-center gap-2.5 font-mono text-[11px] uppercase tracking-[0.16em]">
        <span className={active ? 'text-accent-text' : 'text-whisper'}>
          {String(index + 1).padStart(2, '0')}
        </span>
        <span aria-hidden className="h-px w-4 bg-border" />
        <span className={active ? 'text-foreground/80' : 'text-muted'}>{step.label}</span>
      </span>
      <h3 className="mt-4 max-w-[18ch] text-[clamp(25px,3vw,36px)] font-semibold leading-[1.04] tracking-[-0.038em] text-foreground">
        {step.title}
      </h3>
      <p className="mt-3 max-w-[38ch] text-[15px] leading-[1.55] tracking-[-0.015em] text-muted">
        {step.body}
      </p>
    </article>
  );
}
