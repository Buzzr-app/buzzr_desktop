import type { Metadata } from 'next';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { BASE_URL, SITE_NAME } from '@/src/lib/constants';
import {
  getAllTagSlugs,
  getPostsByTagSlug,
  tagLabelFromSlug
} from '@/src/lib/blog';
import { PostCard } from '@/components/blog/PostCard';
import { EditorialShell } from '@/components/blog/EditorialShell';
import { EditorialPill } from '@/components/blog/EditorialPill';
import { EditorialTagRail } from '@/components/blog/EditorialTagRail';

type PageProps = { params: Promise<{ tag: string }> };

export function generateStaticParams() {
  return getAllTagSlugs().map((tag) => ({ tag }));
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { tag: slug } = await params;
  const posts = getPostsByTagSlug(slug);
  if (posts.length === 0) {
    return { title: `Not found · ${SITE_NAME}` };
  }

  const label = tagLabelFromSlug(slug);
  const title = `${label} · ${SITE_NAME} Blog`;
  const description = `Buzzr blog posts tagged ${label}, essays and engineering write-ups on ${label.toLowerCase()} in the sports-media shift.`;
  const url = `${BASE_URL}/blog/tag/${slug}`;

  return {
    title,
    description,
    alternates: {
      canonical: `/blog/tag/${slug}`,
      languages: { 'en-US': url, 'x-default': url }
    },
    openGraph: {
      type: 'website',
      url,
      siteName: SITE_NAME,
      title,
      description
    },
    twitter: {
      card: 'summary_large_image',
      title,
      description,
      site: '@the_real_buzzr'
    }
  };
}

export default async function TagPage({ params }: PageProps) {
  const { tag: slug } = await params;
  const posts = getPostsByTagSlug(slug);
  if (posts.length === 0) notFound();

  const label = tagLabelFromSlug(slug);
  const url = `${BASE_URL}/blog/tag/${slug}`;
  const tagSlugs = getAllTagSlugs();

  const collectionLd = {
    '@context': 'https://schema.org',
    '@type': 'CollectionPage',
    '@id': url,
    url,
    name: `${label} · ${SITE_NAME} Blog`,
    description: `Posts tagged ${label}.`,
    inLanguage: 'en-US',
    isPartOf: {
      '@type': 'Blog',
      '@id': `${BASE_URL}/blog#blog`,
      url: `${BASE_URL}/blog`
    },
    hasPart: posts.map((post) => ({
      '@type': 'BlogPosting',
      url: `${BASE_URL}/blog/${post.slug}`,
      headline: post.title,
      datePublished: post.publishedAt
    }))
  };

  const breadcrumbLd = {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: [
      { '@type': 'ListItem', position: 1, name: 'Home', item: BASE_URL },
      { '@type': 'ListItem', position: 2, name: 'Blog', item: `${BASE_URL}/blog` },
      { '@type': 'ListItem', position: 3, name: label, item: url }
    ]
  };

  return (
    <EditorialShell
      labelledBy="tag-title"
      eyebrow="By topic"
      title={label}
      description={`${posts.length} ${posts.length === 1 ? 'dispatch' : 'dispatches'} on ${label.toLowerCase()} in the AI-native sports social shift.`}
      breadcrumbs={[
        { label: 'Home', href: '/' },
        { label: 'Blog', href: '/blog' },
        { label }
      ]}
      prelude={
        <>
          <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(collectionLd) }} />
          <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbLd) }} />
        </>
      }
      headerAside={
        <div className="rounded-[8px] border border-white/10 bg-white/[0.04] p-5">
          <p className="font-mono text-[12px] uppercase leading-[2] tracking-[0.12em] text-white/45">
            Filter
          </p>
          <p className="mt-3 text-[15px] leading-[1.6] tracking-[0] text-white/68">
            A focused reading list for fans tracking how Buzzr turns live sports into a social graph.
          </p>
        </div>
      }
    >

      <EditorialTagRail label="Topics" className="mb-8">
        <EditorialPill href="/blog">All</EditorialPill>
        {tagSlugs.map((tagSlug) => (
          <EditorialPill
            key={tagSlug}
            href={`/blog/tag/${tagSlug}`}
            isActive={tagSlug === slug}
          >
            {tagLabelFromSlug(tagSlug)}
          </EditorialPill>
        ))}
      </EditorialTagRail>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {posts.map((post, i) => (
          <PostCard key={post.slug} post={post} priority={i < 3} />
        ))}
      </div>

      <div className="mt-12 flex justify-center">
        <Link
          href="/blog"
          className="inline-flex min-h-[44px] items-center rounded-full border border-white/16 px-4 py-2.5 text-[14px] font-medium leading-none tracking-[0] text-white transition-colors hover:border-white/35 focus-visible:outline-none focus-visible:shadow-[var(--shadow-focus)]"
        >
          All posts
        </Link>
      </div>
    </EditorialShell>
  );
}
