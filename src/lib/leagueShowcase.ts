import {
  type League,
  type LeagueSport
} from '@/src/lib/constants';
import { getTeamLogo } from '@/src/lib/teamLogos';

type TeamLogoLeague = 'nba' | 'wnba' | 'nfl' | 'mlb' | 'nhl' | 'mls' | 'soccer';

export type ShowcaseMark =
  | {
      code: string;
      kind: 'image';
      label: string;
      src: string;
    }
  | {
      code: string;
      hue: number;
      kind: 'crest';
      label: string;
    };

export type ShowcaseTeam = {
  code: string;
  mark: ShowcaseMark;
  name: string;
};

export type ShowcasePlayer = {
  code: string;
  name: string;
  role: string;
};

export type LeagueShowcase = {
  players: readonly ShowcasePlayer[];
  teams: readonly ShowcaseTeam[];
};

type TeamSeed = {
  code: string;
  logoCode?: string;
  logoLeague?: TeamLogoLeague;
  name: string;
};

const SHOWCASE_TEAM_COUNT = 12;

function hashHue(value: string) {
  let hash = 0;

  for (const char of value) {
    hash = (hash * 31 + char.charCodeAt(0)) % 360;
  }

  return hash;
}

function initialsFor(value: string, maxLength = 3) {
  const words = value
    .replace(/[^a-zA-Z0-9 ]/g, ' ')
    .trim()
    .split(/\s+/)
    .filter(Boolean);
  const initials =
    words.length > 1
      ? words.map((word) => word[0]).join('')
      : words[0] ?? value;
  const compact = initials.replace(/[^a-zA-Z0-9]/g, '').toUpperCase();

  return compact.slice(0, maxLength) || 'BZ';
}

export function createCrestMark(label: string, code = initialsFor(label)): ShowcaseMark {
  return {
    code,
    hue: hashHue(label),
    kind: 'crest',
    label
  };
}

export function createImageMark(src: string, label: string, code = initialsFor(label)): ShowcaseMark {
  return {
    code,
    kind: 'image',
    label,
    src
  };
}

export function createLeagueVisualMark(league: League, logo: string | null): ShowcaseMark {
  return logo
    ? createImageMark(logo, league.long, initialsFor(league.label))
    : createCrestMark(league.long, initialsFor(league.label));
}

function team(
  name: string,
  code = initialsFor(name),
  logoLeague?: TeamLogoLeague,
  logoCode = code
): TeamSeed {
  return { code, logoCode, logoLeague, name };
}

function teamFromSeed(seed: TeamSeed): ShowcaseTeam {
  const mark = seed.logoLeague
    ? createImageMark(getTeamLogo(seed.logoLeague, seed.logoCode ?? seed.code), seed.name, seed.code)
    : createCrestMark(seed.name, seed.code);

  return {
    code: seed.code,
    mark,
    name: seed.name
  };
}

function player(name: string, role: string, code = initialsFor(name, 2)): ShowcasePlayer {
  return { code, name, role };
}

