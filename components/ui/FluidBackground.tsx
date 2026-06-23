'use client';

import { useViewportGate } from '@/components/hooks/useViewportGate';
import { cn } from '@/components/utils';

/**
 * FluidBackground - embeds a Fluid (fluid.krackeddevs.com) generative-art
 * preset as a decorative background layer.
 *
 * Option A (live): a perf-gated <iframe> that renders the preset on the
 *   visitor's GPU. Mounts only when the host is near the viewport, never
 *   intercepts clicks, and is hidden from assistive tech + tab order.
 * Option B (fallback): always painted UNDER the iframe - a hosted still frame
 *   if `fallbackSrc` is given, otherwise a brand-token gradient. Guarantees the
 *   layer is never blank/offline-black if Fluid is slow or unreachable.
 *
 * Fluid sets `frame-ancestors *`, so embedding is allowed; `allow-same-origin`
 * is required for its blob web-workers to boot.
 */

type FluidBackgroundProps = {
  /** Fluid preset URL (the `#p=...` permalink). */
  src: string;
  /** Optional hosted still frame for Option B. Falls back to a token gradient. */
  fallbackSrc?: string;
  className?: string;
  title?: string;
};

export function FluidBackground({
  src,
  fallbackSrc,
  className,
  title = 'Generative background'
}: FluidBackgroundProps) {
  const [gateRef, isNear] = useViewportGate<HTMLDivElement>({
    defaultActive: false,
    rootMargin: '500px 0px'
  });

  return (
    <div ref={gateRef} aria-hidden className={cn('pointer-events-none overflow-hidden', className)}>
      {/* Option B - still fallback (hosted image or token gradient), never blank. */}
      <div
        className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,rgb(var(--accent-rgb)/0.16),rgb(var(--accent-rgb)/0.05)_46%,var(--color-canvas)_82%)]"
        style={
          fallbackSrc
            ? { backgroundImage: `url(${fallbackSrc})`, backgroundSize: 'cover', backgroundPosition: 'center' }
            : undefined
        }
      />
      {/* Option A - live Fluid render, mounted only near the viewport. */}
      {isNear ? (
        <iframe
          src={src}
          title={title}
          tabIndex={-1}
          loading="lazy"
          referrerPolicy="no-referrer"
          sandbox="allow-scripts allow-same-origin"
          className="absolute inset-0 h-full w-full border-0"
        />
      ) : null}
    </div>
  );
}
