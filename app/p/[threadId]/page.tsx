import type { Metadata } from 'next';
import { notFound } from 'next/navigation';

import { ShareLanding } from '@/components/ShareLanding';
import { SITE_NAME, SITE_TAGLINE } from '@/src/lib/constants';
import {
  appendParams,
  fetchThreadWithAuthor,
  isThreadPublic,
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
  params: { threadId: string };
  searchParams?: { ref?: SearchParamValue; source?: SearchParamValue };
};

const THREAD_ID_PATTERN = /^[A-Za-z0-9-]{4,64}$/;

function normalizeThreadId(raw: string | undefined): string | null {
  if (!raw) return null;
  const trimmed = raw.trim();
  return THREAD_ID_PATTERN.test(trimmed) ? trimmed : null;
}

export async function generateMetadata({ params, searchParams }: PageProps): Promise<Metadata> {
  const ref = firstParam(searchParams?.ref);
  const canonical = canonicalUrl(`/p/${encodeURIComponent(params.threadId)}`, ref);
  const threadId = normalizeThreadId(params.threadId);

  let title = 'Open this Buzzr take';
  let description = 'Read the take, jump into the sports conversation, and share your own rating.';
  let openGraphType: 'website' | 'article' = 'website';

  if (threadId) {
    const result = await fetchThreadWithAuthor(threadId);
    if (result && isThreadPublic(result.thread)) {
      const handle = result.author?.user_tag ?? result.author?.username ?? null;
      title = handle ? `@${handle} on ${SITE_NAME}` : `A take on ${SITE_NAME}`;
      if (result.thread.body) description = truncate(result.thread.body, 160);
      openGraphType = 'article';
    }
  }

  return {
    title,
    description,
    metadataBase: new URL(SHARE_BASE_URL),
    alternates: { canonical },
    openGraph: {
      type: openGraphType,
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

export default async function PostLandingPage({ params, searchParams }: PageProps) {
  const threadId = normalizeThreadId(params.threadId);
  if (!threadId) notFound();

  const result = await fetchThreadWithAuthor(threadId);
  if (!result || !isThreadPublic(result.thread)) notFound();

  const { thread, author } = result;
  const handle = author?.user_tag ?? author?.username ?? null;

  const ref = normalizeReferralCode(firstParam(searchParams?.ref));
  const source = firstParam(searchParams?.source);
  const path = `/p/${encodeURIComponent(params.threadId)}`;
  const canonical = canonicalUrl(path, ref);

  const installUrl = branchCtaUrl({
    canonical,
    ref,
    source,
    shareId: params.threadId,
    shareType: 'post',
    targetPath: path,
  });

  const attribution = pickAttribution(searchParams as ShareSearchParams | undefined);
  const openUrl = appendParams(appDeepLink(path), attribution);

  const title = handle ? `@${handle} on ${SITE_NAME}` : 'A take is live on Buzzr';
  const description = thread.body
    ? truncate(thread.body, 220)
    : SITE_TAGLINE;

  return (
    <ShareLanding
      badge="Buzzr Take"
      canonical={canonical}
      description={description}
      installUrl={installUrl}
      openUrl={openUrl}
      title={title}
    />
  );
}
