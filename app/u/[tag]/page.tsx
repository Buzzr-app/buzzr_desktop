import type { Metadata } from 'next';

import { ShareLanding } from '@/components/ShareLanding';
import { SITE_NAME } from '@/src/lib/constants';
import {
  appendParams,
  fetchProfileByTag,
  pickAttribution,
  SHARE_BASE_URL,
  truncate,
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
  params: { tag: string };
  searchParams?: { ref?: SearchParamValue; source?: SearchParamValue };
};

const TAG_PATTERN = /^[A-Za-z0-9_.-]{2,32}$/;

function cleanTag(tag: string): string {
  return tag.replace(/^@/, '').trim();
}

function normalizeTag(raw: string | undefined): string | null {
  const cleaned = cleanTag(raw ?? '');
  return TAG_PATTERN.test(cleaned) ? cleaned : null;
}

const PROFILE_FALLBACK_DESCRIPTION =
  'Open this Buzzr profile to follow their ratings, takes, and sports taste.';

export async function generateMetadata({ params, searchParams }: PageProps): Promise<Metadata> {
  const ref = firstParam(searchParams?.ref);
  const tagValid = normalizeTag(params.tag);
  const cleaned = cleanTag(params.tag);
  const canonical = canonicalUrl(`/u/${encodeURIComponent(cleaned)}`, ref);

  let title = `@${cleaned || 'profile'} on ${SITE_NAME}`;
  let description = PROFILE_FALLBACK_DESCRIPTION;

  if (tagValid) {
    const profile = await fetchProfileByTag(tagValid);
    const handle = profile?.user_tag ?? tagValid;
    title = `@${handle} on ${SITE_NAME}`;
    if (profile?.headline) description = truncate(profile.headline, 160);
  }

  return {
    title,
    description,
    metadataBase: new URL(SHARE_BASE_URL),
    alternates: { canonical },
    openGraph: {
      type: 'profile',
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

export default async function ProfileLandingPage({ params, searchParams }: PageProps) {
  const cleaned = cleanTag(params.tag);
  const tagValid = normalizeTag(params.tag);
  const profile = tagValid ? await fetchProfileByTag(tagValid) : null;
  const handle = profile?.user_tag ?? cleaned;

  const ref = normalizeReferralCode(firstParam(searchParams?.ref));
  const source = firstParam(searchParams?.source);
  const path = `/u/${encodeURIComponent(cleaned)}`;
  const canonical = canonicalUrl(path, ref);

  const installUrl = branchCtaUrl({
    canonical,
    ref,
    source,
    shareId: cleaned,
    shareType: 'profile',
    targetPath: path,
  });

  const attribution = pickAttribution(searchParams as ShareSearchParams | undefined);
  const openUrl = appendParams(appDeepLink(path), attribution);

  const description = profile?.headline
    ? truncate(profile.headline, 220)
    : `Open Buzzr to view @${handle}, follow their ratings, and see their latest sports takes.`;
  const title = profile?.username ? `${profile.username} (@${handle})` : `@${handle} is on Buzzr`;

  return (
    <ShareLanding
      badge="Buzzr Profile"
      canonical={canonical}
      description={description}
      installUrl={installUrl}
      openUrl={openUrl}
      title={title}
    />
  );
}
