import './globals.css';
import type { Metadata, Viewport } from 'next';
import Link from 'next/link';
import { ReactNode } from 'react';
import {
  APP_STORE_URL,
  BASE_URL,
  DISCORD_URL,
  BUZZR_TV_DISCLAIMER,
  INSTAGRAM_URL,
  SITE_DESCRIPTION,
  SITE_NAME,
  TWITTER_URL
} from '@/src/lib/constants';
import { geistSans, geistMono, heroFont } from './fonts';
import { Analytics } from '@vercel/analytics/next';
import { BrandMark } from '@/components/BrandMark';
import { SiteHeader } from '@/components/SiteHeader';
import { LaunchBanner } from '@/components/LaunchBanner';
import { BRAND_ASSETS } from '@/src/lib/brandAssets';
import { VideoBackdrop } from '@/components/ui/VideoBackdrop';

export const metadata: Metadata = {
  title: SITE_NAME,
  description: SITE_DESCRIPTION,
  metadataBase: new URL(BASE_URL),
  applicationName: SITE_NAME,
  icons: {
    shortcut: BRAND_ASSETS.shortcut
  },
  alternates: {
    types: { 'application/rss+xml': `${BASE_URL}/blog/rss.xml` }
  },
  openGraph: {
    title: SITE_NAME,
    description: SITE_DESCRIPTION,
    url: BASE_URL,
    siteName: SITE_NAME,
    type: 'website',
    locale: 'en_US'
  }
};

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
  maximumScale: 5,
  themeColor: '#0a0a0c'
};

export default function RootLayout({ children }: { children: ReactNode }) {
  const fontVariables = `${geistSans.variable} ${geistMono.variable} ${heroFont.variable}`;

  return (
    <html lang="en" className={fontVariables} data-scroll-behavior="smooth">
      <body className="bg-canvas text-foreground font-sans antialiased">
        <a
          href="#main-content"
          className="sr-only absolute left-4 top-4 z-50 border border-border bg-surface px-4 py-2 text-[14px] tracking-[-0.025em] text-foreground focus:not-sr-only focus:outline-none focus:shadow-[var(--shadow-focus)]"
        >
          Skip to content
        </a>

        <div className="relative flex min-h-screen flex-col">
          <SiteHeader />

          <main id="main-content" className="w-full flex-1">
            {children}
          </main>

          <footer className="relative overflow-hidden border-t border-white/10 bg-canvas text-white">
            <VideoBackdrop defer overlayClassName="bg-canvas/72" />
            <div className="relative mx-auto w-full max-w-[1200px] px-6 py-12">
              <div className="mb-12 flex flex-col gap-10 sm:flex-row sm:items-start sm:justify-between">
                <div className="space-y-3">
                  <div className="flex items-center gap-2.5">
                    <BrandMark alt="" size={38} variant="transparent" />
                    <span className="text-[16px] lowercase leading-none tracking-[-0.025em] text-white">
                      buzzr<span className="text-accent">.</span>
                    </span>
                  </div>
                  <p className="max-w-[260px] text-[14px] leading-[1.43] tracking-[0.1px] text-white/58">
                    The AI-native sports social app for Scroll, dashboards, friends, leagues, and Buzzr Bets.
                  </p>
                  <a
                    href="https://www.producthunt.com/products/buzzr-sports/reviews/new?utm_source=badge-product_review&utm_medium=badge&utm_source=badge-buzzr-sports"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="mt-1 inline-block rounded-[10px] transition-opacity duration-200 hover:opacity-90 focus-visible:outline-none focus-visible:shadow-[var(--shadow-focus)]"
                  >
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img
                      src="https://api.producthunt.com/widgets/embed-image/v1/product_review.svg?product_id=1220128&theme=dark"
                      alt="Buzzr Sports - The first AI-native sports social media app | Product Hunt"
                      width={250}
                      height={54}
                      className="h-[54px] w-[250px]"
                    />
                  </a>
                </div>

                <div className="flex flex-wrap gap-x-12 gap-y-8">
                  <div className="space-y-3">
                    <p className="font-mono text-[12px] uppercase tracking-[0.1em] leading-[2] text-white/42">Product</p>
                    <ul className="space-y-2 text-[14px] tracking-[-0.025em]">
                      <li><a href={APP_STORE_URL} target="_blank" rel="noopener noreferrer" className="text-white/58 transition-colors hover:text-white link-underline">Get the App</a></li>
                      <li><Link href="/changelog" className="text-white/58 transition-colors hover:text-white link-underline">Changelog</Link></li>
                      <li><Link href="/blog" className="text-white/58 transition-colors hover:text-white link-underline">Blog</Link></li>
                      <li><Link href="/support" className="text-white/58 transition-colors hover:text-white link-underline">Support</Link></li>
                    </ul>
                  </div>
                  <div className="space-y-3">
                    <p className="font-mono text-[12px] uppercase tracking-[0.1em] leading-[2] text-white/42">Legal</p>
                    <ul className="space-y-2 text-[14px] tracking-[-0.025em]">
                      <li><Link href="/privacy" className="text-white/58 transition-colors hover:text-white link-underline">Privacy</Link></li>
                      <li><Link href="/terms" className="text-white/58 transition-colors hover:text-white link-underline">Terms</Link></li>
                      <li><Link href="/delete-account" className="text-white/58 transition-colors hover:text-white link-underline">Delete Account</Link></li>
                    </ul>
                  </div>
                  <div className="space-y-3">
                    <p className="font-mono text-[12px] uppercase tracking-[0.1em] leading-[2] text-white/42">Social</p>
                    <ul className="space-y-2 text-[14px] tracking-[-0.025em]">
                      <li><a href={DISCORD_URL} target="_blank" rel="noopener noreferrer" className="text-white/58 transition-colors hover:text-white link-underline">Discord</a></li>
                      <li><a href={TWITTER_URL} target="_blank" rel="noopener noreferrer" className="text-white/58 transition-colors hover:text-white link-underline">X / Twitter</a></li>
                      <li><a href={INSTAGRAM_URL} target="_blank" rel="noopener noreferrer" className="text-white/58 transition-colors hover:text-white link-underline">Instagram</a></li>
                      <li><a href="https://linktr.ee/buzzrsports" target="_blank" rel="noopener noreferrer" className="text-white/58 transition-colors hover:text-white link-underline">Linktree</a></li>
                    </ul>
                  </div>
                </div>
              </div>

              <div className="mb-6 h-px bg-white/10" aria-hidden />
              <div className="flex flex-wrap items-center justify-between gap-2 font-mono text-[12px] tracking-[0.1em] leading-[2] text-white/48">
                <span>© {new Date().getFullYear()} HUMYN LLC. ALL RIGHTS RESERVED.</span>
                <p className="max-w-sm text-left sm:text-right">{BUZZR_TV_DISCLAIMER}</p>
              </div>
            </div>
          </footer>
        </div>
        <LaunchBanner />
        <Analytics />
      </body>
    </html>
  );
}
