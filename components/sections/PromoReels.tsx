'use client';

import { useEffect, useRef, useState } from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { Section } from '@/components/ui/Section';
import { PhoneShowcase } from '@/components/ui/PhoneShowcase';
import { LazyPhoneVideo } from '@/components/ui/LazyPhoneVideo';
import { cn } from '@/components/utils';

type PromoReel = {
  poster: string;
  src: string;
  title: string;
};

const REELS: readonly PromoReel[] = [
  {
    title: 'Rate Games While They Are Live',
    src: '/promo/ios-rate-game-2x.mp4',
    poster: '/app-screens/ios-rate-saved.png'
  },
  {
    title: 'Build Your Personal Sports Dashboard',
    src: '/promo/ios-dashboard-2x.mp4',
    poster: '/app-screens/ios-dashboard-created.png'
  },
  {
    title: 'Scroll The Live Fan Feed',
    src: '/promo/ios-feed-2x.mp4',
    poster: '/app-screens/ios-feed.png'
  },
  {
    title: 'Browse Every League In One Place',
    src: '/promo/ios-leagues-2x.mp4',
    poster: '/app-screens/ios-leagues.png'
  },
  {
    title: 'Follow Fans And Grow Crews',
    src: '/promo/ios-follow-2x.mp4',
    poster: '/app-screens/ios-profile-following.png'
  },
  {
    title: 'Message Takes Before They Cool',
    src: '/promo/ios-message-2x.mp4',
    poster: '/app-screens/ios-message-sent.png'
  }
];

