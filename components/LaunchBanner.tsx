'use client';

import Link from 'next/link';
import { useEffect, useState } from 'react';

const DISMISS_KEY = 'buzzr-2-launch-dismissed';

/**
 * Sticky bottom launch notification. Announces Buzzr 2.0, links to the
 * changelog, and remembers dismissal in localStorage so it shows once.
 */
export function LaunchBanner() {
  const [show, setShow] = useState(false);

  useEffect(() => {
    try {
      if (!localStorage.getItem(DISMISS_KEY)) setShow(true);
    } catch {
      setShow(true);
    }
  }, []);

  if (!show) return null;

  const dismiss = () => {
    try {
      localStorage.setItem(DISMISS_KEY, '1');
    } catch {
      /* private mode: just hide for this session */
    }
    setShow(false);
  };

  return (
    <div className="pointer-events-none fixed inset-x-0 bottom-0 z-50 flex justify-center px-4 pb-4">
      <div className="pointer-events-auto flex w-full max-w-[560px] items-center gap-3 rounded-2xl border border-white/[0.1] bg-surface/80 px-4 py-3 shadow-[0_24px_70px_-30px_rgba(0,0,0,0.85)] backdrop-blur-xl motion-safe:animate-fade-in-up">
        <span aria-hidden className="size-2 shrink-0 rounded-full bg-accent motion-safe:animate-buzz-pulse" />
        <p className="min-w-0 flex-1 text-[14px] leading-[1.35] tracking-[-0.01em] text-foreground">
          <span className="font-semibold">Buzzr 2.0 is out now.</span>{' '}
          <span className="text-muted">Scroll, dashboards, leagues, and Bets in one app.</span>
        </p>
        <a
          href="https://www.producthunt.com/products/buzzr-sports/reviews/new"
          target="_blank"
          rel="noopener noreferrer"
          className="hidden shrink-0 text-[13px] font-medium tracking-[-0.01em] text-muted transition-colors duration-150 hover:text-foreground focus-visible:outline-none focus-visible:shadow-[var(--shadow-focus)] sm:inline"
        >
          Review on PH
        </a>
        <Link
          href="/changelog"
          className="shrink-0 rounded-button bg-accent px-3.5 py-2 text-[13px] font-semibold tracking-[-0.01em] text-on-accent transition-[background-color,transform] duration-150 ease-out hover:bg-accent-dim active:scale-[0.97] focus-visible:outline-none focus-visible:shadow-[var(--shadow-focus)]"
        >
          What changed
        </Link>
        <button
          type="button"
          onClick={dismiss}
          aria-label="Dismiss launch notification"
          className="shrink-0 rounded-full p-1.5 text-muted transition-colors duration-150 hover:bg-white/[0.06] hover:text-foreground focus-visible:outline-none focus-visible:shadow-[var(--shadow-focus)]"
        >
          <svg viewBox="0 0 24 24" className="h-4 w-4" fill="none" stroke="currentColor" strokeWidth={2} aria-hidden>
            <path d="M6 6l12 12M18 6L6 18" strokeLinecap="round" />
          </svg>
        </button>
      </div>
    </div>
  );
}