const TEAM_SEEDS_BY_LEAGUE: Readonly<Partial<Record<string, readonly TeamSeed[]>>> = {
  NBA: [
    team('New York Knicks', 'NYK', 'nba', 'ny'),
    team('Los Angeles Lakers', 'LAL', 'nba', 'lal'),
    team('Boston Celtics', 'BOS', 'nba', 'bos'),
    team('Golden State Warriors', 'GSW', 'nba', 'gs'),
    team('Chicago Bulls', 'CHI', 'nba', 'chi'),
    team('Miami Heat', 'MIA', 'nba', 'mia'),
    team('Dallas Mavericks', 'DAL', 'nba', 'dal'),
    team('Detroit Pistons', 'DET', 'nba', 'det'),
    team('Oklahoma City Thunder', 'OKC', 'nba', 'okc'),
    team('Denver Nuggets', 'DEN', 'nba', 'den'),
    team('Phoenix Suns', 'PHX', 'nba', 'phx'),
    team('San Antonio Spurs', 'SAS', 'nba', 'sa')
  ],
  WNBA: [
    team('New York Liberty', 'NYL', 'wnba', 'ny'),
    team('Las Vegas Aces', 'LVA', 'wnba', 'lv'),
    team('Minnesota Lynx', 'MIN', 'wnba', 'min'),
    team('Seattle Storm', 'SEA', 'wnba', 'sea'),
    team('Indiana Fever', 'IND', 'wnba', 'ind'),
    team('Phoenix Mercury', 'PHX', 'wnba', 'phx'),
    team('Chicago Sky', 'CHI', 'wnba', 'chi'),
    team('Dallas Wings', 'DAL', 'wnba', 'dal'),
    team('Atlanta Dream', 'ATL', 'wnba', 'atl'),
    team('Connecticut Sun', 'CON', 'wnba', 'con'),
    team('Washington Mystics', 'WAS', 'wnba', 'was'),
    team('Los Angeles Sparks', 'LAS', 'wnba', 'la')
  ],
  NFL: [
    team('Kansas City Chiefs', 'KC', 'nfl', 'kc'),
    team('Philadelphia Eagles', 'PHI', 'nfl', 'phi'),
    team('Dallas Cowboys', 'DAL', 'nfl', 'dal'),
    team('San Francisco 49ers', 'SF', 'nfl', 'sf'),
    team('Buffalo Bills', 'BUF', 'nfl', 'buf'),
    team('Detroit Lions', 'DET', 'nfl', 'det'),
    team('Green Bay Packers', 'GB', 'nfl', 'gb'),
    team('New York Jets', 'NYJ', 'nfl', 'nyj'),
    team('Baltimore Ravens', 'BAL', 'nfl', 'bal'),
    team('Cincinnati Bengals', 'CIN', 'nfl', 'cin'),
    team('Los Angeles Rams', 'LAR', 'nfl', 'lar'),
    team('Miami Dolphins', 'MIA', 'nfl', 'mia')
  ],
  MLB: [
    team('New York Yankees', 'NYY', 'mlb', 'nyy'),
    team('Los Angeles Dodgers', 'LAD', 'mlb', 'lad'),
    team('Boston Red Sox', 'BOS', 'mlb', 'bos'),
    team('Chicago Cubs', 'CHC', 'mlb', 'chc'),
    team('New York Mets', 'NYM', 'mlb', 'nym'),
    team('Philadelphia Phillies', 'PHI', 'mlb', 'phi'),
    team('Houston Astros', 'HOU', 'mlb', 'hou'),
    team('Atlanta Braves', 'ATL', 'mlb', 'atl'),
    team('San Diego Padres', 'SD', 'mlb', 'sd'),
    team('Seattle Mariners', 'SEA', 'mlb', 'sea'),
    team('St. Louis Cardinals', 'STL', 'mlb', 'stl'),
    team('Toronto Blue Jays', 'TOR', 'mlb', 'tor')
  ],
  NHL: [
    team('Boston Bruins', 'BOS', 'nhl', 'bos'),
    team('New York Rangers', 'NYR', 'nhl', 'nyr'),
    team('Toronto Maple Leafs', 'TOR', 'nhl', 'tor'),
    team('Detroit Red Wings', 'DET', 'nhl', 'det'),
    team('Chicago Blackhawks', 'CHI', 'nhl', 'chi'),
    team('Pittsburgh Penguins', 'PIT', 'nhl', 'pit'),
    team('Edmonton Oilers', 'EDM', 'nhl', 'edm'),
    team('Florida Panthers', 'FLA', 'nhl', 'fla'),
    team('Colorado Avalanche', 'COL', 'nhl', 'col'),
    team('Vegas Golden Knights', 'VGK', 'nhl', 'vgk'),
    team('Tampa Bay Lightning', 'TB', 'nhl', 'tb'),
    team('New Jersey Devils', 'NJ', 'nhl', 'nj')
  ],
  MLS: [
    team('Inter Miami', 'MIA', 'mls', 'mia'),
    team('LAFC', 'LAFC', 'mls', 'lafc'),
    team('Seattle Sounders', 'SEA', 'mls', 'sea'),
    team('Atlanta United', 'ATL', 'mls', 'atl'),
    team('Portland Timbers', 'POR', 'mls', 'por'),
    team('New York City FC', 'NYC', 'mls', 'nyc'),
    team('LA Galaxy', 'LAG', 'mls', 'la'),
    team('FC Cincinnati', 'CIN', 'mls', 'cin'),
    team('Columbus Crew', 'CLB', 'mls', 'clb'),
    team('Philadelphia Union', 'PHI', 'mls', 'phi'),
    team('Austin FC', 'ATX', 'mls', 'atx'),
    team('St. Louis City', 'STL', 'mls', 'stl')
  ],
  EPL: [
    team('Arsenal', 'ARS'),
    team('Chelsea', 'CHE'),
    team('Liverpool', 'LIV'),
    team('Manchester City', 'MCI'),
    team('Manchester United', 'MUN'),
    team('Tottenham Hotspur', 'TOT'),
    team('Newcastle United', 'NEW'),
    team('Aston Villa', 'AVL'),
    team('Brighton', 'BHA'),
    team('Everton', 'EVE'),
    team('West Ham United', 'WHU'),
    team('Crystal Palace', 'CRY')
  ],
  'LA LIGA': [
    team('Barcelona', 'BAR'),
    team('Real Madrid', 'RMA'),
    team('Atletico Madrid', 'ATM'),
    team('Athletic Club', 'ATH'),
    team('Sevilla', 'SEV'),
    team('Real Sociedad', 'RSO'),
    team('Valencia', 'VAL'),
    team('Villarreal', 'VIL'),
    team('Real Betis', 'BET'),
    team('Girona', 'GIR'),
    team('Celta Vigo', 'CEL'),
    team('Osasuna', 'OSA')
  ],
  BUNDESLIGA: [
    team('Bayern Munich', 'BAY'),
    team('Borussia Dortmund', 'BVB'),
    team('Bayer Leverkusen', 'B04'),
    team('RB Leipzig', 'RBL'),
    team('Eintracht Frankfurt', 'SGE'),
    team('Stuttgart', 'VFB'),
    team('Wolfsburg', 'WOB'),
    team('Werder Bremen', 'SVW'),
    team('Mainz', 'M05'),
    team('Freiburg', 'SCF'),
    team('Union Berlin', 'FCU'),
    team('Augsburg', 'FCA')
  ],
  'SERIE A': [
    team('Inter Milan', 'INT'),
    team('AC Milan', 'MIL'),
    team('Juventus', 'JUV'),
    team('Napoli', 'NAP'),
    team('Roma', 'ROM'),
    team('Lazio', 'LAZ'),
    team('Atalanta', 'ATA'),
    team('Fiorentina', 'FIO'),
    team('Bologna', 'BOL'),
    team('Torino', 'TOR'),
    team('Genoa', 'GEN'),
    team('Udinese', 'UDI')
  ],
  'LIGUE 1': [
    team('Paris Saint-Germain', 'PSG'),
    team('Marseille', 'OM'),
    team('Lyon', 'LYO'),
    team('Monaco', 'ASM'),
    team('Lille', 'LIL'),
    team('Rennes', 'REN'),
    team('Nice', 'NIC'),
    team('Lens', 'RCL'),
    team('Strasbourg', 'RCS'),
    team('Nantes', 'NAN'),
    team('Toulouse', 'TFC'),
    team('Montpellier', 'MON')
  ],
  UCL: [
    team('Real Madrid', 'RMA'),
    team('Manchester City', 'MCI'),
    team('Bayern Munich', 'BAY'),
    team('Barcelona', 'BAR'),
    team('Paris Saint-Germain', 'PSG'),
    team('Inter Milan', 'INT'),
    team('Arsenal', 'ARS'),
    team('Liverpool', 'LIV'),
    team('Dortmund', 'BVB'),
    team('Atletico Madrid', 'ATM'),
    team('Benfica', 'BEN'),
    team('Porto', 'POR')
  ],
  F1: [
    team('Red Bull Racing', 'RBR'),
    team('Ferrari', 'FER'),
    team('Mercedes', 'MER'),
    team('McLaren', 'MCL'),
    team('Aston Martin', 'AMR'),
    team('Alpine', 'ALP'),
    team('Williams', 'WIL'),
    team('Haas', 'HAS'),
    team('RB', 'RB'),
    team('Sauber', 'SAU'),
    team('Cadillac', 'CAD'),
    team('Audi', 'AUD')
  ],
  UFC: [
    team('Lightweight', 'LW'),
    team('Welterweight', 'WW'),
    team('Middleweight', 'MW'),
    team('Light Heavyweight', 'LHW'),
    team('Heavyweight', 'HW'),
    team('Featherweight', 'FW'),
    team('Bantamweight', 'BW'),
    team('Flyweight', 'FLY'),
    team('Women Strawweight', 'WSW'),
    team('Women Flyweight', 'WFL'),
    team('Women Bantamweight', 'WBW'),
    team('Contender Series', 'CS')
  ]
};

