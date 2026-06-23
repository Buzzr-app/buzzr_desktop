import type { Metadata } from 'next';
import { BASE_URL, SITE_NAME } from '@/src/lib/constants';
import { getAllPosts, getAllTagSlugs, tagLabelFromSlug } from '@/src/lib/blog';
import { PostCard } from '@/components/blog/PostCard';
import { EditorialShell } from '@/components/blog/EditorialShell';
import { EditorialPill } from '@/components/blog/EditorialPill';
import { EditorialTagRail } from '@/components/blog/EditorialTagRail';

const PAGE_TITLE = `Blog · ${SITE_NAME}`;
const PAGE_DESCRIPTION =
  'Quick reads on sports social: Scroll, dashboards, crews, leagues, and Buzzr Bets.';
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
      eyebrow="Buzzr blog"
      title="The sports social notebook."
      description="Quick reads on Scroll, Buzzr Score, crews, dashboards, leagues, and tracking your slips."
      breadcrumbs={[{ label: 'Home', href: '/' }, { label: 'Blog' }]}
      prelude={
        <>
          <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(blogLd) }} />
          <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(itemListLd) }} />
          <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbLd) }} />
        </>
      }
      headerAside={
        <div className="rounded-card border border-border bg-surface p-6">
          <p className="font-mono text-[11px] uppercase leading-none tracking-[0.14em] text-muted">
            Field notes
          </p>
          <p className="mt-3.5 text-[15px] leading-[1.6] text-foreground/85">
            {posts.length} posts on how Buzzr turns every game into a better hang.
          </p>
          <a
            href="/blog/rss.xml"
            className="mt-5 inline-flex min-h-[40px] items-center gap-2 rounded-full border border-border px-4 py-2 text-[13px] font-medium leading-none text-foreground transition-[border-color,transform] duration-200 ease-[cubic-bezier(0.23,1,0.32,1)] hover:border-white/25 active:scale-[0.97]"
          >
            <span aria-hidden className="size-1.5 rounded-full bg-accent" />
            RSS feed
          </a>
        </div>
      }
    >

      {tagSlugs.length > 0 && (
        <EditorialTagRail label="Topics" className="mb-10">
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
        <p className="rounded-card border border-border bg-surface p-6 text-[15px] leading-[1.6] text-muted">
          Nothing here yet. New posts drop soon.
        </p>
      ) : (
        <>
          <PostCard post={leadPost} priority variant="lead" />

          {restPosts.length > 0 ? (
            <>
              <div className="mt-14 mb-7 flex items-center gap-4">
                <h2 className="font-mono text-[11px] uppercase leading-none tracking-[0.14em] text-muted">
                  More posts
                </h2>
                <span aria-hidden className="h-px flex-1 bg-border" />
              </div>
              <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
                {restPosts.map((post, i) => (
                  <PostCard key={post.slug} post={post} priority={i < 2} />
                ))}
              </div>
            </>
          ) : null}
        </>
      )}
    </EditorialShell>
  );
}
