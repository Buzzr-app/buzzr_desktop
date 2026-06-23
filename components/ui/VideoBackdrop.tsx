'use client';

import { useEffect, useRef } from 'react';
import { useViewportGate } from '@/components/hooks/useViewportGate';
import { cn } from '@/components/utils';

/**
 * Looping muted video background. Sits behind content; the overlay keeps any
 * foreground text legible. `preload="none"` keeps the 11MB clip off the initial
 * resource priority list in every case.
 *
 *  - Default (hero): the `<source>` is in markup and the `autoPlay` attribute
 *    drives playback - the dependable, policy-blessed path for muted media. It is
 *    on screen, so loading it right after first paint is fine.
 *  - `defer` (footer): the source is attached from JS only once the backdrop
 *    nears the viewport. The footer lives far below the fold on every route, and
 *    the autoplay attribute alone would still fetch the full clip on load, so
 *    deferring the source is the only way to guarantee it is not pulled down for
 *    a surface most visitors never scroll to.
 *  - `prefers-reduced-motion` tears the source out: no animated loop, no
 *    download; the static overlay + page background remain.
 */
export function VideoBackdrop({
  active = true,
  src = '/molten-flux.mp4',
  overlayClassName = 'bg-canvas/55',
  className,
  defer = false
}: {
  active?: boolean;
  src?: string;
  overlayClassName?: string;
  className?: string;
  defer?: boolean;
}) {
  const ref = useRef<HTMLVideoElement>(null);
  const [gateRef, isNearViewport] = useViewportGate<HTMLDivElement>({
    defaultActive: !defer,
    disabled: !defer,
    rootMargin: '1200px 0px'
  });
  const shouldLoad = active && (!defer || isNearViewport);

  useEffect(() => {
    const v = ref.current;
    if (!v) return;
    v.muted = true;

    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
      v.removeAttribute('autoplay');
      v.pause();
      v.querySelectorAll('source').forEach((s) => s.remove());
      v.removeAttribute('src');
      v.load();
      return;
    }

    if (!shouldLoad) {
      v.pause();
      v.load();
      return;
    }

    v.play().catch(() => {
      /* Autoplay blocked, low power mode, or tab throttling: keep the poster frame. */
    });
  }, [shouldLoad]);

  return (
    <div
      ref={gateRef}
      aria-hidden
      className={cn('pointer-events-none absolute inset-0 overflow-hidden', className)}
      data-video-backdrop-active={shouldLoad ? 'true' : 'false'}
    >
      {shouldLoad ? (
        <video
          ref={ref}
          className="h-full w-full object-cover"
          autoPlay
          loop
          muted
          playsInline
          preload="none"
        >
          <source src={src} type="video/mp4" />
        </video>
      ) : null}
      <div className={cn('absolute inset-0', overlayClassName)} />
    </div>
  );
}
