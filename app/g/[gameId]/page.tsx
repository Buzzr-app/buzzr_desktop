import type { Metadata } from 'next';

import { ShareLanding } from '@/components/ShareLanding';
import { SITE_NAME, SITE_TAGLINE } from '@/src/lib/constants';
import {
  appendParams,
  fetchGame,
  gameDescription,
  gameTitle,
  pickAttribution,
  SHARE_BASE_URL,
  type ShareSearchParams,
} from '@/src/lib/share';
import {
  appDeepLink,
  branchCtaUrl,
  canonicalUrl,
  firstParam,
  normalizeReferralCode,
  type SearchParamValue,
} from '@/src/lib/shareLanding';

type PageProps = {
  params: { gameId: string };
  searchParams?: { ref?: SearchParamValue; source?: SearchParamValue };
};

const GAME_ID_PATTERN = /^[A-Za-z0-9-]{4,64}$/;

function normalizeGameId(raw: string | undefined): string | null {
  if (!raw) return null;
  const trimmed = raw.trim();
  return GAME_ID_PATTERN.test(trimmed) ? trimmed : null;
}

export async function generateMetadata({ params, searchParams }: PageProps): Promise<Metadata> {
  const ref = firstParam(searchParams?.ref);
  const canonical = canonicalUrl(`/g/${encodeURIComponent(params.gameId)}`, ref);
  const gameId = normalizeGameId(params.gameId);

  let title = 'Open this game on Buzzr';
  let description =
    'Rate the game, see the Buzzr conversation, and share your take with friends.';

  if (gameId) {
    const game = await fetchGame(gameId);
    if (game) {
      title = gameTitle(game);
      description = gameDescription(game);
    }
  }

  return {
    title,
    description,
    metadataBase: new URL(SHARE_BASE_URL),
    alternates: { canonical },
    openGraph: {
      type: 'website',
      url: canonical,
      siteName: SITE_NAME,
      title,
      description,
    },
    twitter: {
      card: 'summary_large_image',
      title,
      description,
    },
  };
}

export default async function GameLandingPage({ params, searchParams }: PageProps) {
  const ref = normalizeReferralCode(firstParam(searchParams?.ref));
  const source = firstParam(searchParams?.source);
  const path = `/g/${encodeURIComponent(params.gameId)}`;
  const canonical = canonicalUrl(path, ref);

  const installUrl = branchCtaUrl({
    canonical,
    ref,
    source,
    shareId: params.gameId,
    shareType: 'game',
    targetPath: path,
  });

  const attribution = pickAttribution(searchParams as ShareSearchParams | undefined);
  const openUrl = appendParams(appDeepLink(path), attribution);

  const gameId = normalizeGameId(params.gameId);
  const game = gameId ? await fetchGame(gameId) : null;

  const title = game ? gameTitle(game).replace(' · Buzzr', '') : 'A game is waiting on Buzzr';
  const description = game
    ? gameDescription(game)
    : SITE_TAGLINE;

  return (
    <ShareLanding
      badge={game?.league ? `Buzzr · ${game.league}` : 'Buzzr Game'}
      canonical={canonical}
      description={description}
      installUrl={installUrl}
      openUrl={openUrl}
      title={title}
    />
  );
}
