export const COMPANY_NAME = 'Humyn LLC';

export const SITE_NAME = 'Buzzr';

/** Used in schema `alternateName` and brand copy to disambiguate from
 *  BUZZR TV (Fremantle) and cement the sports social app identity. */
export const ALTERNATE_NAME = 'Buzzr Sports';

export const SITE_TAGLINE = 'Sports social app for every fan.';

export const SITE_DESCRIPTION =
  'Buzzr brings live ratings, team dashboards, friends and chat, leagues, and Buzzr Bets into one sports app.';

export const BASE_URL = process.env.NEXT_PUBLIC_SITE_URL ?? 'https://www.getbuzzr.online';

export const SUPPORT_EMAIL = process.env.SUPPORT_EMAIL ?? 'support@getbuzzr.online';

export const PRIVACY_URL =
  process.env.PRIVACY_URL ?? `${BASE_URL}/privacy`;

export const TERMS_URL =
  process.env.TERMS_URL ?? `${BASE_URL}/terms`;

export const SUPPORT_URL =
  process.env.SUPPORT_URL ?? `${BASE_URL}/support`;

export const DELETE_ACCOUNT_URL =
  process.env.DELETE_ACCOUNT_URL ?? `${BASE_URL}/delete-account`;

export const APP_STORE_URL =
  process.env.NEXT_PUBLIC_APP_STORE_URL ??
  'https://apps.apple.com/us/app/buzzr-sports/id6760628256';

export const BRANCH_LINK_BASE =
  process.env.NEXT_PUBLIC_BRANCH_LINK_BASE ?? '';

export const APPLE_APP_ID =
  process.env.APPLE_APP_ID ?? 'Z4ZUZ884U3.com.buzzr.app';

export const ANDROID_PACKAGE_NAME =
  process.env.ANDROID_PACKAGE_NAME ?? 'com.buzzr.app';

export const ANDROID_SHA256_CERT_FINGERPRINTS = (
  process.env.ANDROID_SHA256_CERT_FINGERPRINTS ??
  process.env.GOOGLE_PLAY_SHA256_CERT_FINGERPRINTS ??
  'A2:18:92:57:95:12:D4:F9:8D:53:ED:3B:99:FB:76:DF:ED:29:76:C2:86:57:23:57:21:55:7C:27:83:CA:11:23'
)
  .split(',')
  .map((fingerprint) => fingerprint.trim())
  .filter(Boolean);

export const DISCORD_URL =
  process.env.NEXT_PUBLIC_DISCORD_URL ?? 'https://discord.gg/NbgfYpQPRv';

export const DOCS_URL =
  process.env.NEXT_PUBLIC_DOCS_URL ?? 'https://docs.getbuzzr.online';

export const FEEDBACK_TALLY_URL =
  process.env.FEEDBACK_TALLY_URL ?? 'https://tally.so/r/aQB6rq';

export const BUZZR_TV_DISCLAIMER =
  'Buzzr is not affiliated with BUZZR TV (Fremantle).';

export const TRUST_STRIP =
  'AI feed · Scroll · Dashboards · Friends and Chat · Leagues · Buzzr Bets';

/** Leagues & competitions Buzzr covers. 49 leagues across 12 sports.
 *  Single source of truth, mirrored from the mobile app's league-coverage.ts.
 *  Grouped into sports for the landing page Leagues Wall; flat list drives the Marquee.
 *  Status tiers map app freshness:
 *    - healthy:   live scores + schedule, primary surface
 *    - beta:      live scores + schedule, still hardening
 *    - news-only: news + standings, no live scores yet
 *  Coverage status varies, open the changelog or docs for current state per league. */
export type LeagueSport =
  | 'basketball'
  | 'football'
  | 'baseball'
  | 'hockey'
  | 'soccer'
  | 'international'
  | 'motor'
  | 'combat'
  | 'tennis'
  | 'esports'
  | 'cricket'
  | 'rugby';

export type LeagueStatus = 'healthy' | 'beta' | 'news-only';

export interface League {
  label: string;
  long: string;
  sport: LeagueSport;
  status: LeagueStatus;
}

