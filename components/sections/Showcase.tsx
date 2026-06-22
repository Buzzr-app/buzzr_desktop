'use client';

import { useEffect, useRef, useState } from 'react';
import { Section } from '@/components/ui/Section';
import { PhoneShowcase } from '@/components/ui/PhoneShowcase';
import { cn } from '@/components/utils';

type Screen = {
  src: string;
  alt: string;
};

const SCREENS: Screen[] = [
  { src: '/app-screens/friends-chat.png', alt: 'Buzzr friends and chat activity' },
  { src: '/app-screens/feed.png', alt: 'Buzzr AI feed screen' },
  { src: '/app-screens/rate.png', alt: 'Buzzr game context screen' }
];

// Stagger the three phones on entrance using the shared stagger-* delay scale.
const REVEAL_DELAY = ['', 'stagger-1', 'stagger-2'];

export function Showcase() {
  const sectionRef = useRef<HTMLElement>(null);
  const [revealed, setRevealed] = useState(false);

  useEffect(() => {
    const node = sectionRef.current;
    if (!node) return;

    // Reduced motion: skip the scroll cue, show everything immediately.
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
      setRevealed(true);
      return;
    }

    const observer = new IntersectionObserver(
      (entries) => {
        if (entries.some((entry) => entry.isIntersecting)) {
          setRevealed(true);
          observer.disconnect();
        }
      },
      { rootMargin: '0px 0px -18% 0px', threshold: 0.2 }
    );

    observer.observe(node);
    return () => observer.disconnect();
  }, []);

  return (
    <Section ref={sectionRef} id="showcase" aria-labelledby="showcase-title">
      <header className="mb-14 max-w-[48ch] md:mb-16">
        <h2
          id="showcase-title"
          className={cn(
            'text-[clamp(34px,4.8vw,56px)] font-semibold leading-[0.98] tracking-[-0.04em] text-foreground',
            'opacity-0-init',
            revealed && 'animate-fade-in-up in-view'
          )}
        >
          Friends and chat stay with the game.
        </h2>
        <p
          className={cn(
            'mt-4 max-w-[34ch] text-[16px] leading-[1.5] tracking-[-0.02em] text-muted',
            'opacity-0-init',
            revealed && 'animate-fade-in-up in-view stagger-1'
          )}
        >
          Matchups, takes, replies, and DMs stay attached to the moment.
        </p>
      </header>

      <div className="mx-auto grid max-w-[900px] grid-cols-1 gap-x-6 gap-y-10 sm:grid-cols-3 sm:gap-x-8 sm:gap-y-0">
        {SCREENS.map((s, i) => (
          <PhoneShowcase
            key={s.src}
            src={s.src}
            alt={s.alt}
            priority={i === 0}
            size="medium"
            className={cn(
              'mx-auto opacity-0-init',
              revealed && cn('animate-fade-in-up in-view', REVEAL_DELAY[i])
            )}
          />
        ))}
      </div>
    </Section>
  );
}
