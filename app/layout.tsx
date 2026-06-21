import './globals.css';
import type { Metadata, Viewport } from 'next';
import Link from 'next/link';
import { ReactNode } from 'react';
import {
  APP_STORE_URL,
  BASE_URL,
  DISCORD_URL,
  DOCS_URL,
  BUZZR_TV_DISCLAIMER,
  INSTAGRAM_URL,
  SITE_DESCRIPTION,
  SITE_NAME,
  TWITTER_URL
} from '@/src/lib/constants';
import { geistSans, geistMono } from './fonts';
import { Analytics } from '@vercel/analytics/next';
import { BrandMark } from '@/components/BrandMark';
import { ProductHuntLaunchEmbed } from '@/components/ProductHuntLaunchEmbed';
import { SiteHeader } from '@/components/SiteHeader';
import { BRAND_ASSETS } from '@/src/lib/brandAssets';

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
  themeColor: [
    { media: '(prefers-color-scheme: light)', color: '#f6f3ec' },
    { media: '(prefers-color-scheme: dark)', color: '#14181d' }
  ]
};

export default function RootLayout({ children }: { children: ReactNode }) {
  const fontVariables = `${geistSans.variable} ${geistMono.variable}`;

  return (
    <html lang="en" className={fontVariables} suppressHydrationWarning>
      <body className="bg-canvas text-foreground font-sans antialiased">
        <script
          dangerouslySetInnerHTML={{
            __html:
              "try{var t=localStorage.getItem('theme');if(t==='dark'||(!t&&window.matchMedia('(prefers-color-scheme: dark)').matches)){document.documentElement.classList.add('dark')}}catch(e){}"
          }}
        />
        <a
          href="#main-content"
          className="sr-only absolute left-4 top-4 z-50 border border-border bg-surface px-4 py-2 text-[14px] tracking-[-0.025em] text-foreground focus:not-sr-only focus:outline-none focus:shadow-[0_0_0_2px_rgba(0,194,100,0.55)]"
        >
          Skip to content
        </a>

        <div className="relative flex min-h-screen flex-col">
          <SiteHeader />

          <main id="main-content" className="w-full flex-1">
            {children}
          </main>

          <footer className="relative border-t border-border">
            <ProductHuntLaunchEmbed />
            <div className="mx-auto w-full max-w-[1200px] px-6 py-12">
              <div className="mb-12 flex flex-col gap-10 sm:flex-row sm:items-start sm:justify-between">
                <div className="space-y-3">
                  <div className="flex items-center gap-2.5">
                    <BrandMark alt="" size={22} />
                    <span className="text-[16px] lowercase leading-none tracking-[-0.025em] text-foreground">
                      buzzr<span className="text-accent">.</span>
                    </span>
                  </div>
                  <p className="font-mono text-[12px] uppercase tracking-[0.1em] leading-[2] text-muted">
                    Rate the game.
                  </p>
                  <p className="max-w-[260px] text-[14px] leading-[1.43] tracking-[0.1px] text-muted">
                    Rate sports games by entertainment, not just the score. Built by Humyn LLC.
                  </p>
                </div>

                <div className="flex flex-wrap gap-x-12 gap-y-8">
                  <div className="space-y-3">
                    <p className="font-mono text-[12px] uppercase tracking-[0.1em] leading-[2] text-muted">Product</p>
                    <ul className="space-y-2 text-[14px] tracking-[-0.025em]">
                      <li><a href={APP_STORE_URL} target="_blank" rel="noopener noreferrer" className="text-muted transition-colors hover:text-foreground link-underline">Get the App</a></li>
                      <li><a href={DOCS_URL} target="_blank" rel="noopener noreferrer" className="text-muted transition-colors hover:text-foreground link-underline">Docs</a></li>
                      <li><Link href="/blog" className="text-muted transition-colors hover:text-foreground link-underline">Blog</Link></li>
                      <li><Link href="/support" className="text-muted transition-colors hover:text-foreground link-underline">Support</Link></li>
                    </ul>
                  </div>
                  <div className="space-y-3">
                    <p className="font-mono text-[12px] uppercase tracking-[0.1em] leading-[2] text-muted">Legal</p>
                    <ul className="space-y-2 text-[14px] tracking-[-0.025em]">
                      <li><Link href="/privacy" className="text-muted transition-colors hover:text-foreground link-underline">Privacy</Link></li>
                      <li><Link href="/terms" className="text-muted transition-colors hover:text-foreground link-underline">Terms</Link></li>
                      <li><Link href="/delete-account" className="text-muted transition-colors hover:text-foreground link-underline">Delete Account</Link></li>
                    </ul>
                  </div>
                  <div className="space-y-3">
                    <p className="font-mono text-[12px] uppercase tracking-[0.1em] leading-[2] text-muted">Social</p>
                    <ul className="space-y-2 text-[14px] tracking-[-0.025em]">
                      <li><a href={DISCORD_URL} target="_blank" rel="noopener noreferrer" className="text-muted transition-colors hover:text-foreground link-underline">Discord</a></li>
                      <li><a href={TWITTER_URL} target="_blank" rel="noopener noreferrer" className="text-muted transition-colors hover:text-foreground link-underline">X / Twitter</a></li>
                      <li><a href={INSTAGRAM_URL} target="_blank" rel="noopener noreferrer" className="text-muted transition-colors hover:text-foreground link-underline">Instagram</a></li>
                    </ul>
                  </div>
                </div>
              </div>

              <div className="divider-hairline mb-6" aria-hidden />
              <div className="flex flex-wrap items-center justify-between gap-2 font-mono text-[12px] tracking-[0.1em] leading-[2] text-muted">
                <span>© {new Date().getFullYear()} HUMYN LLC. ALL RIGHTS RESERVED.</span>
                <p className="max-w-sm text-left sm:text-right">{BUZZR_TV_DISCLAIMER}</p>
              </div>
            </div>
          </footer>
        </div>
        <Analytics />
      </body>
    </html>
  );
}
