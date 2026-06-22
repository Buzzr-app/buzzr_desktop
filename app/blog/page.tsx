import type { Metadata } from 'next';
import { BASE_URL, SITE_NAME } from '@/src/lib/constants';
import { getAllPosts, getAllTagSlugs, tagLabelFromSlug } from '@/src/lib/blog';
import { PostCard } from '@/components/blog/PostCard';
import { EditorialShell } from '@/components/blog/EditorialShell';
import { EditorialPill } from '@/components/blog/EditorialPill';
import { EditorialTagRail } from '@/components/blog/EditorialTagRail';

const PAGE_TITLE = `Blog · ${SITE_NAME}`;
const PAGE_DESCRIPTION =
  'Essays on AI-native sports social media, Scroll, dashboards, friends, leagues, and Buzzr Bets.';
const URL = `${BASE_URL}/blog`;

export const metadata: Metadata = {
  title: PAGE_TITLE,
  description: PAGE_DESCRIPTION,
  alternates: {
    canonical: '/blog',
    languages: { 'en-US': URL, 'x-default': URL },
    types: { 'application/rss+xml': `${BASE_URL}/blog/rss.xml` }
  },
  openGraph: {
    type: 'website',
    url: URL,
    siteName: SITE_NAME,
    title: PAGE_TITLE,
    description: PAGE_DESCRIPTION
  },
  twitter: {
    card: 'summary_large_image',
    title: PAGE_TITLE,
    description: PAGE_DESCRIPTION,
    site: '@the_real_buzzr',
    creator: '@the_real_buzzr'
  }
};

export default function BlogIndexPage() {
  const posts = getAllPosts();
  const tagSlugs = getAllTagSlugs();
  const [leadPost, ...restPosts] = posts;

  const blogLd = {
    '@context': 'https://schema.org',
    '@type': 'Blog',
    '@id': `${URL}#blog`,
    url: URL,
    name: PAGE_TITLE,
    description: PAGE_DESCRIPTION,
    inLanguage: 'en-US',
    publisher: {
      '@type': 'Organization',
      name: SITE_NAME,
      url: BASE_URL,
      logo: {
        '@type': 'ImageObject',
        url: `${BASE_URL}/brand/buzzr-mark-transparent.png`
      }
    },
    blogPost: posts.map((post) => ({
      '@type': 'BlogPosting',
      url: `${BASE_URL}/blog/${post.slug}`,
      headline: post.title,
      description: post.description,
      datePublished: post.publishedAt,
      author: { '@type': 'Person', name: post.author },
      image: post.cover.src,
      keywords: post.tags.join(', ')
    }))
  };

  const itemListLd = {
    '@context': 'https://schema.org',
    '@type': 'ItemList',
    itemListOrder: 'https://schema.org/ItemListOrderDescending',
    numberOfItems: posts.length,
    itemListElement: posts.map((post, i) => ({
      '@type': 'ListItem',
      position: i + 1,
      url: `${BASE_URL}/blog/${post.slug}`,
      name: post.title
    }))
  };

  const breadcrumbLd = {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: [
      { '@type': 'ListItem', position: 1, name: 'Home', item: BASE_URL },
      { '@type': 'ListItem', position: 2, name: 'Blog', item: URL }
    ]
  };

  return (
    <EditorialShell
      labelledBy="blog-title"
      eyebrow="Buzzr editorial"
      title="The sports social notebook."
      description="Short product essays on Scroll, Buzzr Score, crews, dashboards, leagues, and DFS slip tracking."
      breadcrumbs={[{ label: 'Home', href: '/' }, { label: 'Blog' }]}
      prelude={
        <>
          <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(blogLd) }} />
          <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(itemListLd) }} />
          <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbLd) }} />
        </>
      }
      headerAside={
        <div className="rounded-[8px] border border-white/10 bg-white/[0.04] p-5">
          <p className="font-mono text-[12px] uppercase leading-[2] tracking-[0.12em] text-white/45">
            Field notes
          </p>
          <p className="mt-3 text-[15px] leading-[1.6] tracking-[0] text-white/68">
            {posts.length} dispatches for fans building a smarter postgame habit.
          </p>
          <a
            href="/blog/rss.xml"
            className="mt-5 inline-flex min-h-[40px] items-center rounded-full border border-white/14 px-3.5 py-2 text-[13px] font-medium leading-none tracking-[0] text-white transition-colors hover:border-white/32"
          >
            RSS feed
          </a>
        </div>
      }
    >

      {tagSlugs.length > 0 && (
        <EditorialTagRail label="Topics" className="mb-8">
          {tagSlugs.map((slug) => (
            <EditorialPill
              key={slug}
              href={`/blog/tag/${slug}`}
            >
              {tagLabelFromSlug(slug)}
            </EditorialPill>
          ))}
        </EditorialTagRail>
      )}

      {!leadPost ? (
        <p className="rounded-[8px] border border-white/10 bg-white/[0.04] p-5 text-[15px] leading-[1.6] tracking-[0] text-white/62">
          No posts yet.
        </p>
      ) : (
        <>
          <PostCard post={leadPost} priority variant="lead" />

          {restPosts.length > 0 ? (
            <div className="mt-8 grid gap-4 md:grid-cols-2 lg:grid-cols-3">
              {restPosts.map((post, i) => (
                <PostCard key={post.slug} post={post} priority={i < 2} />
              ))}
            </div>
          ) : null}
        </>
      )}
    </EditorialShell>
  );
}
