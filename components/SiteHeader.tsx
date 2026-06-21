'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useCallback, useEffect, useState } from 'react';
import {
  Activity,
  HelpCircle,
  LayoutGrid,
  Trophy,
  type LucideIcon
} from 'lucide-react';
import { BrandMark } from '@/components/BrandMark';
import { APP_STORE_URL, DOCS_URL } from '@/src/lib/constants';

type NavItem = { id: string; label: string; Icon: LucideIcon };

const SECTIONS: NavItem[] = [
  { id: 'rail',     label: 'Surfaces', Icon: LayoutGrid },
  { id: 'data',     label: 'Anatomy',  Icon: Activity },
  { id: 'leagues',  label: 'Leagues',  Icon: Trophy },
  { id: 'faq',      label: 'FAQ',      Icon: HelpCircle }
];

// The app's surfaces (its bottom-nav tabs), surfaced as a Product dropdown.
const FEATURES: { label: string; blurb: string; id: string }[] = [
  { label: 'Swipe',     blurb: 'Rate live games',       id: 'scroll' },
  { label: 'Swarm',     blurb: 'The community feed',     id: 'surfaces' },
  { label: 'Crews',     blurb: 'Compete with friends',   id: 'surfaces' },
  { label: 'Bets',      blurb: 'Track DFS slips',        id: 'rail' },
  { label: 'Dashboard', blurb: 'Your widgets, your way', id: 'surfaces' }
];

const FIRST_SECTION_ID = SECTIONS[0].id;

