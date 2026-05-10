import type { Metadata } from 'next';

import { ShareLanding } from '@/components/ShareLanding';
import { SITE_NAME, SITE_TAGLINE } from '@/src/lib/constants';
import {
  appendParams,
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
  params: { code: string };
  searchParams?: { ref?: SearchParamValue; source?: SearchParamValue };
};

export function generateMetadata({ params }: PageProps): Metadata {
  const code = normalizeReferralCode(params.code);
  const canonical = canonicalUrl(`/r/${encodeURIComponent(code)}`);
  const title = code
    ? `Join ${SITE_NAME} with code ${code}`
    : `Join ${SITE_NAME}`;
  const description = code
    ? `A friend invited you to ${SITE_NAME}. ${SITE_TAGLINE}`
    : `Open this Buzzr invite, install the app, and the referral code will apply on first launch.`;

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

export default function ReferralLandingPage({ params, searchParams }: PageProps) {
  const code = normalizeReferralCode(params.code);
  const ref = normalizeReferralCode(firstParam(searchParams?.ref) || code);
  const source = firstParam(searchParams?.source);
  const path = `/r/${encodeURIComponent(code)}`;
  const canonical = canonicalUrl(path);

  const installUrl = branchCtaUrl({
    canonical,
    ref,
    source,
    shareId: code,
    shareType: 'referral',
    targetPath: path,
  });

  const attribution = pickAttribution(searchParams as ShareSearchParams | undefined);
  const openUrl = appendParams(appDeepLink(path), attribution);

  return (
    <ShareLanding
      badge="Buzzr Invite"
      canonical={canonical}
      description={`Use code ${code} when you join Buzzr. If you install from here, Buzzr will save it for first launch.`}
      installUrl={installUrl}
      openUrl={openUrl}
      title={code ? `Join Buzzr with code ${code}` : 'You have a Buzzr referral'}
    />
  );
}
