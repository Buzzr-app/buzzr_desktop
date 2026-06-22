import {
  LEAGUES,
  SPORT_LABELS,
  type League,
  type LeagueSport
} from '@/src/lib/constants';
import { getLeagueLogo } from '@/src/lib/leagueLogos';

export interface LeagueMedia {
  eyebrow: string;
  title: string;
  description: string;
  posterSrc: string;
  posterAlt: string;
  youtubeId: string | null;
  fallbackUrl: string | null;
}

export interface LeagueOrbitItem {
  league: League;
  sportLabel: string;
  logo: string | null;
  fallbackLabel: string;
  media: LeagueMedia;
}

const POSTER_BY_SPORT: Record<LeagueSport, string> = {
  basketball: '/app-screens/games.png',
  football: '/app-screens/dashboard.png',
  baseball: '/app-screens/games.png',
  hockey: '/app-screens/leagues.png',
  soccer: '/app-screens/feed.png',
  international: '/app-screens/leagues.png',
  motor: '/app-screens/dashboard.png',
  combat: '/app-screens/rate.png',
  tennis: '/app-screens/games.png',
  esports: '/app-screens/feed.png',
  cricket: '/app-screens/leagues.png',
  rugby: '/app-screens/leagues.png'
};

const VERIFIED_YOUTUBE_IDS: Readonly<Record<string, string>> = {};

const OFFICIAL_SOURCE_BY_LEAGUE: Readonly<Record<string, string>> = {
  NBA: 'https://www.nba.com',
  WNBA: 'https://www.wnba.com',
  NCAAM: 'https://www.ncaa.com/sports/basketball-men/d1',
  NCAAW: 'https://www.ncaa.com/sports/basketball-women/d1',
  NFL: 'https://www.nfl.com',
  NCAAF: 'https://www.ncaa.com/sports/football/fbs',
  MLB: 'https://www.mlb.com',
  NHL: 'https://www.nhl.com',
  EPL: 'https://www.premierleague.com',
  'LA LIGA': 'https://www.laliga.com',
  BUNDESLIGA: 'https://www.bundesliga.com',
  'SERIE A': 'https://www.legaseriea.it',
  'LIGUE 1': 'https://www.ligue1.com',
  MLS: 'https://www.mlssoccer.com',
  'LIGA MX': 'https://ligamx.net',
  NWSL: 'https://www.nwslsoccer.com',
  UCL: 'https://www.uefa.com/uefachampionsleague',
  'WORLD CUP': 'https://www.fifa.com',
  WWC: 'https://www.fifa.com',
  'COPA AMÉRICA': 'https://www.conmebol.com/copa-america',
  EUROS: 'https://www.uefa.com/euro',
  AFCON: 'https://www.cafonline.com',
  'ASIAN CUP': 'https://www.the-afc.com',
  F1: 'https://www.formula1.com',
  NASCAR: 'https://www.nascar.com',
  INDYCAR: 'https://www.indycar.com',
  MOTOGP: 'https://www.motogp.com',
  UFC: 'https://www.ufc.com',
  BOXING: 'https://www.wbcboxing.com',
  ATP: 'https://www.atptour.com',
  WTA: 'https://www.wtatennis.com',
  LoL: 'https://lolesports.com',
  VALORANT: 'https://valorantesports.com',
  CS2: 'https://www.counter-strike.net',
  'DOTA 2': 'https://www.dota2.com/esports',
  IPL: 'https://www.iplt20.com',
  BBL: 'https://www.cricket.com.au/big-bash',
  PSL: 'https://www.psl-t20.com',
  CPL: 'https://www.cplt20.com',
  'THE HUNDRED': 'https://www.thehundred.com',
  CWC: 'https://www.icc-cricket.com',
  'INTL CRICKET': 'https://www.icc-cricket.com',
  'SIX NATIONS': 'https://www.sixnationsrugby.com',
  PREMIERSHIP: 'https://www.premiershiprugby.com',
  'TOP 14': 'https://top14.lnr.fr',
  'RUGBY WC': 'https://www.rugbyworldcup.com',
  URC: 'https://www.unitedrugby.com',
  'SUPER RUGBY': 'https://super.rugby/superrugby',
  'RUGBY CHAMP': 'https://super.rugby/therugbychampionship'
};

function getVerifiedYoutubeId(label: string) {
  return VERIFIED_YOUTUBE_IDS[label] ?? null;
}

function buildLeagueMedia(league: League): LeagueMedia {
  const sportLabel = SPORT_LABELS[league.sport];

  return {
    eyebrow: `${sportLabel} coverage`,
    title: `${league.label} on Buzzr`,
    description: `${league.long} is part of the Buzzr league map with live context, ratings, dashboards, and friend activity when coverage is available.`,
    posterSrc: POSTER_BY_SPORT[league.sport],
    posterAlt: `${league.long} coverage poster`,
    youtubeId: getVerifiedYoutubeId(league.label),
    fallbackUrl: OFFICIAL_SOURCE_BY_LEAGUE[league.label] ?? null
  };
}

export function buildLeagueOrbitItems(
  leagues: ReadonlyArray<League> = LEAGUES
): LeagueOrbitItem[] {
  return leagues.map((league) => {
    const logo = getLeagueLogo(league.label) ?? null;

    return {
      league,
      sportLabel: SPORT_LABELS[league.sport],
      logo,
      fallbackLabel: league.label,
      media: buildLeagueMedia(league)
    };
  });
}

export const LEAGUE_ORBIT_ITEMS = buildLeagueOrbitItems();
