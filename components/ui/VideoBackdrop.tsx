'use client';

import { useEffect, useRef } from 'react';
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
  src = '/molten-flux.mp4',
  overlayClassName = 'bg-canvas/55',
  className,
  defer = false
}: {
  src?: string;
  overlayClassName?: string;
  className?: string;
  defer?: boolean;
}) {
  const ref = useRef<HTMLVideoElement>(null);

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

    if (!defer) return; // hero: source is in markup, autoPlay handles playback

    let done = false;
    const near = () => {
      const r = v.getBoundingClientRect();
      // Within ~1.5 viewports below or 0.5 above the fold.
      return r.top < window.innerHeight * 1.5 && r.bottom > -window.innerHeight * 0.5;
    };
    const check = () => {
      if (done || !near()) return;
      done = true;
      v.src = src;
      v.play().catch(() => {
        /* autoplay blocked (e.g. low-power mode): leave the first frame as a still */
      });
      window.removeEventListener('scroll', check);
      window.removeEventListener('resize', check);
    };
    // No mount-time check: a deferred backdrop is below the fold by definition, so
    // we wait for the user to scroll toward it. Checking at mount races layout and
    // can fire before the element has settled into its real (off-screen) position.
    window.addEventListener('scroll', check, { passive: true });
    window.addEventListener('resize', check, { passive: true });
    return () => {
      window.removeEventListener('scroll', check);
      window.removeEventListener('resize', check);
    };
  }, [defer, src]);

  return (
    <div aria-hidden className={cn('pointer-events-none absolute inset-0 overflow-hidden', className)}>
      <video
        ref={ref}
        className="h-full w-full object-cover"
        autoPlay
        loop
        muted
        playsInline
        preload="none"
      >
        {!defer ? <source src={src} type="video/mp4" /> : null}
      </video>
      <div className={cn('absolute inset-0', overlayClassName)} />
    </div>
  );
}
