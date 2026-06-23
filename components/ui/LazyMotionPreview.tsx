'use client';

import Image from 'next/image';
import { useViewportGate } from '@/components/hooks/useViewportGate';
import { cn } from '@/components/utils';

type LazyMotionPreviewProps = {
  className?: string;
  eager?: boolean;
  label: string;
  poster: string;
  rootMargin?: string;
  sizes?: string;
  src: string;
};

export function LazyMotionPreview({
  className,
  eager = false,
  label,
  poster,
  rootMargin = '700px 0px',
  sizes = '(max-width: 768px) 82vw, 520px',
  src
}: LazyMotionPreviewProps) {
  const [frameRef, isNearViewport] = useViewportGate<HTMLDivElement>({
    defaultActive: eager,
    rootMargin
  });
  const shouldLoad = eager || isNearViewport;

  return (
    <div
      ref={frameRef}
      className={cn('lazy-motion-preview', className)}
      data-lazy-motion-preview={shouldLoad ? 'active' : 'poster'}
    >
      {shouldLoad ? (
        <video
          aria-label={label}
          autoPlay
          className="lazy-motion-preview__media"
          loop
          muted
          playsInline
          poster={poster}
          preload="metadata"
        >
          <source src={src} type="video/mp4" />
        </video>
      ) : (
        <Image
          src={poster}
          alt={label}
          fill
          sizes={sizes}
          className="lazy-motion-preview__media"
        />
      )}
    </div>
  );
}