export function PromoReels() {
  const scrollerRef = useRef<HTMLDivElement>(null);
  const activeIndexRef = useRef(0);
  const scrollRafRef = useRef<number | null>(null);
  const [activeIndex, setActiveIndex] = useState(0);

  const commitActiveIndex = (index: number) => {
    if (activeIndexRef.current === index) {
      return;
    }

    activeIndexRef.current = index;
    setActiveIndex(index);
  };

  const scrollToCard = (index: number) => {
    const nextIndex = (index + REELS.length) % REELS.length;
    const scroller = scrollerRef.current;

    commitActiveIndex(nextIndex);
    scroller
      ?.querySelector<HTMLElement>(`[data-carousel-index="${nextIndex}"]`)
      ?.scrollIntoView({ behavior: 'smooth', block: 'nearest', inline: 'start' });
  };

  const syncActiveCard = () => {
    if (scrollRafRef.current !== null) {
      return;
    }

    scrollRafRef.current = window.requestAnimationFrame(() => {
      scrollRafRef.current = null;
      syncActiveCardNow();
    });
  };

  const syncActiveCardNow = () => {
    const scroller = scrollerRef.current;

    if (!scroller) {
      return;
    }

    const cards = Array.from(
      scroller.querySelectorAll<HTMLElement>('[data-carousel-index]')
    );
    const scrollerCenter =
      scroller.getBoundingClientRect().left + scroller.clientWidth / 2;
    const closest = cards.reduce(
      (best, card) => {
        const rect = card.getBoundingClientRect();
        const distance = Math.abs(rect.left + rect.width / 2 - scrollerCenter);
        const index = Number(card.dataset.carouselIndex ?? 0);

        return distance < best.distance ? { distance, index } : best;
      },
      { distance: Number.POSITIVE_INFINITY, index: 0 }
    );

    commitActiveIndex(closest.index);
  };

  useEffect(() => {
    return () => {
      if (scrollRafRef.current !== null) {
        window.cancelAnimationFrame(scrollRafRef.current);
      }
    };
  }, []);

  return (
    <Section
      id="promo"
      aria-labelledby="promo-title"
      className="max-w-[1480px] py-16 md:py-24"
    >
      <header className="mx-auto flex max-w-[820px] flex-col items-center text-center">
        <h2
          id="promo-title"
          className="font-hero inline-flex items-center justify-center gap-3 text-balance text-[clamp(38px,5vw,68px)] font-extrabold leading-none text-foreground"
        >
          <BeeIcon />
          <span>Stay Buzzed In</span>
        </h2>
      </header>

      <div className="mt-9 flex items-center justify-end gap-2">
        <button
          type="button"
          aria-label="Previous Buzzr motion card"
          onClick={() => scrollToCard(activeIndex - 1)}
          className="grid size-10 place-items-center rounded-full border border-white/[0.1] bg-white/[0.055] text-white/82 transition hover:border-accent/45 hover:bg-accent/12 hover:text-accent-text focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent"
        >
          <ChevronLeft aria-hidden size={18} strokeWidth={2.1} />
        </button>
        <button
          type="button"
          aria-label="Next Buzzr motion card"
          onClick={() => scrollToCard(activeIndex + 1)}
          className="grid size-10 place-items-center rounded-full border border-white/[0.1] bg-white/[0.055] text-white/82 transition hover:border-accent/45 hover:bg-accent/12 hover:text-accent-text focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent"
        >
          <ChevronRight aria-hidden size={18} strokeWidth={2.1} />
        </button>
      </div>

      <div
        ref={scrollerRef}
        className="promo-carousel mt-4 flex snap-x snap-mandatory gap-4 overflow-x-auto pb-2"
        onScroll={syncActiveCard}
      >
        {REELS.map((reel, index) => (
          <article
            key={reel.title}
            data-carousel-index={index}
            className="promo-carousel__card group overflow-hidden rounded-[24px] border border-white/[0.09] bg-white/[0.045] shadow-[0_30px_80px_rgba(0,0,0,0.28)] transition-[border-color,background-color,transform] duration-300 [transition-timing-function:cubic-bezier(0.23,1,0.32,1)] hover:border-accent/25 hover:bg-white/[0.06] md:rounded-[26px] [@media(hover:hover)]:hover:-translate-y-1"
          >
            <div className="relative flex justify-center overflow-hidden bg-[radial-gradient(circle_at_50%_18%,rgb(var(--accent-rgb)_/_0.16),transparent_48%),linear-gradient(180deg,rgba(255,255,255,0.045),transparent)] px-4 pb-4 pt-7">
              <div
                aria-hidden
                className="promo-card-ground absolute inset-x-10 bottom-9 h-20 rounded-full bg-accent/10 transition-opacity duration-300 group-hover:opacity-80"
              />
              <PhoneShowcase size="medium" phoneMax="226px" className="w-full">
                <LazyPhoneVideo
                  label={`${reel.title} iOS capture`}
                  poster={reel.poster}
                  src={reel.src}
                />
              </PhoneShowcase>
            </div>
            <div className="px-5 pb-5 pt-4">
              <h3 className="font-hero text-[23px] font-extrabold leading-[1.04] text-foreground">
                {reel.title}
              </h3>
            </div>
          </article>
        ))}
      </div>

      <div className="mt-5 flex justify-center gap-2">
        {REELS.map((reel, index) => (
          <button
            key={reel.title}
            type="button"
            aria-label={`Show ${reel.title}`}
            aria-current={index === activeIndex ? 'true' : undefined}
            onClick={() => scrollToCard(index)}
            className="group grid size-7 place-items-center rounded-full focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent"
          >
            <span
              aria-hidden
              className={cn(
                'h-1.5 rounded-full transition-all duration-200',
                index === activeIndex
                  ? 'w-6 bg-accent'
                  : 'w-1.5 bg-white/24 group-hover:bg-white/48'
              )}
            />
          </button>
        ))}
      </div>
    </Section>
  );
}

function BeeIcon() {
  return (
    <svg
      aria-hidden="true"
      viewBox="0 0 40 40"
      className="size-[0.82em] shrink-0 text-accent"
      fill="none"
    >
      <path
        d="M14.5 15.8c-4.3-1.2-7.2.7-7.5 3.3-.3 2.8 2.7 4.8 7.1 3.3"
        stroke="currentColor"
        strokeWidth="2.6"
        strokeLinecap="round"
      />
      <path
        d="M25.5 15.8c4.3-1.2 7.2.7 7.5 3.3.3 2.8-2.7 4.8-7.1 3.3"
        stroke="currentColor"
        strokeWidth="2.6"
        strokeLinecap="round"
      />
      <path
        d="M12.5 22.3c0-5.2 3.2-8.6 7.5-8.6s7.5 3.4 7.5 8.6c0 5.1-3.2 8.2-7.5 8.2s-7.5-3.1-7.5-8.2Z"
        fill="currentColor"
      />
      <path
        d="M17.2 14.4c-.7-2.5-.1-4.2 1.8-5.6M22.8 14.4c.7-2.5.1-4.2-1.8-5.6"
        stroke="currentColor"
        strokeWidth="2.2"
        strokeLinecap="round"
      />
      <path
        d="M16.1 18.4h7.8M15.2 23h9.6M17.2 27.5h5.6"
        stroke="#04150b"
        strokeWidth="2"
        strokeLinecap="round"
      />
    </svg>
  );
}
