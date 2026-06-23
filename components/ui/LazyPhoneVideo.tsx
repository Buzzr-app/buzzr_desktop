'use client';

import Image from 'next/image';
import { useViewportGate } from '@/components/hooks/useViewportGate';
import { cn } from '@/components/utils';

type LazyPhoneVideoProps = {
  className?: string;
  eager?: boolean;
  label: string;
  poster: string;
  rootMargin?: string;
  sizes?: string;
  src: string;
};

export function LazyPhoneVideo({
  className,
  eager = false,
  label,
  poster,
  rootMargin = '360px 0px',
  sizes = '(max-width: 768px) 76vw, 360px',
  src
}: LazyPhoneVideoProps) {
  const [gateRef, isNearViewport] = useViewportGate<HTMLSpanElement>({
    defaultActive: eager,
    rootMargin
  });
  const shouldLoad = eager || isNearViewport;

  return (
    <span
      ref={gateRef}
      className="absolute inset-0 block"
      data-lazy-phone-video={shouldLoad ? 'active' : 'poster'}
    >
      {shouldLoad ? (
        <video
          aria-label={label}
          autoPlay
          className={cn('phone-showcase__media', className)}
          data-lazy-phone-video="active"
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
          className={cn('phone-showcase__media', className)}
          data-lazy-phone-video="poster"
        />
      )}
    </span>
  );
}
