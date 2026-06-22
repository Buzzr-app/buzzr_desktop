/**
 * League logo resolver.
 *
 * Local bundled marks win because they are the most stable. Provider-backed
 * marks mirror the mobile app resolver for leagues that do not have local
 * verified assets yet. If a league-level mark is ambiguous, the UI should keep
 * using a text chip instead of inventing one.
 */
export const LEAGUE_LOGOS: Record<string, string> = {
  NBA:          '/leagues/nba.svg',
  WNBA:         '/leagues/wnba.svg',
  NCAAM:        '/leagues/ncaam.svg',
  NFL:          '/leagues/nfl.svg',
  MLB:          '/leagues/mlb.svg',
  NHL:          '/leagues/nhl.svg',
  EPL:          '/leagues/epl.svg',
  'LA LIGA':    '/leagues/la-liga.svg',
  BUNDESLIGA:   '/leagues/bundesliga.svg',
  'SERIE A':    '/leagues/serie-a.svg',
  'LIGUE 1':    '/leagues/ligue-1.svg',
  MLS:          '/leagues/mls.svg',
  'LIGA MX':    '/leagues/liga-mx.svg',
  NWSL:         '/leagues/nwsl.svg',
  UCL:          '/leagues/ucl.svg',
  'WORLD CUP':  '/leagues/world-cup.svg',
  F1:           '/leagues/f1.svg',
  NASCAR:       '/leagues/nascar.svg',
  UFC:          '/leagues/ufc.svg',
  ATP:          '/leagues/atp.svg',
  WTA:          '/leagues/wta.svg',
  LoL:          '/leagues/lol.svg',
  VALORANT:     '/leagues/valorant.svg',
  CS2:          '/leagues/cs2.svg',
  'DOTA 2':     '/leagues/dota2.svg'
};

const NCAA_LOGO =
  'https://upload.wikimedia.org/wikipedia/commons/d/dd/NCAA_logo.svg';
const ESPN_SOCCER_LOGOS = 'https://a.espncdn.com/i/leaguelogos/soccer/500';

export const PROVIDER_LEAGUE_LOGOS: Record<string, string> = {
  NCAAW: NCAA_LOGO,
  NCAAF: NCAA_LOGO,
  WWC: `${ESPN_SOCCER_LOGOS}/60.png`,
  'COPA AMÉRICA': `${ESPN_SOCCER_LOGOS}/83.png`,
  EUROS: `${ESPN_SOCCER_LOGOS}/74.png`,
  AFCON: `${ESPN_SOCCER_LOGOS}/76.png`,
  'ASIAN CUP':
    'https://a.espncdn.com/combiner/i?img=/i/leaguelogos/soccer/500/2243.png',
  INDYCAR:
    'https://upload.wikimedia.org/wikipedia/commons/f/ff/IndyCar_Series_textlogo.svg',
  MOTOGP:
    'https://upload.wikimedia.org/wikipedia/commons/f/f9/MotoGP_logo_%282024%29.svg',
  IPL:
    'https://upload.wikimedia.org/wikipedia/en/8/84/Indian_Premier_League_Official_Logo.svg',
  PSL:
    'https://upload.wikimedia.org/wikipedia/commons/4/4c/Pakistan_Super_League_Logo.svg',
  URC:
    'https://upload.wikimedia.org/wikipedia/en/0/07/United_Rugby_Championship_logo.svg'
};

export function getLeagueLogo(label: string): string | undefined {
  return LEAGUE_LOGOS[label] ?? PROVIDER_LEAGUE_LOGOS[label];
}

export function hasLocalLeagueLogo(label: string): boolean {
  return Boolean(LEAGUE_LOGOS[label]);
}

export function isRemoteLeagueLogo(src: string): boolean {
  return src.startsWith('https://');
}
