import { BASE_URL, TWITTER_URL, INSTAGRAM_URL, COMPANY_NAME } from './constants';

export type Author = {
  name: string;
  /** Stable URL identifying this author across the site. */
  url: string;
  /** Short bio for E-E-A-T + author boxes. */
  bio: string;
  /** schema.org `sameAs` profile URLs. */
  sameAs: string[];
};

const EDITORIAL: Author = {
  name: 'Buzzr Editorial',
  url: `${BASE_URL}/about`,
  bio: `The Buzzr Editorial team, engineers, product designers, and sports fans at ${COMPANY_NAME} writing about the AI-native sports social app we ship every week.`,
  sameAs: [TWITTER_URL, INSTAGRAM_URL]
};

const AUTHORS: Record<string, Author> = {
  'Buzzr Editorial': EDITORIAL
};

export function getAuthor(name: string): Author {
  return AUTHORS[name] ?? { name, url: BASE_URL, bio: '', sameAs: [] };
}

/** schema.org Person object for an author. */
export function authorJsonLd(name: string) {
  const a = getAuthor(name);
  return {
    '@type': 'Person',
    name: a.name,
    url: a.url,
    sameAs: a.sameAs
  } as const;
}
