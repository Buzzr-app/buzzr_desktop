import type { Metadata } from 'next';
import {
  ALTERNATE_NAME,
  APP_STORE_URL,
  BASE_URL,
  COMPANY_NAME,
  INSTAGRAM_URL,
  SITE_NAME,
  SITE_TAGLINE,
  TWITTER_URL
} from '@/src/lib/constants';
import { ScrollRail } from '@/components/sections/ScrollRail';
import { ScrollReveal } from '@/components/ScrollReveal';
import { Hero } from '@/components/sections/Hero';
import { ScrollSection } from '@/components/sections/ScrollSection';
import { SurfacesGrid } from '@/components/sections/SurfacesGrid';
import { Highlights } from '@/components/sections/Highlights';
import { DataBento } from '@/components/sections/DataBento';
import { RateMission } from '@/components/sections/RateMission';
import { Showcase } from '@/components/sections/Showcase';
import { LeaguesWall } from '@/components/sections/LeaguesWall';
import { Faq } from '@/components/sections/Faq';
import { Reviews, REVIEWS_SUMMARY } from '@/components/sections/Reviews';
import { LatestPosts } from '@/components/sections/LatestPosts';
import { FinalCTA } from '@/components/sections/FinalCTA';
import { BRAND_ASSETS } from '@/src/lib/brandAssets';

const PAGE_TITLE = `${SITE_NAME} · Rate sports games by entertainment`;
const PAGE_DESCRIPTION =
  'Rate live sports games on how good they actually were to watch, not the final score. Swipe through 47 leagues across 12 sports, from the NBA Finals and FIFA World Cup to F1, the UFC, esports, and cricket. Free on iOS and Android.';

export const metadata: Metadata = {
  title: PAGE_TITLE,
  description: PAGE_DESCRIPTION,
  keywords: [
    'sports rating app',
    'rate sports games',
    'Letterboxd for sports',
    'entertainment score',
    'Buzzr Score',
    'live game ratings',
    'NBA Finals ratings',
    'NFL entertainment rating',
    'FIFA World Cup 2026',
    'NBA Playoffs brackets',
    'DFS bet tracker',
    'PrizePicks tracker',
    'Underdog tracker',
    'sports social app',
    'sports group chat'
  ],
  alternates: {
    canonical: '/',
    languages: { 'en-US': BASE_URL, 'x-default': BASE_URL },
    types: { 'application/rss+xml': `${BASE_URL}/blog/rss.xml` }
  },
  openGraph: {
    type: 'website',
    url: BASE_URL,
    siteName: SITE_NAME,
    title: PAGE_TITLE,
    description: PAGE_DESCRIPTION,
    locale: 'en_US'
  },
  twitter: {
    card: 'summary_large_image',
    title: PAGE_TITLE,
    description: PAGE_DESCRIPTION,
    site: '@the_real_buzzr',
    creator: '@the_real_buzzr'
  }
};

export default function HomePage() {
  const orgLd = {
    '@context': 'https://schema.org',
    '@type': 'Organization',
    name: SITE_NAME,
    alternateName: ALTERNATE_NAME,
    url: BASE_URL,
    logo: `${BASE_URL}${BRAND_ASSETS.transparent}`,
    sameAs: [TWITTER_URL, INSTAGRAM_URL]
  };

  const websiteLd = {
    '@context': 'https://schema.org',
    '@type': 'WebSite',
    name: SITE_NAME,
    alternateName: ALTERNATE_NAME,
    url: BASE_URL,
    description: PAGE_DESCRIPTION
  };

  const softwareLd = {
    '@context': 'https://schema.org',
    '@type': 'SoftwareApplication',
    name: `${SITE_NAME} ${ALTERNATE_NAME.split(' ')[1] ?? ''}`.trim(),
    alternateName: ALTERNATE_NAME,
    applicationCategory: 'SportsApplication',
    operatingSystem: ['iOS', 'Android'],
    description: PAGE_DESCRIPTION,
    url: BASE_URL,
    downloadUrl: APP_STORE_URL,
    installUrl: APP_STORE_URL,
    image: `${BASE_URL}/opengraph-image`,
    screenshot: [`${BASE_URL}/opengraph-image`],
    author: {
      '@type': 'Organization',
      name: COMPANY_NAME,
      url: BASE_URL
    },
    aggregateRating: {
      '@type': 'AggregateRating',
      ratingValue: REVIEWS_SUMMARY.rating.toFixed(1),
      reviewCount: String(REVIEWS_SUMMARY.count),
      bestRating: '5',
      worstRating: '1'
    },
    offers: {
      '@type': 'Offer',
      price: '0',
      priceCurrency: 'USD'
    },
    publisher: {
      '@type': 'Organization',
      name: SITE_NAME,
      url: BASE_URL
    }
  };

  return (
    <div className="relative">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(orgLd) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(websiteLd) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(softwareLd) }}
      />

      <Hero />
      <ScrollReveal>
        <RateMission />
      </ScrollReveal>
      <ScrollReveal>
        <Showcase />
      </ScrollReveal>
      <ScrollReveal>
        <ScrollSection />
      </ScrollReveal>
      <ScrollReveal>
        <SurfacesGrid />
      </ScrollReveal>
      <ScrollReveal>
        <ScrollRail />
      </ScrollReveal>
      <ScrollReveal>
        <Highlights />
      </ScrollReveal>
      <ScrollReveal>
        <DataBento />
      </ScrollReveal>
      <ScrollReveal>
        <LeaguesWall />
      </ScrollReveal>
      <ScrollReveal>
        <Reviews />
      </ScrollReveal>
      <ScrollReveal>
        <Faq />
      </ScrollReveal>
      <ScrollReveal>
        <LatestPosts />
      </ScrollReveal>
      <ScrollReveal>
        <FinalCTA />
      </ScrollReveal>
    </div>
  );
}
