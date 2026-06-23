'use client';

import Image from 'next/image';
import { GyroidField } from '@/components/ui/GyroidField';

/**
 * BlogCover - generative Bayer-dithered gyroid over a static fallback.
 *
 * Layer order (bottom to top):
 *   1. Static /blog-covers/ JPEG - always rendered; used by crawlers + WebGL-off
 *   2. GyroidField (dither variant) - mounts when near viewport; covers the JPEG
 *
 * Both layers are decorative (aria-hidden on the outer container).
 * The alt string is still present in the DOM for search crawlers.
 */

type BlogCoverProps = {
  /** /blog-covers/... path - static fallback, also the JSON-LD image source */
  src: string;
  /** Descriptive alt for search crawlers (container is aria-hidden) */
  alt: string;
  /** Post index - drives per-post GyroidField seed so every cover is distinct */
  seed: number;
  priority?: boolean;
  sizes?: string;
};

export function BlogCover({ src, alt, seed, priority, sizes }: BlogCoverProps) {
  return (
    <>
      {/* Static fallback - visible when WebGL is unavailable, dimmed behind gyroid */}
      <Image
        src={src}
        alt={alt}
        fill
        priority={priority}
        sizes={sizes}
        className="object-cover opacity-55 saturate-[0.65]"
      />
      {/* Generative dither layer - mounts when near viewport, covers fallback */}
      <GyroidField
        variant="dither"
        seed={seed}
        className="absolute inset-0 z-10"
      />
    </>
  );
}
