'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useCallback, useEffect, useRef, useState } from 'react';
import {
  MessagesSquare,
  ScrollText,
  Trophy,
  WalletCards,
  type LucideIcon
} from 'lucide-react';
import { BrandMark } from '@/components/BrandMark';
import { ShimmerHoverLabel } from '@/components/ui/BrandShimmer';
import { AppleIcon } from '@/components/ui/BrandIcons';
import { APP_STORE_URL } from '@/src/lib/constants';

type NavItem = { id: string; label: string; Icon: LucideIcon };

// Ids must match sections actually rendered on the home page (page.tsx), in
// scroll order, so the active/selected state tracks monotonically. The old
// 'scroll'/'showcase' targets were unmounted -> selection broke.
const SECTIONS: NavItem[] = [
  { id: 'surfaces', label: 'Scroll', Icon: ScrollText },
  { id: 'promo', label: 'Friends', Icon: MessagesSquare },
  { id: 'leagues', label: 'Leagues', Icon: Trophy },
  { id: 'rail', label: 'Bets', Icon: WalletCards }
];

const FIRST_SECTION_ID = SECTIONS[0].id;

export function SiteHeader() {
  const pathname = usePathname();
  const isHome = pathname === '/';
  const [active, setActive] = useState<string>(FIRST_SECTION_ID);
  const [menuOpen, setMenuOpen] = useState(false);
  const drawerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!isHome) return;

    const observer = new IntersectionObserver(
      (entries) => {
        const visible = entries
          .filter((e) => e.isIntersecting)
          .sort((a, b) => b.intersectionRatio - a.intersectionRatio);
        if (visible[0]) setActive(visible[0].target.id);
      },
      {
        rootMargin: '-40% 0px -50% 0px',
        threshold: [0, 0.2, 0.5, 1]
      }
    );

    SECTIONS.forEach(({ id }) => {
      const el = document.getElementById(id);
      if (el) observer.observe(el);
    });

    return () => observer.disconnect();
  }, [isHome]);

  useEffect(() => { setMenuOpen(false); }, [pathname]);

  useEffect(() => {
    document.body.style.overflow = menuOpen ? 'hidden' : '';
    return () => { document.body.style.overflow = ''; };
  }, [menuOpen]);

  // Keep the closed drawer out of the tab order and a11y tree while preserving
  // the open animation.
  useEffect(() => {
    if (drawerRef.current) drawerRef.current.inert = !menuOpen;
  }, [menuOpen]);

  useEffect(() => {
    if (!menuOpen) return;
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') setMenuOpen(false);
    };
    window.addEventListener('keydown', onKeyDown);
    return () => window.removeEventListener('keydown', onKeyDown);
  }, [menuOpen]);

  const handleAnchor = useCallback(
    (e: React.MouseEvent<HTMLAnchorElement>, id: string) => {
      if (!isHome) return;
      e.preventDefault();
      const el = document.getElementById(id);
      if (!el) return;
      el.scrollIntoView({ behavior: 'smooth', block: 'start' });
      history.replaceState(null, '', `#${id}`);
      setActive(id);
      setMenuOpen(false);
    },
    [isHome]
  );

  const hrefFor = (id: string) => (isHome ? `#${id}` : `/#${id}`);

  return (
    <>
      <header
        className={`site-header top-0 z-40 w-full px-4 pb-2 pt-3 md:pt-4 ${
          isHome ? 'fixed pointer-events-none' : 'sticky'
        }`}
      >
        <div className="site-nav-shell pointer-events-auto mx-auto grid w-full max-w-[1180px] grid-cols-[auto_1fr_auto] items-center gap-3 py-2 pl-3 pr-2 sm:gap-4 sm:pr-3">
          <Link
            href={isHome ? '#top' : '/'}
            onClick={(e) => {
              if (isHome) {
                e.preventDefault();
                window.scrollTo({ top: 0, behavior: 'smooth' });
                history.replaceState(null, '', '/');
                setActive(FIRST_SECTION_ID);
              }
            }}
            className="site-nav-brand inline-flex min-h-[44px] items-center gap-2.5 px-1.5 pr-3 transition-[background-color,opacity] duration-200 hover:bg-white/[0.08] hover:opacity-95 focus-visible:outline-none focus-visible:shadow-[var(--shadow-focus)]"
            aria-label="Buzzr home"
          >
            <BrandMark alt="Buzzr" size={40} variant="transparent" priority />
          </Link>

          <nav aria-label="Primary" className="hidden justify-self-center md:block">
            <ul className="flex items-center gap-1.5">
              {SECTIONS.map(({ id, label, Icon }) => {
                const isActive = isHome && active === id;
                return (
                  <li key={id}>
                    <Link
                      href={hrefFor(id)}
                      onClick={(e) => handleAnchor(e, id)}
                      aria-current={isActive ? 'location' : undefined}
                      className={`site-nav-control font-hero group inline-flex min-h-[38px] items-center gap-1.5 px-3.5 text-[14px] font-semibold transition-colors focus-visible:outline-none focus-visible:shadow-[var(--shadow-focus)] ${
                        isActive ? 'bg-white/[0.08] text-white' : 'text-white/55 hover:bg-white/[0.05] hover:text-white'
                      }`}
                    >
                      <Icon
                        size={14}
                        strokeWidth={1.75}
                        aria-hidden
                        className={isActive ? 'text-accent-text' : 'text-white/40 transition-colors group-hover:text-white/70'}
                      />
                      <span>{label}</span>
                    </Link>
                  </li>
                );
              })}
            </ul>
          </nav>

          <div className="hidden md:flex items-center gap-1">
            <Link
              href="/blog"
              className="site-nav-control font-hero inline-flex min-h-[38px] items-center px-3.5 text-[14px] font-semibold text-white/55 transition-colors hover:bg-white/[0.05] hover:text-white focus-visible:outline-none focus-visible:shadow-[var(--shadow-focus)]"
            >
              Blog
            </Link>
            <Link
              href="/changelog"
              className="site-nav-control font-hero inline-flex min-h-[38px] items-center px-3.5 text-[14px] font-semibold text-white/55 transition-colors hover:bg-white/[0.05] hover:text-white focus-visible:outline-none focus-visible:shadow-[var(--shadow-focus)]"
            >
              Changelog
            </Link>
            <Link
              href={APP_STORE_URL}
              target="_blank"
              rel="noopener noreferrer"
              className="site-nav-cta font-hero ml-1.5 inline-flex shrink-0 items-center justify-center gap-2 bg-accent px-4 text-[14px] font-semibold text-on-accent hover:bg-accent-dim focus-visible:outline-none focus-visible:shadow-[var(--shadow-focus)]"
            >
              <AppleIcon size={15} />
              <ShimmerHoverLabel className="site-nav-cta-label">Get the app</ShimmerHoverLabel>
              <span className="sr-only"> (opens in new tab)</span>
            </Link>
          </div>

          <button
            type="button"
            onClick={() => setMenuOpen((v) => !v)}
            aria-expanded={menuOpen}
            aria-controls="mobile-nav"
            aria-label={menuOpen ? 'Close menu' : 'Open menu'}
            className="inline-flex h-10 w-10 items-center justify-center text-foreground transition-colors hover:text-muted md:hidden"
          >
            <span className="relative block h-4 w-5">
              <span className={`absolute left-0 top-0 h-[1.5px] w-full bg-current transition-transform duration-200 ${menuOpen ? 'translate-y-[7px] rotate-45' : ''}`} />
              <span className={`absolute left-0 top-[7px] h-[1.5px] w-full bg-current transition-opacity duration-150 ${menuOpen ? 'opacity-0' : 'opacity-100'}`} />
              <span className={`absolute left-0 bottom-0 h-[1.5px] w-full bg-current transition-transform duration-200 ${menuOpen ? '-translate-y-[7px] -rotate-45' : ''}`} />
            </span>
          </button>
        </div>
      </header>

      {/* Mobile drawer */}
      <div
        ref={drawerRef}
        id="mobile-nav"
        role="dialog"
        aria-modal="true"
        aria-label="Site navigation"
        className={`fixed inset-0 z-30 md:hidden ${menuOpen ? '' : 'pointer-events-none'}`}
      >
        <div
          onClick={() => setMenuOpen(false)}
          className={`absolute inset-0 bg-foreground/20 backdrop-blur-sm transition-opacity duration-200 ${menuOpen ? 'opacity-100' : 'opacity-0'}`}
        />
        <div
          className={`absolute inset-x-0 top-[64px] border-b border-border bg-surface transition-transform duration-200 ${menuOpen ? 'translate-y-0 opacity-100' : '-translate-y-4 opacity-0'}`}
        >
          <nav aria-label="Site" className="mx-auto w-full max-w-[1200px] px-6 py-6">
            <p className="mb-2 font-mono text-[11px] uppercase tracking-[0.12em] text-muted">Product</p>
            <ul className="grid grid-cols-2 gap-2">
              {SECTIONS.map(({ id, label, Icon }) => {
                const isActive = isHome && active === id;
                return (
                  <li key={id}>
                    <Link
                      href={hrefFor(id)}
                      onClick={(e) => handleAnchor(e, id)}
                      className={`font-hero flex min-h-[48px] items-center gap-2 rounded-control border px-3 py-2.5 text-[14px] font-semibold tracking-[-0.015em] transition-colors ${
                        isActive ? 'border-accent/45 bg-accent/10 text-white' : 'border-border bg-subtle text-foreground hover:border-accent/40'
                      }`}
                    >
                      <Icon size={16} strokeWidth={1.75} aria-hidden />
                      {label}
                    </Link>
                  </li>
                );
              })}
            </ul>

            <ul className="mt-4 flex flex-col">
              <li><Link href="/changelog" className="block border-b border-border py-3 text-[14px] tracking-[-0.015em] text-muted hover:text-foreground transition-colors">Changelog</Link></li>
              <li><Link href="/blog" className="block border-b border-border py-3 text-[14px] tracking-[-0.015em] text-muted hover:text-foreground transition-colors">Blog</Link></li>
              <li><Link href="/support" className="block border-b border-border py-3 text-[14px] tracking-[-0.015em] text-muted hover:text-foreground transition-colors">Support</Link></li>
              <li><Link href="/privacy" className="block border-b border-border py-3 text-[14px] tracking-[-0.015em] text-muted hover:text-foreground transition-colors">Privacy</Link></li>
            </ul>

            <div className="mt-6">
              <Link
                href={APP_STORE_URL}
                target="_blank"
                rel="noopener noreferrer"
                className="site-nav-cta site-nav-cta-mobile font-hero inline-flex items-center justify-center gap-2 bg-accent px-4 text-[14px] font-bold text-on-accent transition-colors duration-200 hover:bg-accent-dim"
              >
                <AppleIcon size={16} />
                <span className="site-nav-cta-label">Get the app</span>
                <span className="sr-only"> (opens in new tab)</span>
              </Link>
            </div>
          </nav>
        </div>
      </div>
    </>
  );
}
