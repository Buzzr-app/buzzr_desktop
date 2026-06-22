/** @jest-environment jsdom */
import { fireEvent, render, screen } from '@testing-library/react';
import { LeagueOrbit } from '@/components/sections/LeagueOrbit';
import { VideoSurface } from '@/components/ui/VideoSurface';
import { LEAGUES } from '@/src/lib/constants';
import { buildLeagueOrbitItems } from '@/src/lib/leagueMedia';
import { getLeagueLogo } from '@/src/lib/leagueLogos';

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

  it('uses local verified logos and text fallbacks for missing logos', () => {
    const items = buildLeagueOrbitItems();
    const nba = items.find((item) => item.league.label === 'NBA');
    const ncaaw = items.find((item) => item.league.label === 'NCAAW');

    expect(nba?.logo).toBe(getLeagueLogo('NBA'));
    expect(ncaaw?.logo).toBeNull();
    expect(ncaaw?.fallbackLabel).toBe('NCAAW');
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
