'use client';

import Image from 'next/image';
import { Play } from 'lucide-react';
import { useState } from 'react';
import { cn } from '@/components/utils';

interface VideoSurfaceProps {
  posterSrc: string;
  posterAlt: string;
  title: string;
  youtubeId: string | null;
  className?: string;
  description?: string;
  eyebrow?: string;
  fallbackUrl?: string | null;
}

function getYoutubeEmbedSrc(youtubeId: string | null) {
  if (!youtubeId || !/^[A-Za-z0-9_-]{11}$/.test(youtubeId)) {
    return null;
  }

  return `https://www.youtube-nocookie.com/embed/${youtubeId}?autoplay=1&rel=0&modestbranding=1&playsinline=1`;
}

export function VideoSurface({
  posterSrc,
  posterAlt,
  title,
  youtubeId,
  className,
  description,
  eyebrow,
  fallbackUrl
}: VideoSurfaceProps) {
  const [isPlaying, setIsPlaying] = useState(false);
  const embedSrc = getYoutubeEmbedSrc(youtubeId);
  const canPlay = Boolean(embedSrc);

  return (
    <figure
      className={cn(
        'relative overflow-hidden rounded-callout border border-border bg-surface shadow-card',
        className
      )}
    >
      <div className="relative aspect-[16/10] overflow-hidden bg-steel">
        {isPlaying && embedSrc ? (
          <iframe
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
            allowFullScreen
            className="absolute inset-0 h-full w-full"
            referrerPolicy="strict-origin-when-cross-origin"
            src={embedSrc}
            title={title}
          />
        ) : (
          <>
            <Image
              src={posterSrc}
              alt={posterAlt}
              fill
              sizes="(min-width: 1024px) 560px, 100vw"
              className="object-cover"
              priority={false}
            />
            <div
              aria-hidden
              className="absolute inset-0 bg-gradient-to-t from-black/72 via-black/18 to-transparent"
            />
            {canPlay ? (
              <button
                type="button"
                aria-label={`Play ${title}`}
                className="absolute inset-0 grid place-items-center text-white"
                onClick={() => setIsPlaying(true)}
              >
                <span className="inline-flex h-16 w-16 items-center justify-center rounded-full border border-white/30 bg-white/18 shadow-card backdrop-blur-md transition-transform hover:scale-105 focus-visible:scale-105">
                  <Play aria-hidden className="ml-1 h-7 w-7 fill-current" />
                </span>
              </button>
            ) : (
              <div className="absolute right-4 top-4 rounded-full border border-white/16 bg-black/28 px-3 py-1.5 font-mono text-[10px] uppercase leading-none tracking-[0.12em] text-white/72 backdrop-blur-md">
                Official source
              </div>
            )}
            <div className="absolute inset-x-0 bottom-0 p-5 text-white">
              {eyebrow ? (
                <p className="font-mono text-[11px] uppercase tracking-[0.14em] text-white/70">
                  {eyebrow}
                </p>
              ) : null}
              <figcaption className="mt-1 text-heading font-semibold leading-[1.1] text-white">
                {title}
              </figcaption>
            </div>
          </>
        )}
      </div>
      {description || fallbackUrl ? (
        <div className="flex flex-col gap-3 border-t border-border p-4 text-body-sm text-muted sm:flex-row sm:items-center sm:justify-between">
          {description ? <p className="max-w-[62ch]">{description}</p> : null}
          {fallbackUrl ? (
            <a
              href={fallbackUrl}
            className="shrink-0 font-mono text-[11px] uppercase tracking-[0.12em] text-accent-text link-underline"
            rel="noreferrer"
            target="_blank"
          >
              Official source
            </a>
          ) : null}
        </div>
      ) : null}
    </figure>
  );
}
