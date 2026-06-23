import type { Metadata } from 'next';
import {
  ALTERNATE_NAME,
  APP_STORE_URL,
  BASE_URL,
  COMPANY_NAME,
  INSTAGRAM_URL,
  LEAGUE_COUNT,
  SITE_NAME,
  TWITTER_URL
} from '@/src/lib/constants';
import { ScrollRail } from '@/components/sections/ScrollRail';
import { ScrollReveal } from '@/components/ScrollReveal';
import { Hero } from '@/components/sections/Hero';
import { SurfacesGrid } from '@/components/sections/SurfacesGrid';
import { PromoReels } from '@/components/sections/PromoReels';
import { LeaguesWall } from '@/components/sections/LeaguesWall';
import { Faq } from '@/components/sections/Faq';
import { Reviews, REVIEWS_SUMMARY } from '@/components/sections/Reviews';
import { FinalCTA } from '@/components/sections/FinalCTA';
import { BRAND_ASSETS } from '@/src/lib/brandAssets';
import { OpenSource } from '@/components/sections/OpenSource';

const PAGE_TITLE = `${SITE_NAME} · Sports social app for every fan`;
const PAGE_DESCRIPTION = `Follow teams, rate live games, chat with friends, browse ${LEAGUE_COUNT} leagues, and track Buzzr Bets. Free on iOS.`;

export const metadata: Metadata = {
  title: PAGE_TITLE,
  description: PAGE_DESCRIPTION,
  keywords: [
    'AI sports social app',
    'sports rating app',
    'rate sports games',
    'AI sports feed',
    'sports dashboards',
    'sports group chat',
    'entertainment score',
    'Buzzr Score',
    'live game ratings',
    'NBA Finals ratings',
    'NFL entertainment rating',
    'FIFA World Cup 2026',
    'NBA Playoffs brackets',
    'Buzzr Bets',
    'DFS slip tracker',
    'sports social app',
    'friends sports chat'
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
      <ScrollReveal className="landing-section-reveal landing-section-reveal--first">
        <SurfacesGrid />
      </ScrollReveal>
      <ScrollReveal className="landing-section-reveal">
        <PromoReels />
      </ScrollReveal>
      <ScrollReveal className="landing-section-reveal">
        <LeaguesWall />
      </ScrollReveal>
      <ScrollReveal className="landing-section-reveal">
        <ScrollRail />
      </ScrollReveal>
      <ScrollReveal className="landing-section-reveal">
        <OpenSource />
      </ScrollReveal>
      <ScrollReveal className="landing-section-reveal">
        <Reviews />
      </ScrollReveal>
      <ScrollReveal className="landing-section-reveal">
        <Faq />
      </ScrollReveal>
      <ScrollReveal className="landing-section-reveal">
        <FinalCTA />
      </ScrollReveal>
    </div>
  );
}
