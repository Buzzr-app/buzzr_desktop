import type { Metadata } from 'next';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { SITE_NAME, BASE_URL, COMPANY_NAME } from '@/src/lib/constants';
import {
  getAllPostSlugs,
  getAllPosts,
  getPostBySlug,
  formatPublishedDate,
  wordCount,
  tagSlug
} from '@/src/lib/blog';
import { BlogCover } from '@/components/blog/BlogCover';
import { authorJsonLd, getAuthor } from '@/src/lib/authors';
import { Prose } from '@/components/blog/Prose';
import { EditorialShell } from '@/components/blog/EditorialShell';
import { EditorialPill } from '@/components/blog/EditorialPill';
import { EditorialTagRail } from '@/components/blog/EditorialTagRail';
import { MarkdownArticle } from '@/components/blog/MarkdownArticle';

type PageProps = { params: Promise<{ slug: string }> };

export function generateStaticParams() {
  return getAllPostSlugs().map((slug) => ({ slug }));
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { slug } = await params;
  const post = getPostBySlug(slug);
  if (!post) return { title: `Not found · ${SITE_NAME}` };

  const url = `${BASE_URL}/blog/${post.slug}`;

  return {
    title: `${post.title} · ${SITE_NAME}`,
    description: post.description,
    alternates: {
      canonical: url,
      languages: { 'en-US': url, 'x-default': url }
    },
    // Note: openGraph.images is intentionally omitted so Next auto-attaches
    // the per-post `app/blog/[slug]/opengraph-image.tsx` output. Same for twitter.
    openGraph: {
      type: 'article',
      url,
      siteName: SITE_NAME,
      title: post.title,
      description: post.description,
      publishedTime: post.publishedAt,
      modifiedTime: post.publishedAt,
      authors: [post.author],
      tags: post.tags
    },
    twitter: {
      card: 'summary_large_image',
      title: post.title,
      description: post.description,
      site: '@the_real_buzzr',
      creator: '@the_real_buzzr'
    }
  };
}

