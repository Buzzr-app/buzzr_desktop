import Link from 'next/link';
import Image from 'next/image';
import type { Post } from '@/src/lib/blog';
import { formatPublishedDate } from '@/src/lib/blog';

type PostCardProps = {
  post: Post;
  priority?: boolean;
  variant?: 'lead' | 'standard';
};

function PostMeta({ post }: { post: Post }) {
  return (
    <div className="flex flex-wrap items-center gap-2 font-mono text-[11px] uppercase leading-[2] tracking-[0.12em] text-white/48">
      {post.tags[0] ? <span>{post.tags[0]}</span> : null}
      {post.tags[0] ? <span aria-hidden>/</span> : null}
      <time dateTime={post.publishedAt}>{formatPublishedDate(post.publishedAt)}</time>
      <span aria-hidden>/</span>
      <span>{post.readingTime} min read</span>
    </div>
  );
}

export function PostCard({ post, priority = false, variant = 'standard' }: PostCardProps) {
  if (variant === 'lead') {
    return (
      <Link
        href={`/blog/${post.slug}`}
        className="group grid overflow-hidden rounded-[8px] border border-white/12 bg-white/[0.045] shadow-[0_28px_80px_-54px_rgba(0,0,0,0.95)] transition-colors hover:border-white/28 lg:grid-cols-[1.1fr_0.9fr]"
      >
        <div className="relative min-h-[280px] overflow-hidden bg-[#121820] md:min-h-[420px]">
          <Image
            src={post.cover.src}
            alt={post.cover.alt}
            fill
            priority={priority}
            sizes="(max-width: 1024px) 100vw, 650px"
            className="object-cover opacity-[0.82] saturate-[0.9] transition duration-500 group-hover:scale-[1.02] group-hover:opacity-95"
          />
          <div className="absolute inset-x-0 bottom-0 h-1/2 bg-[linear-gradient(180deg,transparent,rgba(9,14,19,0.88))]" />
        </div>

        <div className="flex min-h-[320px] flex-col justify-between p-5 md:p-8">
          <div>
            <span className="mb-6 inline-flex rounded-full border border-accent/40 bg-accent/10 px-3 py-1 font-mono text-[11px] uppercase leading-none tracking-[0.12em] text-accent-text">
              Newest dispatch
            </span>
            <PostMeta post={post} />
            <h2 className="mt-5 max-w-[12ch] text-[34px] font-semibold leading-[1.02] tracking-[0] text-white md:text-[52px]">
              {post.title}
            </h2>
            <p className="mt-5 max-w-[44ch] text-[16px] leading-[1.6] tracking-[0] text-white/62 md:text-[18px]">
              {post.description}
            </p>
          </div>

          <span className="mt-8 inline-flex items-center gap-2 text-[14px] font-medium leading-none tracking-[0] text-white transition-transform group-hover:translate-x-1">
            Read the feature
            <span aria-hidden>-&gt;</span>
          </span>
        </div>
      </Link>
    );
  }

  return (
    <Link
      href={`/blog/${post.slug}`}
      className="group flex h-full flex-col overflow-hidden rounded-[8px] border border-white/10 bg-white/[0.035] transition-colors hover:border-white/25"
    >
      <div className="relative aspect-[4/3] overflow-hidden bg-[#121820]">
        <Image
          src={post.cover.src}
          alt={post.cover.alt}
          fill
          priority={priority}
          sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 360px"
          className="object-cover opacity-[0.74] saturate-[0.86] transition duration-500 group-hover:scale-[1.03] group-hover:opacity-90"
        />
      </div>
      <div className="flex flex-1 flex-col p-5">
        <PostMeta post={post} />
        <h3 className="mt-4 text-[22px] font-semibold leading-[1.16] tracking-[0] text-white transition-colors group-hover:text-white/78">
          {post.title}
        </h3>
        <p className="mt-3 line-clamp-3 text-[14px] leading-[1.55] tracking-[0] text-white/56">
          {post.description}
        </p>
        <div className="mt-5 flex flex-wrap gap-2">
          {post.tags.slice(0, 2).map((tag) => (
            <span
              key={tag}
              className="rounded-full border border-white/10 bg-white/[0.04] px-2.5 py-1 font-mono text-[10px] uppercase leading-none tracking-[0.12em] text-white/46"
            >
              {tag}
            </span>
          ))}
        </div>
        <span className="mt-auto pt-7 text-[14px] font-medium leading-none tracking-[0] text-white">
          Read
        </span>
      </div>
    </Link>
  );
}
