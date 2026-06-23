'use client';

import Image from 'next/image';
import { GyroidField } from '@/components/ui/GyroidField';

/**
 * BlogCover - smooth hex-gyroid generative field over a static fallback.
 *
 * Layer order (bottom to top):
 *   1. Static /blog-covers/ JPEG - always rendered; used by crawlers + WebGL-off
 *   2. GyroidField (hex variant) - mounts when near viewport; covers the JPEG
 *   3. Shiny matte - subtle diagonal specular sheen for a premium finish
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
      {/* Smooth hex honeycomb gyroid - mounts when near viewport */}
      <GyroidField
        variant="hex"
        seed={seed}
        className="absolute inset-0 z-10"
      />
      {/* Shiny matte: diagonal specular sheen for a premium glass finish */}
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 z-[15]"
        style={{
          background:
            'linear-gradient(145deg, rgba(255,255,255,0.06) 0%, rgba(255,255,255,0.01) 38%, transparent 58%)'
        }}
      />
    </>
  );
}