export function SiteHeader() {
  const pathname = usePathname();
  const isHome = pathname === '/';
  const [active, setActive] = useState<string>(FIRST_SECTION_ID);
  const [menuOpen, setMenuOpen] = useState(false);

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
      <header className="sticky top-0 z-40 w-full border-b border-white/[0.08] bg-canvas/70 backdrop-blur-xl">
        <div className="mx-auto flex w-full max-w-[1200px] items-center justify-between gap-6 px-6 py-3">
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
            className="inline-flex items-center gap-2 transition-opacity hover:opacity-80"
          >
            <BrandMark alt="" size={22} priority />
            <span className="text-[16px] lowercase leading-none tracking-[-0.025em] text-foreground">
              buzzr<span className="text-accent">.</span>
            </span>
          </Link>

          <nav aria-label="Primary" className="hidden md:block">
            <ul className="flex items-center gap-1">
              {/* Product dropdown — the app's surfaces */}
              <li className="group relative">
                <button
                  type="button"
                  aria-haspopup="true"
                  className="inline-flex min-h-[44px] items-center gap-1 rounded-full px-3 py-2.5 text-[14px] tracking-[-0.025em] text-muted transition-colors hover:text-foreground focus-visible:outline-none focus-visible:shadow-[0_0_0_2px_rgba(0,230,118,0.55)]"
                >
                  Product
                  <svg width="11" height="11" viewBox="0 0 24 24" className="opacity-60 transition-transform duration-200 group-hover:rotate-180" aria-hidden>
                    <path d="M6 9l6 6 6-6" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />
                  </svg>
                </button>
                <div className="invisible absolute left-0 top-full z-50 pt-2 opacity-0 transition-all duration-150 group-hover:visible group-hover:opacity-100 group-focus-within:visible group-focus-within:opacity-100">
                  <div className="w-[260px] rounded-2xl border border-white/10 bg-canvas/95 p-2 shadow-[0_24px_70px_rgba(0,0,0,0.55)] backdrop-blur-xl">
                    {FEATURES.map((f) => (
                      <Link
                        key={f.label}
                        href={hrefFor(f.id)}
                        onClick={(e) => handleAnchor(e, f.id)}
                        className="flex items-center justify-between gap-3 rounded-xl px-3 py-2.5 transition-colors hover:bg-white/[0.06] focus-visible:bg-white/[0.06] focus-visible:outline-none"
                      >
                        <span className="text-[14px] tracking-[-0.025em] text-foreground">{f.label}</span>
                        <span className="text-[12px] tracking-[-0.01em] text-muted">{f.blurb}</span>
                      </Link>
                    ))}
                  </div>
                </div>
              </li>

              {SECTIONS.map(({ id, label, Icon }) => {
                const isActive = isHome && active === id;
                return (
                  <li key={id}>
                    <Link
                      href={hrefFor(id)}
                      onClick={(e) => handleAnchor(e, id)}
                      aria-current={isActive ? 'location' : undefined}
                      className={`inline-flex min-h-[44px] items-center gap-1.5 rounded-full px-3 py-2.5 text-[14px] tracking-[-0.025em] transition-colors focus-visible:outline-none focus-visible:shadow-[0_0_0_2px_rgba(0,230,118,0.55)] ${
                        isActive ? 'bg-white/[0.06] text-accent' : 'text-muted hover:text-foreground'
                      }`}
                    >
                      <Icon size={14} strokeWidth={1.5} aria-hidden />
                      {label}
                    </Link>
                  </li>
                );
              })}
            </ul>
          </nav>

          <div className="hidden md:flex items-center gap-1">
            <Link
              href="/blog"
              className="inline-flex min-h-[44px] items-center rounded-full px-3 py-2.5 text-[14px] tracking-[-0.025em] text-muted hover:text-foreground transition-colors focus-visible:outline-none focus-visible:shadow-[0_0_0_2px_rgba(0,230,118,0.55)]"
            >
              Blog
            </Link>
            <Link
              href="/changelog"
              className="inline-flex min-h-[44px] items-center rounded-full px-3 py-2.5 text-[14px] tracking-[-0.025em] text-muted hover:text-foreground transition-colors focus-visible:outline-none focus-visible:shadow-[0_0_0_2px_rgba(0,230,118,0.55)]"
            >
              Changelog
            </Link>
            <Link
              href={APP_STORE_URL}
              target="_blank"
              rel="noopener noreferrer"
              className="ml-1 inline-flex min-h-[44px] items-center rounded-full bg-foreground px-5 py-2.5 text-[13px] font-bold uppercase tracking-[0.03em] text-canvas transition-[colors,box-shadow] hover:bg-accent hover:text-on-accent hover:shadow-[0_0_0_3px_rgba(0,230,118,0.25)] focus-visible:outline-none focus-visible:shadow-[0_0_0_2px_rgba(0,230,118,0.55)]"
            >
              Get the app
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
              <span className={`absolute left-0 top-0 h-[1px] w-full bg-current transition-transform duration-200 ${menuOpen ? 'translate-y-[7px] rotate-45' : ''}`} />
              <span className={`absolute left-0 top-[7px] h-[1px] w-full bg-current transition-opacity duration-150 ${menuOpen ? 'opacity-0' : 'opacity-100'}`} />
              <span className={`absolute left-0 bottom-0 h-[1px] w-full bg-current transition-transform duration-200 ${menuOpen ? '-translate-y-[7px] -rotate-45' : ''}`} />
            </span>
          </button>
        </div>
      </header>

      {/* Mobile drawer */}
      <div
        id="mobile-nav"
        role="dialog"
        aria-modal="true"
        aria-label="Site navigation"
        className={`fixed inset-0 z-30 md:hidden ${menuOpen ? '' : 'pointer-events-none'}`}
      >
        <div
          onClick={() => setMenuOpen(false)}
          className={`absolute inset-0 bg-canvas/85 backdrop-blur-sm transition-opacity duration-200 ${menuOpen ? 'opacity-100' : 'opacity-0'}`}
        />
        <div
          className={`absolute inset-x-0 top-[64px] border-b border-white/[0.08] bg-canvas transition-transform duration-200 ${menuOpen ? 'translate-y-0 opacity-100' : '-translate-y-4 opacity-0'}`}
        >
          <nav aria-label="Site" className="mx-auto w-full max-w-[1200px] px-6 py-6">
            <p className="mb-2 font-mono text-[11px] uppercase tracking-[0.16em] text-muted">Product</p>
            <ul className="mb-4 grid grid-cols-2 gap-2">
              {FEATURES.map((f) => (
                <li key={f.label}>
                  <Link
                    href={hrefFor(f.id)}
                    onClick={(e) => handleAnchor(e, f.id)}
                    className="block rounded-xl border border-white/10 bg-white/[0.02] px-3 py-2.5 text-[14px] tracking-[-0.025em] text-foreground transition-colors hover:border-accent/40"
                  >
                    {f.label}
                  </Link>
                </li>
              ))}
            </ul>

            <ul className="flex flex-col">
              {SECTIONS.map(({ id, label, Icon }) => {
                const isActive = isHome && active === id;
                return (
                  <li key={id}>
                    <Link
                      href={hrefFor(id)}
                      onClick={(e) => handleAnchor(e, id)}
                      className={`flex items-center justify-between border-b border-white/[0.08] py-3 text-[14px] tracking-[-0.025em] transition-colors ${
                        isActive ? 'text-accent' : 'text-muted hover:text-foreground'
                      }`}
                    >
                      <span className="inline-flex items-center gap-2.5">
                        <Icon size={16} strokeWidth={1.5} aria-hidden />
                        {label}
                      </span>
                    </Link>
                  </li>
                );
              })}
            </ul>

            <ul className="mt-4 flex flex-col">
              <li><a href={DOCS_URL} target="_blank" rel="noopener noreferrer" className="block border-b border-white/[0.08] py-3 text-[14px] tracking-[-0.025em] text-muted hover:text-foreground transition-colors">Docs</a></li>
              <li><Link href="/changelog" className="block border-b border-white/[0.08] py-3 text-[14px] tracking-[-0.025em] text-muted hover:text-foreground transition-colors">Changelog</Link></li>
              <li><Link href="/blog" className="block border-b border-white/[0.08] py-3 text-[14px] tracking-[-0.025em] text-muted hover:text-foreground transition-colors">Blog</Link></li>
              <li><Link href="/support" className="block border-b border-white/[0.08] py-3 text-[14px] tracking-[-0.025em] text-muted hover:text-foreground transition-colors">Support</Link></li>
              <li><Link href="/privacy" className="block border-b border-white/[0.08] py-3 text-[14px] tracking-[-0.025em] text-muted hover:text-foreground transition-colors">Privacy</Link></li>
            </ul>

            <div className="mt-6">
              <Link
                href={APP_STORE_URL}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex w-full items-center justify-center rounded-full bg-foreground px-3 py-3 text-[13px] font-bold uppercase tracking-[0.03em] text-canvas transition-colors hover:bg-accent hover:text-on-accent"
              >
                Get the app
              </Link>
            </div>
          </nav>
        </div>
      </div>
    </>
  );
}