const TEAM_SEEDS_BY_SPORT: Readonly<Record<LeagueSport, readonly TeamSeed[]>> = {
  basketball: [
    team('Duke', 'DUK'),
    team('UConn', 'CON'),
    team('Kansas', 'KAN'),
    team('Kentucky', 'UK'),
    team('North Carolina', 'UNC'),
    team('UCLA', 'UCL'),
    team('Tennessee', 'TEN'),
    team('South Carolina', 'SC'),
    team('Iowa', 'IOW'),
    team('LSU', 'LSU'),
    team('Stanford', 'STA'),
    team('Notre Dame', 'ND')
  ],
  football: [
    team('Georgia', 'UGA'),
    team('Alabama', 'ALA'),
    team('Ohio State', 'OSU'),
    team('Michigan', 'MICH'),
    team('Texas', 'TEX'),
    team('Oregon', 'ORE'),
    team('LSU', 'LSU'),
    team('Notre Dame', 'ND'),
    team('USC', 'USC'),
    team('Penn State', 'PSU'),
    team('Clemson', 'CLEM'),
    team('Florida State', 'FSU')
  ],
  baseball: TEAM_SEEDS_BY_LEAGUE.MLB!,
  hockey: TEAM_SEEDS_BY_LEAGUE.NHL!,
  soccer: TEAM_SEEDS_BY_LEAGUE.EPL!,
  international: [
    team('United States', 'USA'),
    team('Brazil', 'BRA'),
    team('Argentina', 'ARG'),
    team('England', 'ENG'),
    team('France', 'FRA'),
    team('Spain', 'ESP'),
    team('Germany', 'GER'),
    team('Japan', 'JPN'),
    team('Mexico', 'MEX'),
    team('Canada', 'CAN'),
    team('Nigeria', 'NGA'),
    team('Australia', 'AUS')
  ],
  motor: TEAM_SEEDS_BY_LEAGUE.F1!,
  combat: TEAM_SEEDS_BY_LEAGUE.UFC!,
  tennis: [
    team('Sinner Box', 'SIN'),
    team('Alcaraz Box', 'ALC'),
    team('Djokovic Box', 'DJO'),
    team('Gauff Box', 'GAU'),
    team('Swiatek Box', 'SWI'),
    team('Sabalenka Box', 'SAB'),
    team('Osaka Box', 'OSA'),
    team('Fritz Box', 'FRI'),
    team('Pegula Box', 'PEG'),
    team('Medvedev Box', 'MED'),
    team('Rybakina Box', 'RYB'),
    team('Tiafoe Box', 'TIA')
  ],
  esports: [
    team('T1', 'T1'),
    team('Gen.G', 'GEN'),
    team('G2 Esports', 'G2'),
    team('Fnatic', 'FNC'),
    team('Cloud9', 'C9'),
    team('Team Liquid', 'TL'),
    team('Sentinels', 'SEN'),
    team('Paper Rex', 'PRX'),
    team('Natus Vincere', 'NAVI'),
    team('FaZe Clan', 'FAZE'),
    team('Vitality', 'VIT'),
    team('OG', 'OG')
  ],
  cricket: [
    team('Mumbai Indians', 'MI'),
    team('Chennai Super Kings', 'CSK'),
    team('Royal Challengers', 'RCB'),
    team('Kolkata Knight Riders', 'KKR'),
    team('Sydney Sixers', 'SIX'),
    team('Perth Scorchers', 'SCO'),
    team('Lahore Qalandars', 'LQ'),
    team('Karachi Kings', 'KK'),
    team('Trinbago Knight Riders', 'TKR'),
    team('Barbados Royals', 'BR'),
    team('London Spirit', 'LS'),
    team('Oval Invincibles', 'OVI')
  ],
  rugby: [
    team('Ireland', 'IRE'),
    team('France', 'FRA'),
    team('England', 'ENG'),
    team('Scotland', 'SCO'),
    team('Wales', 'WAL'),
    team('Italy', 'ITA'),
    team('Leinster', 'LEI'),
    team('Toulouse', 'TLS'),
    team('Saracens', 'SAR'),
    team('Crusaders', 'CRU'),
    team('Springboks', 'RSA'),
    team('All Blacks', 'NZL')
  ]
};