export default async function BlogPostPage({ params }: PageProps) {
  const { slug } = await params;
  const post = getPostBySlug(slug);
  if (!post) notFound();

  const url = `${BASE_URL}/blog/${post.slug}`;
  const author = getAuthor(post.author);
  const words = wordCount(post.body);
  const coverSeed = getAllPosts().findIndex((p) => p.slug === post.slug);

  const blogPostingLd = {
    '@context': 'https://schema.org',
    '@type': 'BlogPosting',
    headline: post.title,
    description: post.description,
    datePublished: post.publishedAt,
    dateModified: post.publishedAt,
    inLanguage: 'en-US',
    wordCount: words,
    articleSection: post.tags[0] ?? 'Blog',
    keywords: post.tags.join(', '),
    author: authorJsonLd(post.author),
    publisher: {
      '@type': 'Organization',
      name: SITE_NAME,
      url: BASE_URL,
      logo: {
        '@type': 'ImageObject',
        url: `${BASE_URL}/brand/buzzr-mark-transparent.png`
      }
    },
    image: {
      '@type': 'ImageObject',
      url: post.cover.src,
      width: 1600,
      height: 900
    },
    mainEntityOfPage: { '@type': 'WebPage', '@id': url },
    url
  };

  const breadcrumbLd = {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: [
      { '@type': 'ListItem', position: 1, name: 'Home',  item: BASE_URL },
      { '@type': 'ListItem', position: 2, name: 'Blog',  item: `${BASE_URL}/blog` },
      { '@type': 'ListItem', position: 3, name: post.title, item: url }
    ]
  };

  return (
    <EditorialShell
      labelledBy="post-title"
      eyebrow={post.tags[0] ?? 'Buzzr editorial'}
      title={post.title}
      description={post.description}
      breadcrumbs={[
        { label: 'Home', href: '/' },
        { label: 'Blog', href: '/blog' },
        { label: post.tags[0] ?? 'Post' }
      ]}
      prelude={
        <>
          <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(blogPostingLd) }} />
          <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbLd) }} />
        </>
      }
      titleClassName="md:text-[58px]"
      headerAside={
        <div className="rounded-[8px] border border-white/10 bg-white/[0.04] p-5">
          <p className="font-mono text-[12px] uppercase leading-[2] tracking-[0.12em] text-white/45">
            Dispatch file
          </p>
          <dl className="mt-4 grid grid-cols-2 gap-4 text-[14px] leading-[1.45] tracking-[0]">
            <div>
              <dt className="font-mono text-[11px] uppercase leading-[2] tracking-[0.12em] text-white/38">Date</dt>
              <dd className="text-white/76">{formatPublishedDate(post.publishedAt)}</dd>
            </div>
            <div>
              <dt className="font-mono text-[11px] uppercase leading-[2] tracking-[0.12em] text-white/38">Read</dt>
              <dd className="text-white/76">{post.readingTime} min</dd>
            </div>
            <div>
              <dt className="font-mono text-[11px] uppercase leading-[2] tracking-[0.12em] text-white/38">Words</dt>
              <dd className="text-white/76">{words.toLocaleString('en-US')}</dd>
            </div>
            <div>
              <dt className="font-mono text-[11px] uppercase leading-[2] tracking-[0.12em] text-white/38">By</dt>
              <dd>
                <Link href={author.url} className="text-white underline decoration-white/30 underline-offset-4 transition-colors hover:decoration-accent">
                  {post.author}
                </Link>
              </dd>
            </div>
          </dl>
        </div>
      }
    >
      <article aria-labelledby="post-title" className="mx-auto w-full max-w-[1040px]">
        <EditorialTagRail label="Tagged" className="mb-8">
          {post.tags.map((tag) => (
            <EditorialPill key={tag} href={`/blog/tag/${tagSlug(tag)}`}>
              {tag}
            </EditorialPill>
          ))}
        </EditorialTagRail>

        <figure aria-hidden className="relative mb-12 aspect-[16/10] w-full overflow-hidden rounded-[8px] border border-white/10 bg-canvas">
          <BlogCover
            src={post.cover.src}
            alt={post.cover.alt}
            seed={coverSeed >= 0 ? coverSeed : 0}
            priority
            sizes="(max-width: 1100px) 100vw, 1040px"
          />
        </figure>

        <div className="grid gap-12 lg:grid-cols-[minmax(0,720px)_220px] lg:items-start">
          <Prose>
            <MarkdownArticle source={post.body} />
          </Prose>

          <aside className="border-y border-white/10 py-5 lg:sticky lg:top-28" aria-label="Article context">
            <p className="font-mono text-[12px] uppercase leading-[2] tracking-[0.12em] text-white/45">
              Why it matters
            </p>
            <p className="mt-3 text-[14px] leading-[1.6] tracking-[0] text-white/58">
              Buzzr connects live games, AI context, crews, dashboards, and DFS tracking into one sports social loop.
            </p>
          </aside>
        </div>

        {author.bio ? (
          <aside className="mt-14 border-t border-white/10 pt-8" aria-labelledby="author-bio-heading">
            <span id="author-bio-heading" className="font-mono text-[12px] uppercase leading-[2] tracking-[0.12em] text-white/45">
              About the author
            </span>
            <p className="mt-2 text-[18px] font-semibold leading-[1.4] tracking-[0] text-white">
              {author.name}
            </p>
            <p className="mt-2 max-w-[72ch] text-[15px] leading-[1.65] tracking-[0] text-white/58">
              {author.bio}
            </p>
          </aside>
        ) : null}

        <div className="mt-14 rounded-[8px] border border-white/10 bg-white/[0.04] p-6">
          <span className="font-mono text-[12px] uppercase leading-[2] tracking-[0.12em] text-accent-text">{SITE_NAME}</span>
          <p className="mt-2 max-w-[48ch] text-[24px] font-semibold leading-[1.2] tracking-[0] text-white">
            The AI-native sports social app for the whole game night.
          </p>
          <p className="mt-3 max-w-[58ch] text-[15px] leading-[1.6] tracking-[0] text-white/58">
            Scroll, rate, recap, track DFS slips, and keep the group chat attached to the game. Built by {COMPANY_NAME}.
          </p>
          <Link
            href="/"
            className="mt-5 inline-flex min-h-[44px] items-center rounded-full border border-white/16 px-4 py-2.5 text-[14px] font-medium leading-none tracking-[0] text-white transition-colors hover:border-white/35 focus-visible:outline-none focus-visible:shadow-[var(--shadow-focus)]"
          >
            See the app
          </Link>
        </div>
      </article>
    </EditorialShell>
  );
}
