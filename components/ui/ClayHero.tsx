'use client';

import { Component, useEffect, useState, type ReactNode } from 'react';
import { useViewportGate } from '@/components/hooks/useViewportGate';
import ClayHeroScene from './ClayHeroScene';
import { VideoBackdrop } from './VideoBackdrop';

/** Static fallback shown while the WebGL chunk loads or if WebGL is unavailable. */
function Poster() {
  return <div className="hero-scene-loading" aria-hidden />;
}

/** Falls back to the poster if the WebGL scene throws (e.g. no WebGL context). */
class WebGLBoundary extends Component<{ children: ReactNode }, { failed: boolean }> {
  state = { failed: false };
  static getDerivedStateFromError() {
    return { failed: true };
  }
  render() {
    return this.state.failed ? <Poster /> : this.props.children;
  }
}

/**
 * Pinned hero scene: a tall wrapper (`data-hero-pin`) holds a sticky 100vh stage.
 * Scroll through the wrapper drives the scene; the stage stays locked in the
 * viewport until the sequence finishes, then the page releases naturally.
 * Reduced-motion collapses the wrapper height so there is no dead scroll region.
 */
export function ClayHero({
  className,
  children
}: {
  className?: string;
  children?: ReactNode;
}) {
  const [pinRef, isHeroNearViewport] = useViewportGate<HTMLDivElement>({
    defaultActive: true,
    rootMargin: '320px 0px 900px 0px'
  });
  const [heroScrollActive, setHeroScrollActive] = useState(true);

  useEffect(() => {
    const heroReleaseTopPx = 320;
    const heroPreloadBottomPx = 900;
    let raf = 0;

    const updateHeroScrollActive = () => {
      if (raf) return;
      raf = window.requestAnimationFrame(() => {
        raf = 0;
        const node = pinRef.current;
        if (!node) {
          setHeroScrollActive(true);
          return;
        }

        const rect = node.getBoundingClientRect();
        setHeroScrollActive(
          rect.top < window.innerHeight + heroPreloadBottomPx &&
          rect.bottom > -heroReleaseTopPx
        );
      });
    };

    updateHeroScrollActive();
    window.addEventListener('scroll', updateHeroScrollActive, { passive: true });
    window.addEventListener('resize', updateHeroScrollActive);

    return () => {
      if (raf) window.cancelAnimationFrame(raf);
      window.removeEventListener('scroll', updateHeroScrollActive);
      window.removeEventListener('resize', updateHeroScrollActive);
    };
  }, [pinRef]);

  const isHeroActive = isHeroNearViewport && heroScrollActive;

  return (
    <div
      ref={pinRef}
      data-hero-active={isHeroActive ? 'true' : 'false'}
      data-hero-pin
      className={`relative h-[220vh] md:h-[260vh] motion-reduce:h-auto ${className ?? ''}`}
    >
      <div className="sticky top-0 h-screen w-full overflow-hidden hero-stage landing-dark">
        <VideoBackdrop
          active={isHeroActive}
          overlayClassName="bg-gradient-to-b from-canvas/42 via-canvas/36 to-canvas/78"
        />
        <div aria-hidden className="hero-ambient-field" />
        <div aria-hidden className="absolute inset-0 hero-canvas-clip">
          {isHeroActive ? (
            <WebGLBoundary>
              <ClayHeroScene />
            </WebGLBoundary>
          ) : (
            <Poster />
          )}
        </div>
        <div aria-hidden className="hero-vignette" />
        <div aria-hidden className="hero-edge-blur" />
        <div aria-hidden className="hero-grain" />
        {children}
      </div>
    </div>
  );
}