const PLAYERS_BY_LEAGUE: Readonly<Partial<Record<string, readonly ShowcasePlayer[]>>> = {
  NBA: [
    player('Jalen Brunson', 'Guard', 'JB'),
    player('Cade Cunningham', 'Creator', 'CC'),
    player('Nikola Jokic', 'Center', 'NJ'),
    player('Stephen Curry', 'Guard', 'SC')
  ],
  WNBA: [
    player('Aja Wilson', 'Forward', 'AW'),
    player('Breanna Stewart', 'Forward', 'BS'),
    player('Caitlin Clark', 'Guard', 'CC'),
    player('Napheesa Collier', 'Forward', 'NC')
  ],
  NFL: [
    player('Patrick Mahomes', 'Quarterback', 'PM'),
    player('Jalen Hurts', 'Quarterback', 'JH'),
    player('Justin Jefferson', 'Receiver', 'JJ'),
    player('Micah Parsons', 'Edge', 'MP')
  ],
  MLB: [
    player('Aaron Judge', 'Slugger', 'AJ'),
    player('Shohei Ohtani', 'Two-way', 'SO'),
    player('Bryce Harper', 'Bat', 'BH'),
    player('Juan Soto', 'Bat', 'JS')
  ],
  NHL: [
    player('Connor McDavid', 'Center', 'CM'),
    player('Auston Matthews', 'Center', 'AM'),
    player('David Pastrnak', 'Wing', 'DP'),
    player('Cale Makar', 'Defense', 'CMK')
  ],
  MLS: [
    player('Lionel Messi', 'Creator', 'LM'),
    player('Denis Bouanga', 'Forward', 'DB'),
    player('Luciano Acosta', 'Creator', 'LA'),
    player('Jordan Morris', 'Forward', 'JM')
  ]
};