export const LEAGUES: ReadonlyArray<League> = [
  // Basketball (4)
  { label: 'NBA',          long: 'National Basketball Association',         sport: 'basketball',    status: 'healthy' },
  { label: 'WNBA',         long: 'Women’s National Basketball Association', sport: 'basketball',    status: 'beta' },
  { label: 'NCAAM',        long: 'NCAA Men’s Basketball',                   sport: 'basketball',    status: 'healthy' },
  { label: 'NCAAW',        long: 'NCAA Women’s Basketball',                 sport: 'basketball',    status: 'beta' },
  // Football (2)
  { label: 'NFL',          long: 'National Football League',                sport: 'football',      status: 'healthy' },
  { label: 'NCAAF',        long: 'NCAA Football',                           sport: 'football',      status: 'healthy' },
  // Baseball (1)
  { label: 'MLB',          long: 'Major League Baseball',                   sport: 'baseball',      status: 'healthy' },
  // Hockey (1)
  { label: 'NHL',          long: 'National Hockey League',                  sport: 'hockey',        status: 'healthy' },
  // Soccer, domestic leagues (9)
  { label: 'EPL',          long: 'English Premier League',                  sport: 'soccer',        status: 'healthy' },
  { label: 'LA LIGA',      long: 'La Liga',                                 sport: 'soccer',        status: 'beta' },
  { label: 'BUNDESLIGA',   long: 'Bundesliga',                              sport: 'soccer',        status: 'beta' },
  { label: 'SERIE A',      long: 'Serie A',                                 sport: 'soccer',        status: 'beta' },
  { label: 'LIGUE 1',      long: 'Ligue 1',                                 sport: 'soccer',        status: 'beta' },
  { label: 'MLS',          long: 'Major League Soccer',                     sport: 'soccer',        status: 'healthy' },
  { label: 'LIGA MX',      long: 'Liga MX',                                 sport: 'soccer',        status: 'beta' },
  { label: 'NWSL',         long: 'National Women’s Soccer League',          sport: 'soccer',        status: 'beta' },
  { label: 'UCL',          long: 'UEFA Champions League',                   sport: 'soccer',        status: 'beta' },
  // International tournaments (6)
  { label: 'WORLD CUP',    long: 'FIFA World Cup',                          sport: 'international', status: 'beta' },
  { label: 'WWC',          long: 'FIFA Women’s World Cup',                  sport: 'international', status: 'beta' },
  { label: 'COPA AMÉRICA', long: 'Copa América',                            sport: 'international', status: 'beta' },
  { label: 'EUROS',        long: 'UEFA European Championship',              sport: 'international', status: 'beta' },
  { label: 'AFCON',        long: 'Africa Cup of Nations',                   sport: 'international', status: 'beta' },
  { label: 'ASIAN CUP',    long: 'AFC Asian Cup',                           sport: 'international', status: 'beta' },
  // Motor (4)
  { label: 'F1',           long: 'Formula 1',                               sport: 'motor',         status: 'healthy' },
  { label: 'NASCAR',       long: 'NASCAR Cup Series',                       sport: 'motor',         status: 'beta' },
  { label: 'INDYCAR',      long: 'IndyCar Series',                          sport: 'motor',         status: 'beta' },
  { label: 'MOTOGP',       long: 'MotoGP',                                  sport: 'motor',         status: 'beta' },
  // Combat (2)
  { label: 'UFC',          long: 'Ultimate Fighting Championship',          sport: 'combat',        status: 'beta' },
  { label: 'BOXING',       long: 'Professional Boxing',                     sport: 'combat',        status: 'beta' },
  // Tennis (2)
  { label: 'ATP',          long: 'ATP Tour',                                sport: 'tennis',        status: 'beta' },
  { label: 'WTA',          long: 'WTA Tour',                                sport: 'tennis',        status: 'beta' },
  // Esports (4)
  { label: 'LoL',          long: 'League of Legends',                       sport: 'esports',       status: 'healthy' },
  { label: 'VALORANT',     long: 'Valorant',                                sport: 'esports',       status: 'healthy' },
  { label: 'CS2',          long: 'Counter-Strike 2',                        sport: 'esports',       status: 'healthy' },
  { label: 'DOTA 2',       long: 'Dota 2',                                  sport: 'esports',       status: 'healthy' },
  // Cricket (7)
  { label: 'IPL',          long: 'Indian Premier League',                   sport: 'cricket',       status: 'healthy' },
  { label: 'BBL',          long: 'Big Bash League',                         sport: 'cricket',       status: 'healthy' },
  { label: 'PSL',          long: 'Pakistan Super League',                   sport: 'cricket',       status: 'healthy' },
  { label: 'CPL',          long: 'Caribbean Premier League',                sport: 'cricket',       status: 'healthy' },
  { label: 'THE HUNDRED',  long: 'The Hundred',                             sport: 'cricket',       status: 'healthy' },
  { label: 'CWC',          long: 'ICC Cricket World Cup',                   sport: 'cricket',       status: 'healthy' },
  { label: 'INTL CRICKET', long: 'International Cricket',                   sport: 'cricket',       status: 'healthy' },
  // Rugby (7)
  { label: 'SIX NATIONS',  long: 'Six Nations Championship',                sport: 'rugby',         status: 'beta' },
  { label: 'PREMIERSHIP',  long: 'Premiership Rugby',                       sport: 'rugby',         status: 'beta' },
  { label: 'TOP 14',       long: 'Top 14',                                  sport: 'rugby',         status: 'beta' },
  { label: 'RUGBY WC',     long: 'Rugby World Cup',                         sport: 'rugby',         status: 'beta' },
  { label: 'URC',          long: 'United Rugby Championship',               sport: 'rugby',         status: 'news-only' },
  { label: 'SUPER RUGBY',  long: 'Super Rugby Pacific',                     sport: 'rugby',         status: 'news-only' },
  { label: 'RUGBY CHAMP',  long: 'Rugby Championship',                      sport: 'rugby',         status: 'news-only' }
];

/** Derived single source of truth for "N leagues" copy across the site. */
export const LEAGUE_COUNT = LEAGUES.length;

export const SPORT_LABELS: Record<LeagueSport, string> = {
  basketball:    'Basketball',
  football:      'Football',
  baseball:      'Baseball',
  hockey:        'Hockey',
  soccer:        'Soccer',
  international: 'International',
  motor:         'Motor',
  combat:        'Combat',
  tennis:        'Tennis',
  esports:       'Esports',
  cricket:       'Cricket',
  rugby:         'Rugby'
};

export const SPORT_ORDER: readonly LeagueSport[] = [
  'basketball',
  'football',
  'baseball',
  'hockey',
  'soccer',
  'international',
  'motor',
  'combat',
  'tennis',
  'esports',
  'cricket',
  'rugby'
];

/** Social, overridable via env */
export const TWITTER_URL =
  process.env.NEXT_PUBLIC_TWITTER_URL ?? 'https://x.com/the_real_buzzr';
export const INSTAGRAM_URL =
  process.env.NEXT_PUBLIC_INSTAGRAM_URL ?? 'https://www.instagram.com/buzzr_official/';
