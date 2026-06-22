'use client';

import { useEffect, useRef } from 'react';
import { cn } from '@/components/utils';

/**
 * Looping muted video background. Sits behind content; the overlay keeps any
 * foreground text legible. Autoplay is forced via a ref (React can drop the
 * `muted` attribute on first render, which browsers require for autoplay), and
 * `loop` gives a seamless repeat.
 */
export function VideoBackdrop({
  src = '/molten-flux.mp4',
  overlayClassName = 'bg-canvas/55',
  className
}: {
  src?: string;
  overlayClassName?: string;
  className?: string;
}) {
  const ref = useRef<HTMLVideoElement>(null);

  useEffect(() => {
    const v = ref.current;
    if (!v) return;
    v.muted = true;
    const play = () => {
      v.play().catch(() => {
        /* autoplay blocked (e.g. low-power mode): leave the first frame as a still */
      });
    };
    play();
    v.addEventListener('canplay', play, { once: true });
    return () => v.removeEventListener('canplay', play);
  }, []);

  return (
    <div aria-hidden className={cn('pointer-events-none absolute inset-0 overflow-hidden', className)}>
      <video
        ref={ref}
        className="h-full w-full object-cover"
        autoPlay
        loop
        muted
        playsInline
        preload="auto"
      >
        <source src={src} type="video/mp4" />
      </video>
      <div className={cn('absolute inset-0', overlayClassName)} />
    </div>
  );
}
