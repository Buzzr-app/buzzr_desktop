'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useCallback, useEffect, useState } from 'react';
import {
  Activity,
  HelpCircle,
  Layers,
  LayoutGrid,
  Trophy,
  type LucideIcon
} from 'lucide-react';
import { BrandMark } from '@/components/BrandMark';
import { APP_STORE_URL, DOCS_URL } from '@/src/lib/constants';

type NavItem = { id: string; label: string; Icon: LucideIcon };

const SECTIONS: NavItem[] = [
  { id: 'scroll',   label: 'Scroll',    Icon: Layers },
  { id: 'surfaces', label: 'Surfaces',  Icon: LayoutGrid },
  { id: 'data',     label: 'Data',      Icon: Activity },
  { id: 'leagues',  label: 'Leagues',   Icon: Trophy },
  { id: 'faq',      label: 'FAQ',       Icon: HelpCircle }
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
      <header className="sticky top-0 z-40 w-full border-b border-surface bg-canvas/85 backdrop-blur-md">
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

          <nav aria-label="Sections" className="hidden md:block">
            <ul className="flex items-center gap-2">
              {SECTIONS.map(({ id, label, Icon }) => {
                const isActive = isHome && active === id;
                return (
                  <li key={id}>
                    <Link
                      href={hrefFor(id)}
                      onClick={(e) => handleAnchor(e, id)}
                      aria-current={isActive ? 'location' : undefined}
                      className={`inline-flex min-h-[44px] items-center gap-1.5 px-3 py-2.5 text-[14px] tracking-[-0.025em] transition-colors focus-visible:outline-none focus-visible:shadow-[0_0_0_2px_rgba(0,230,118,0.55)] rounded-2xl ${
                        isActive ? 'text-accent' : 'text-muted hover:text-foreground'
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

          <div className="hidden md:flex items-center gap-2">
            <Link
              href="/changelog"
              className="inline-flex min-h-[44px] items-center px-3 py-2.5 text-[14px] tracking-[-0.025em] text-muted hover:text-foreground transition-colors rounded-2xl focus-visible:outline-none focus-visible:shadow-[0_0_0_2px_rgba(0,230,118,0.55)]"
            >
              Changelog
            </Link>
            <Link
              href="/blog"
              className="inline-flex min-h-[44px] items-center px-3 py-2.5 text-[14px] tracking-[-0.025em] text-muted hover:text-foreground transition-colors rounded-2xl focus-visible:outline-none focus-visible:shadow-[0_0_0_2px_rgba(0,230,118,0.55)]"
            >
              Blog
            </Link>
            <Link
              href={APP_STORE_URL}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex min-h-[44px] items-center rounded-2xl border border-white/25 px-4 py-2.5 text-[14px] tracking-[-0.025em] text-foreground hover:border-white/50 transition-colors focus-visible:outline-none focus-visible:shadow-[0_0_0_2px_rgba(0,230,118,0.55)]"
            >
              Get the App
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
          className={`absolute inset-x-0 top-[64px] border-b border-surface bg-canvas transition-transform duration-200 ${menuOpen ? 'translate-y-0 opacity-100' : '-translate-y-4 opacity-0'}`}
        >
          <nav aria-label="Sections" className="mx-auto w-full max-w-[1200px] px-6 py-6">
            <ul className="flex flex-col">
              {SECTIONS.map(({ id, label, Icon }) => {
                const isActive = isHome && active === id;
                return (
                  <li key={id}>
                    <Link
                      href={hrefFor(id)}
                      onClick={(e) => handleAnchor(e, id)}
                      className={`flex items-center justify-between border-b border-surface py-3 text-[14px] tracking-[-0.025em] transition-colors ${
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
              <li><a href={DOCS_URL} target="_blank" rel="noopener noreferrer" className="block border-b border-surface py-3 text-[14px] tracking-[-0.025em] text-muted hover:text-foreground transition-colors">Docs</a></li>
              <li><Link href="/changelog" className="block border-b border-surface py-3 text-[14px] tracking-[-0.025em] text-muted hover:text-foreground transition-colors">Changelog</Link></li>
              <li><Link href="/blog" className="block border-b border-surface py-3 text-[14px] tracking-[-0.025em] text-muted hover:text-foreground transition-colors">Blog</Link></li>
              <li><Link href="/support" className="block border-b border-surface py-3 text-[14px] tracking-[-0.025em] text-muted hover:text-foreground transition-colors">Support</Link></li>
              <li><Link href="/privacy" className="block border-b border-surface py-3 text-[14px] tracking-[-0.025em] text-muted hover:text-foreground transition-colors">Privacy</Link></li>
            </ul>

            <div className="mt-6">
              <Link
                href={APP_STORE_URL}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex w-full items-center justify-center rounded-2xl bg-foreground px-3 py-2 text-[14px] tracking-[-0.025em] text-canvas transition-colors hover:bg-foreground/90"
              >
                Get the App
              </Link>
            </div>
          </nav>
        </div>
      </div>
    </>
  );
}
