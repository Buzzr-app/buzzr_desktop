import Link from 'next/link';
import { Section } from '@/components/ui/Section';
import { Badge } from '@/components/ui/Badge';
import { getAllPosts } from '@/src/lib/blog';
import { PostCard } from '@/components/blog/PostCard';

export function LatestPosts() {
  const posts = getAllPosts().slice(0, 3);

  if (posts.length === 0) {
    if (process.env.NODE_ENV === 'production') return null;
    return (
      <Section id="blog" aria-labelledby="latest-title">
        <Badge>Blog</Badge>
        <h2
          id="latest-title"
          className="mt-3 text-[clamp(32px,4.5vw,48px)] font-bold uppercase leading-[0.95] tracking-[-0.04em] text-foreground"
        >
          From the blog.
        </h2>
        <p className="mt-5 text-[16px] leading-[1.5] tracking-[-0.025em] text-muted">
          No posts yet. Add MDX files to <span className="font-mono text-foreground">/content/blog</span> to see this section render.
        </p>
      </Section>
    );
  }

  return (
    <Section id="blog" aria-labelledby="latest-title">
      <header className="mb-10 flex flex-wrap items-end justify-between gap-6">
        <div>
          <Badge>Blog</Badge>
          <h2
            id="latest-title"
            className="mt-3 max-w-[22ch] text-[clamp(32px,4.5vw,48px)] font-bold uppercase leading-[0.95] tracking-[-0.04em] text-foreground"
          >
            From the blog.
          </h2>
        </div>
        <Link
          href="/blog"
          className="inline-flex items-center gap-2 text-[14px] tracking-[-0.025em] text-muted transition-colors hover:text-foreground"
        >
          View all
          <span aria-hidden>→</span>
        </Link>
      </header>

      <div className="grid gap-3 md:grid-cols-3">
        {posts.map((post) => (
          <PostCard key={post.slug} post={post} />
        ))}
      </div>
    </Section>
  );
}
