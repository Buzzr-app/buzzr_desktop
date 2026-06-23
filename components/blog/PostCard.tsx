import Link from 'next/link';
import Image from 'next/image';
import type { Post } from '@/src/lib/blog';
import { formatPublishedDate } from '@/src/lib/blog';

type PostCardProps = {
  post: Post;
  priority?: boolean;
  variant?: 'lead' | 'standard';
};

function PostMeta({ post, className }: { post: Post; className?: string }) {
  return (
    <div
      className={
        'flex flex-wrap items-center gap-x-2.5 gap-y-1 font-mono text-[11px] uppercase leading-none tracking-[0.14em] text-muted' +
        (className ? ` ${className}` : '')
      }
    >
      {post.tags[0] ? <span className="text-accent-text">{post.tags[0]}</span> : null}
      {post.tags[0] ? <span aria-hidden className="text-white/20">/</span> : null}
      <time dateTime={post.publishedAt}>{formatPublishedDate(post.publishedAt)}</time>
      <span aria-hidden className="text-white/20">/</span>
      <span>{post.readingTime} min read</span>
    </div>
  );
}

export function PostCard({ post, priority = false, variant = 'standard' }: PostCardProps) {
  if (variant === 'lead') {
    return (
      <Link
        href={`/blog/${post.slug}`}
        className="group grid overflow-hidden rounded-card border border-border bg-surface transition-[border-color,transform] duration-300 ease-[cubic-bezier(0.23,1,0.32,1)] hover:-translate-y-0.5 hover:border-white/20 active:translate-y-0 lg:grid-cols-[1.05fr_0.95fr]"
      >
        <div className="relative min-h-[260px] overflow-hidden bg-canvas md:min-h-[420px]">
          <Image
            src={post.cover.src}
            alt={post.cover.alt}
            fill
            priority={priority}
            sizes="(max-width: 1024px) 100vw, 620px"
            className="object-cover transition-transform duration-500 ease-[cubic-bezier(0.23,1,0.32,1)] group-hover:scale-[1.02] motion-reduce:transition-none motion-reduce:group-hover:scale-100"
          />
          <div
            aria-hidden
            className="absolute inset-0 bg-[linear-gradient(120deg,transparent_40%,rgba(10,10,12,0.55))] lg:bg-[linear-gradient(100deg,transparent_55%,rgba(10,10,12,0.85))]"
          />
        </div>

        <div className="flex min-h-[300px] flex-col justify-between gap-8 p-7 md:p-10">
          <div>
            <span className="inline-flex items-center gap-1.5 rounded-full border border-accent/30 bg-accent/[0.08] px-3 py-1 font-mono text-[10px] uppercase leading-none tracking-[0.14em] text-accent-text">
              <span aria-hidden className="size-1.5 rounded-full bg-accent" />
              Latest
            </span>
            <h2 className="mt-6 max-w-[14ch] text-[32px] font-semibold leading-[1.04] tracking-[-0.02em] text-foreground md:text-[46px]">
              {post.title}
            </h2>
            <p className="mt-5 max-w-[46ch] text-[16px] leading-[1.6] text-muted md:text-[17px]">
              {post.description}
            </p>
          </div>

          <div className="flex flex-col gap-5">
            <PostMeta post={post} />
            <span className="inline-flex items-center gap-2 text-[14px] font-medium leading-none text-foreground">
              Read it
              <span
                aria-hidden
                className="transition-transform duration-300 ease-[cubic-bezier(0.23,1,0.32,1)] group-hover:translate-x-1 motion-reduce:transition-none"
              >
                &gt;
              </span>
            </span>
          </div>
        </div>
      </Link>
    );
  }

  return (
    <Link
      href={`/blog/${post.slug}`}
      className="group flex h-full flex-col overflow-hidden rounded-card border border-border bg-surface transition-[border-color,transform] duration-300 ease-[cubic-bezier(0.23,1,0.32,1)] hover:-translate-y-0.5 hover:border-white/20 active:translate-y-0"
    >
      <div className="relative aspect-[16/10] overflow-hidden bg-canvas">
        <Image
          src={post.cover.src}
          alt={post.cover.alt}
          fill
          priority={priority}
          sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 380px"
          className="object-cover transition-transform duration-500 ease-[cubic-bezier(0.23,1,0.32,1)] group-hover:scale-[1.03] motion-reduce:transition-none motion-reduce:group-hover:scale-100"
        />
        <div aria-hidden className="absolute inset-0 ring-1 ring-inset ring-white/[0.06]" />
      </div>

      <div className="flex flex-1 flex-col p-6">
        <PostMeta post={post} />
        <h3 className="mt-4 text-[19px] font-semibold leading-[1.25] tracking-[-0.01em] text-foreground">
          {post.title}
        </h3>
        <p className="mt-2.5 line-clamp-3 text-[14px] leading-[1.6] text-muted">
          {post.description}
        </p>
        <span className="mt-auto inline-flex items-center gap-1.5 pt-6 text-[13px] font-medium leading-none text-muted transition-colors duration-200 group-hover:text-foreground">
          Read it
          <span
            aria-hidden
            className="transition-transform duration-300 ease-[cubic-bezier(0.23,1,0.32,1)] group-hover:translate-x-0.5 motion-reduce:transition-none"
          >
            &gt;
          </span>
        </span>
      </div>
    </Link>
  );
}
