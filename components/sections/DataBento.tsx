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
      <div className="mx-auto max-w-[1200px] px-6 py-16 md:py-20">
        <header className="mx-auto mb-12 max-w-[680px] text-center">
          <h2
            id="data-title"
            className="text-[clamp(34px,4.8vw,58px)] font-semibold leading-[0.98] tracking-[-0.04em] text-foreground"
          >
            Dashboards that stay calm when games do not.
          </h2>
        </header>

        <div className="grid gap-10 lg:grid-cols-[0.96fr_1.04fr] lg:gap-14">
          <div className="lg:sticky lg:top-24 lg:flex lg:h-[calc(100vh-7rem)] lg:items-center">
            <div className="relative mx-auto grid w-full max-w-[520px] gap-5 rounded-lg border border-white/10 bg-[#10161d] p-4 shadow-[0_32px_100px_-58px_rgba(0,194,100,0.95)]">
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
    <div className="rounded-lg border border-white/10 bg-white/[0.045] p-5 text-white shadow-[inset_0_1px_0_rgba(255,255,255,0.08)]">
      <div className="flex items-center justify-between gap-4">
        <span className="font-mono text-[11px] uppercase tracking-[0.16em] text-white/46">
          {step.label}
        </span>
        <span className="rounded-full bg-[#00c264]/18 px-2 py-1 font-mono text-[10px] uppercase tracking-[0.12em] text-[#34d399]">
          Live
        </span>
      </div>
      <div className="mt-6 flex items-end justify-between gap-4">
        <span className="score-mono text-[clamp(42px,7vw,72px)] leading-none tracking-[-0.05em] text-[#34d399]">
          {step.value}
        </span>
        <span className="pb-2 font-mono text-[11px] uppercase tracking-[0.14em] text-white/46">
          {step.detail}
        </span>
      </div>
      <div className="mt-6 h-2 overflow-hidden rounded-full bg-white/12">
        <div
          aria-hidden
          className="h-full rounded-full bg-[#00c264] transition-transform duration-200 ease-out"
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
      className={`w-full rounded-lg border p-5 shadow-[var(--shadow-card)] transition-[border-color,background-color,transform] duration-200 ease-out active:scale-[0.995] ${
        active
          ? 'border-accent/45 bg-subtle'
          : 'border-border bg-surface hover:border-accent/30 hover:bg-subtle/55'
      }`}
    >
      <span className="font-mono text-[11px] uppercase tracking-[0.14em] text-muted">
        {String(index + 1).padStart(2, '0')} · {step.label}
      </span>
      <h3 className="mt-4 max-w-[18ch] text-[clamp(25px,3vw,36px)] font-semibold leading-[1.04] tracking-[-0.035em] text-foreground">
        {step.title}
      </h3>
      <p className="mt-3 max-w-[38ch] text-[15px] leading-[1.5] tracking-[-0.015em] text-muted">
        {step.body}
      </p>
    </article>
  );
}
