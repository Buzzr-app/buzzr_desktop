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
    <div className="pointer-events-none fixed inset-x-0 bottom-0 z-50 flex justify-center px-4 pb-[calc(16px_+_env(safe-area-inset-bottom))]">
      <div className="launch-banner-shell pointer-events-auto grid w-full max-w-[680px] grid-cols-[1fr_auto] items-center gap-x-4 gap-y-3 rounded-[22px] border border-white/[0.12] px-4 py-3 motion-safe:animate-fade-in-up sm:grid-cols-[auto_1fr_auto_auto_auto] sm:px-5">
        <span
          aria-hidden
          className="hidden size-2.5 shrink-0 rounded-full bg-accent shadow-[0_0_22px_rgba(0,194,100,0.75)] motion-safe:animate-buzz-pulse sm:block"
        />
        <p className="min-w-0 text-[14px] leading-[1.35] tracking-[-0.01em] text-foreground sm:text-[14.5px]">
          <span className="font-hero font-bold tracking-[-0.018em]">Buzzr 2.0 is live.</span>{' '}
          <span className="text-muted">Scroll, dashboards, leagues, and Bets in one app.</span>
        </p>
        <div className="col-span-2 flex items-center justify-start gap-2 sm:col-span-1">
          <a
            href="https://www.producthunt.com/products/buzzr-sports/reviews/new"
            target="_blank"
            rel="noopener noreferrer"
            className="font-hero inline-flex min-h-10 items-center rounded-[14px] px-3 text-[13px] font-semibold tracking-[-0.01em] text-white/68 transition-[background-color,color] duration-150 hover:bg-white/[0.06] hover:text-white focus-visible:outline-none focus-visible:shadow-[var(--shadow-focus)]"
          >
            Review on PH
          </a>
          <Link
            href="/changelog"
            className="font-hero inline-flex min-h-10 shrink-0 items-center justify-center rounded-[14px] bg-accent px-4 text-[13px] font-bold tracking-[-0.01em] text-on-accent shadow-[0_16px_40px_-20px_rgba(0,194,100,0.85)] transition-[background-color,transform] duration-150 ease-out hover:bg-accent-dim active:scale-[0.97] focus-visible:outline-none focus-visible:shadow-[var(--shadow-focus)]"
          >
            What changed
          </Link>
        </div>
        <button
          type="button"
          onClick={dismiss}
          aria-label="Dismiss launch notification"
          className="row-start-1 justify-self-end rounded-full p-2 text-muted transition-colors duration-150 hover:bg-white/[0.06] hover:text-foreground focus-visible:outline-none focus-visible:shadow-[var(--shadow-focus)] sm:row-auto"
        >
          <svg viewBox="0 0 24 24" className="h-4 w-4" fill="none" stroke="currentColor" strokeWidth={2} aria-hidden>
            <path d="M6 6l12 12M18 6L6 18" strokeLinecap="round" />
          </svg>
        </button>
      </div>
    </div>
  );
}
