'use client';

import Image from 'next/image';
import { useEffect, useState } from 'react';
import { useViewportGate } from '@/components/hooks/useViewportGate';
import { cn } from '@/components/utils';

type DashboardWidgetStageProps = {
  className?: string;
  compact?: boolean;
  controls?: boolean;
};

type DashboardWidget = {
  label: string;
  tone: 'accent' | 'cool' | 'gold' | 'neutral';
  value: string;
};

type DashboardState = {
  code: string;
  eyebrow: string;
  key: string;
  logoSrc?: string;
  meta: string;
  signal: string;
  team: string;
  widgets: readonly DashboardWidget[];
};

const DASHBOARD_STATES: readonly DashboardState[] = [
  {
    key: 'team',
    code: 'DET',
    eyebrow: 'Team board',
    logoSrc: '/logos/pistons.png',
    team: 'Detroit Pistons',
    meta: 'NBA · #4',
    signal: 'Updated now',
    widgets: [
      { label: 'Record', value: '25-14-1', tone: 'accent' },
      { label: 'Form', value: '4-5-1', tone: 'cool' },
      { label: 'Standings', value: '#4 East', tone: 'neutral' },
      { label: 'Players', value: '12 tracked', tone: 'gold' }
    ]
  },
  {
    key: 'standings',
    code: 'NYK',
    eyebrow: 'Standings pulse',
    logoSrc: '/logos/knicks.png',
    team: 'New York Knicks',
    meta: 'NBA · #3',
    signal: '+2 this week',
    widgets: [
      { label: 'Seed', value: '#3', tone: 'gold' },
      { label: 'Gap', value: '1.5 GB', tone: 'neutral' },
      { label: 'Home', value: '18-7', tone: 'accent' },
      { label: 'Away', value: '14-11', tone: 'cool' }
    ]
  },
  {
    key: 'rating',
    code: 'DAL',
    eyebrow: 'Rating signal',
    team: 'Dallas Mavericks',
    meta: 'Live · Q4',
    signal: 'Buzzr 8.6',
    widgets: [
      { label: 'Heat', value: '92%', tone: 'accent' },
      { label: 'Chaos', value: 'High', tone: 'gold' },
      { label: 'Friends', value: '18 in', tone: 'cool' },
      { label: 'Takes', value: '246', tone: 'neutral' }
    ]
  },
  {
    key: 'friends',
    code: 'BOS',
    eyebrow: 'Crew layer',
    team: 'Boston Celtics',
    meta: 'Friends · 9 active',
    signal: '4 new takes',
    widgets: [
      { label: 'Crew', value: 'Garden', tone: 'accent' },
      { label: 'Replies', value: '31', tone: 'cool' },
      { label: 'Saved', value: '7 clips', tone: 'gold' },
      { label: 'Mood', value: 'Loud', tone: 'neutral' }
    ]
  }
];

export function DashboardWidgetStage({
  className,
  compact = false,
  controls = true
}: DashboardWidgetStageProps) {
  const [stageRef, isVisible] = useViewportGate<HTMLDivElement>({
    rootMargin: '700px 0px'
  });
  const [activeIndex, setActiveIndex] = useState(0);
  const state = DASHBOARD_STATES[activeIndex];

  useEffect(() => {
    if (!isVisible) {
      return;
    }

    const reduce = window.matchMedia('(prefers-reduced-motion: reduce)');
    if (reduce.matches) {
      return;
    }

    const id = window.setInterval(() => {
      setActiveIndex((index) => (index + 1) % DASHBOARD_STATES.length);
    }, compact ? 2200 : 2800);

    return () => {
      window.clearInterval(id);
    };
  }, [compact, isVisible]);

  return (
    <div
      ref={stageRef}
      className={cn(
        'dashboard-widget-stage',
        compact && 'dashboard-widget-stage--compact',
        className
      )}
      data-dashboard-widget-stage
      data-state={state.key}
    >
      <div className="dashboard-widget-stage__header">
        <span className="dashboard-widget-stage__mark">
          {state.logoSrc ? (
            <Image
              src={state.logoSrc}
              alt=""
              width={48}
              height={48}
              className="size-full object-contain"
            />
          ) : (
            <span>{state.code}</span>
          )}
        </span>
        <span className="min-w-0 flex-1">
          <span className="dashboard-widget-stage__eyebrow">{state.eyebrow}</span>
          <span className="dashboard-widget-stage__team">{state.team}</span>
          <span className="dashboard-widget-stage__meta">{state.meta}</span>
        </span>
        <span className="dashboard-widget-stage__signal">{state.signal}</span>
      </div>

      <div key={state.key} className="dashboard-widget-stage__grid">
        {state.widgets.map((widget) => (
          <article
            key={`${state.key}-${widget.label}`}
            className="dashboard-widget-card"
            data-tone={widget.tone}
          >
            <span>{widget.label}</span>
            <strong>{widget.value}</strong>
          </article>
        ))}
      </div>

      <div className="dashboard-widget-stage__rail" aria-hidden>
        {['OKC', 'SAS', state.code, 'NYK', 'DET'].map((code, index) => (
          <span key={`${state.key}-${code}-${index}`} data-active={code === state.code}>
            {code}
          </span>
        ))}
      </div>

      {controls ? (
        <div className="dashboard-widget-stage__controls" aria-label="Dashboard views">
          {DASHBOARD_STATES.map((item, index) => (
            <button
              key={item.key}
              type="button"
              aria-pressed={index === activeIndex}
              onClick={() => setActiveIndex(index)}
            >
              {item.code}
            </button>
          ))}
        </div>
      ) : null}
    </div>
  );
}