const PLAYERS_BY_SPORT: Readonly<Record<LeagueSport, readonly ShowcasePlayer[]>> = {
  basketball: [
    player('Paige Bueckers', 'Guard', 'PB'),
    player('Cooper Flagg', 'Forward', 'CF'),
    player('JuJu Watkins', 'Wing', 'JW'),
    player('RJ Davis', 'Guard', 'RD')
  ],
  football: [
    player('Arch Manning', 'Quarterback', 'AM'),
    player('Jeremiah Smith', 'Receiver', 'JS'),
    player('Caleb Downs', 'Safety', 'CD'),
    player('Dillon Gabriel', 'Quarterback', 'DG')
  ],
  baseball: PLAYERS_BY_LEAGUE.MLB!,
  hockey: PLAYERS_BY_LEAGUE.NHL!,
  soccer: [
    player('Erling Haaland', 'Striker', 'EH'),
    player('Kylian Mbappe', 'Forward', 'KM'),
    player('Bukayo Saka', 'Wing', 'BS'),
    player('Aitana Bonmati', 'Midfield', 'AB')
  ],
  international: [
    player('Lionel Messi', 'Creator', 'LM'),
    player('Kylian Mbappe', 'Forward', 'KM'),
    player('Sophia Smith', 'Forward', 'SS'),
    player('Marta', 'Forward', 'MAR')
  ],
  motor: [
    player('Max Verstappen', 'Driver', 'MV'),
    player('Lewis Hamilton', 'Driver', 'LH'),
    player('Lando Norris', 'Driver', 'LN'),
    player('Charles Leclerc', 'Driver', 'CL')
  ],
  combat: [
    player('Islam Makhachev', 'Lightweight', 'IM'),
    player('Jon Jones', 'Heavyweight', 'JJ'),
    player('Zhang Weili', 'Strawweight', 'ZW'),
    player('Alex Pereira', 'Striker', 'AP')
  ],
  tennis: [
    player('Carlos Alcaraz', 'ATP', 'CA'),
    player('Jannik Sinner', 'ATP', 'JS'),
    player('Iga Swiatek', 'WTA', 'IS'),
    player('Coco Gauff', 'WTA', 'CG')
  ],
  esports: [
    player('Faker', 'Mid', 'FAK'),
    player('TenZ', 'Duelist', 'TNZ'),
    player('m0NESY', 'AWP', 'M0'),
    player('Yatoro', 'Carry', 'YAT')
  ],
  cricket: [
    player('Virat Kohli', 'Batter', 'VK'),
    player('Babar Azam', 'Batter', 'BA'),
    player('Ellyse Perry', 'All-rounder', 'EP'),
    player('Rashid Khan', 'Bowler', 'RK')
  ],
  rugby: [
    player('Antoine Dupont', 'Scrum-half', 'AD'),
    player('Maro Itoje', 'Lock', 'MI'),
    player('Siya Kolisi', 'Flanker', 'SK'),
    player('Ardie Savea', 'Forward', 'AS')
  ]
};

function normalizeTeams(seeds: readonly TeamSeed[]) {
  return Array.from({ length: SHOWCASE_TEAM_COUNT }, (_, index) =>
    teamFromSeed(seeds[index % seeds.length])
  );
}

export function getLeagueShowcase(league: League): LeagueShowcase {
  const seeds = TEAM_SEEDS_BY_LEAGUE[league.label] ?? TEAM_SEEDS_BY_SPORT[league.sport];

  return {
    players: PLAYERS_BY_LEAGUE[league.label] ?? PLAYERS_BY_SPORT[league.sport],
    teams: normalizeTeams(seeds)
  };
}
