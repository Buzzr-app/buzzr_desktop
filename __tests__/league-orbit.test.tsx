/** @jest-environment jsdom */
import { fireEvent, render, screen } from '@testing-library/react';
import { LeagueOrbit } from '@/components/sections/LeagueOrbit';
import { VideoSurface } from '@/components/ui/VideoSurface';
import { LEAGUES } from '@/src/lib/constants';
import { buildLeagueOrbitItems } from '@/src/lib/leagueMedia';
import { getLeagueLogo } from '@/src/lib/leagueLogos';
import { getLeagueShowcase } from '@/src/lib/leagueShowcase';

// Official sample from the YouTube IFrame Player API documentation.
const YOUTUBE_IFRAME_API_SAMPLE_ID = 'M7lc1UVf-VE';

describe('league orbit', () => {
  it('builds one visible item for every configured league', () => {
    const items = buildLeagueOrbitItems();

    expect(items).toHaveLength(LEAGUES.length);
    expect(items.map((item) => item.league.label)).toEqual(
      LEAGUES.map((league) => league.label)
    );
  });

  it('uses local logos, provider-backed logos, and generated visual marks', () => {
    const items = buildLeagueOrbitItems();
    const nba = items.find((item) => item.league.label === 'NBA');
    const ipl = items.find((item) => item.league.label === 'IPL');
    const ncaaw = items.find((item) => item.league.label === 'NCAAW');
    const wwc = items.find((item) => item.league.label === 'WWC');
    const copaAmerica = items.find((item) => item.league.label === 'COPA AMÉRICA');
    const euros = items.find((item) => item.league.label === 'EUROS');
    const afcon = items.find((item) => item.league.label === 'AFCON');
    const asianCup = items.find((item) => item.league.label === 'ASIAN CUP');
    const boxing = items.find((item) => item.league.label === 'BOXING');
    const crestFallbacks = items.filter((item) => item.visualMark.kind === 'crest');

    expect(nba?.logo).toBe(getLeagueLogo('NBA'));
    expect(nba?.visualMark.kind).toBe('image');
    expect(ipl?.logo).toBe(getLeagueLogo('IPL'));
    expect(ncaaw?.logo).toBe(getLeagueLogo('NCAAW'));
    expect(wwc?.logo).toBe(getLeagueLogo('WWC'));
    expect(copaAmerica?.logo).toBe(getLeagueLogo('COPA AMÉRICA'));
    expect(euros?.logo).toBe(getLeagueLogo('EUROS'));
    expect(afcon?.logo).toBe(getLeagueLogo('AFCON'));
    expect(asianCup?.logo).toBe(getLeagueLogo('ASIAN CUP'));
    expect(crestFallbacks.map((item) => item.league.label)).toEqual([
      'BOXING',
      'BBL',
      'CPL',
      'THE HUNDRED',
      'CWC',
      'INTL CRICKET',
      'SIX NATIONS',
      'PREMIERSHIP',
      'TOP 14',
      'RUGBY WC',
      'SUPER RUGBY',
      'RUGBY CHAMP'
    ]);
    expect(boxing?.logo).toBeNull();
    expect(boxing?.visualMark.kind).toBe('crest');
    expect(boxing?.visualMark.code).toBe('BOX');
  });

  it('provides curated teams and player chips for every league', () => {
    for (const league of LEAGUES) {
      const showcase = getLeagueShowcase(league);

      expect(showcase.teams).toHaveLength(12);
      expect(showcase.players.length).toBeGreaterThanOrEqual(4);
      expect(showcase.teams.every((team) => team.mark.kind === 'image' || team.mark.kind === 'crest')).toBe(true);
    }
  });

  it('allows only verified youtube IDs or null media fallbacks', () => {
    const items = buildLeagueOrbitItems();

    for (const item of items) {
      expect(
        item.media.youtubeId === null || /^[A-Za-z0-9_-]{11}$/.test(item.media.youtubeId)
      ).toBe(true);
      expect(
        item.media.fallbackUrl === null || /^https:\/\/.+/.test(item.media.fallbackUrl)
      ).toBe(true);
    }
  });

  it('renders every league as a reachable control', () => {
    render(<LeagueOrbit />);

    for (const league of LEAGUES) {
      const trigger = screen.getByTestId(`league-orbit-trigger-${league.label}`);

      expect(trigger).toBeVisible();
      expect(trigger).toHaveAttribute('type', 'button');
      expect(trigger).toHaveTextContent(league.label);
    }
  });

  it('flips nearby league nodes into active league teams on hover and shows players', () => {
    render(<LeagueOrbit />);

    fireEvent.mouseEnter(screen.getByTestId('league-orbit-trigger-NBA'));

    expect(screen.getByTestId('league-orbit-team-node-NBA-NYK')).toBeInTheDocument();
    expect(screen.getAllByText('Jalen Brunson').length).toBeGreaterThan(0);
    expect(screen.queryByText('Aja Wilson')).not.toBeInTheDocument();

    fireEvent.mouseEnter(screen.getByTestId('league-orbit-trigger-NFL'));

    expect(screen.getByTestId('league-orbit-team-node-NFL-KC')).toBeInTheDocument();
    expect(screen.getAllByText('Patrick Mahomes').length).toBeGreaterThan(0);
  });

  it('reshuffles showcase teams and exposes hierarchy tiers', () => {
    render(<LeagueOrbit />);

    const nbaTrigger = screen.getByTestId('league-orbit-trigger-NBA');
    fireEvent.mouseEnter(nbaTrigger);

    const firstOrder = screen
      .getAllByTestId(/^league-orbit-team-node-NBA-/)
      .map((node) => node.getAttribute('data-team-code'));

    fireEvent.mouseEnter(screen.getByTestId('league-orbit-trigger-NFL'));
    fireEvent.mouseEnter(nbaTrigger);

    const secondOrder = screen
      .getAllByTestId(/^league-orbit-team-node-NBA-/)
      .map((node) => node.getAttribute('data-team-code'));

    expect(secondOrder).not.toEqual(firstOrder);
    expect(nbaTrigger).toHaveAttribute('data-orbit-tier', 'league');
    expect(screen.getAllByTestId(/^league-orbit-team-node-NBA-/)[0]).toHaveAttribute(
      'data-orbit-tier',
      'team'
    );
    for (const chip of screen.getAllByTestId('league-orbit-player-chip-NBA-JB')) {
      expect(chip).toHaveAttribute('data-orbit-tier', 'player');
    }
  });
});

describe('video surface', () => {
  it('keeps youtube-nocookie iframes unmounted until the poster is clicked', () => {
    render(
      <VideoSurface
        posterAlt="Official YouTube iframe sample poster"
        posterSrc="/app-screens/leagues.png"
        title="Official video"
        youtubeId={YOUTUBE_IFRAME_API_SAMPLE_ID}
      />
    );

    expect(screen.queryByTitle('Official video')).not.toBeInTheDocument();

    fireEvent.click(screen.getByRole('button', { name: /play official video/i }));

    const iframe = screen.getByTitle('Official video');
    expect(iframe).toBeInTheDocument();
    expect(iframe).toHaveAttribute(
      'src',
      expect.stringContaining('https://www.youtube-nocookie.com/embed/')
    );
    expect(iframe).toHaveAttribute(
      'src',
      expect.stringContaining(YOUTUBE_IFRAME_API_SAMPLE_ID)
    );
  });
});
