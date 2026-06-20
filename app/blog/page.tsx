import type { Metadata } from 'next';
import Link from 'next/link';
import { BASE_URL, SITE_NAME } from '@/src/lib/constants';
import { getAllPosts, getAllTagSlugs, tagLabelFromSlug } from '@/src/lib/blog';
import { PostCard } from '@/components/blog/PostCard';

const PAGE_TITLE = `Blog · ${SITE_NAME}`;
const PAGE_DESCRIPTION =
  'Essays and reporting on the state of sports fandom: esports, betting fatigue, second-screen culture, and how fans actually watch today.';
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
    <section
      aria-labelledby="blog-title"
      className="mx-auto w-full max-w-[1200px] px-6 pt-24 pb-[48px] md:pt-32"
    >
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(blogLd) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(itemListLd) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbLd) }} />

      <nav aria-label="Breadcrumb" className="mb-10 font-mono text-[12px] uppercase tracking-[0.1em] leading-[2] text-muted">
        <ol className="flex flex-wrap items-center gap-2">
          <li><Link href="/" className="hover:text-foreground transition-colors">Home</Link></li>
          <li aria-hidden>·</li>
          <li className="text-foreground" aria-current="page">Blog</li>
        </ol>
      </nav>

      <header className="mb-12 max-w-[52ch]">
        <span className="font-mono text-[12px] uppercase tracking-[0.1em] leading-[2] text-muted">Blog</span>
        <h1
          id="blog-title"
          className="mt-3 text-[clamp(36px,5vw,52px)] font-bold uppercase leading-[0.95] tracking-[-0.04em] text-foreground"
        >
          The state of fandom.
        </h1>
        <p className="mt-5 text-[16px] leading-[1.5] tracking-[-0.025em] text-muted">
          Dispatches from inside the sports-media shift. What fans actually watch, how they rate it, and why the box score stopped being the point.
        </p>
      </header>

      {tagSlugs.length > 0 && (
        <nav aria-label="Tags" className="mb-10 flex flex-wrap gap-2 border-y border-surface py-4">
          <span className="mr-2 font-mono text-[12px] uppercase tracking-[0.1em] leading-[2] text-muted">Topics</span>
          {tagSlugs.map((slug) => (
            <Link
              key={slug}
              href={`/blog/tag/${slug}`}
              className="rounded-full border border-white/15 bg-white/[0.03] px-3 py-1.5 font-mono text-[12px] tracking-[0.1em] uppercase text-muted transition-colors hover:border-accent hover:text-foreground"
            >
              {tagLabelFromSlug(slug)}
            </Link>
          ))}
        </nav>
      )}

      {posts.length === 0 ? (
        <p className="text-[14px] leading-[1.43] tracking-[0.1px] text-muted">No posts yet.</p>
      ) : (
        <div className="grid gap-3 md:grid-cols-2 lg:grid-cols-3">
          {posts.map((post, i) => (
            <PostCard key={post.slug} post={post} priority={i < 3} />
          ))}
        </div>
      )}
    </section>
  );
}
