'use client';

import { Component, useEffect, useState, type ReactNode } from 'react';
import { VideoBackdrop } from '@/components/ui/VideoBackdrop';
import ClayHeroScene from './ClayHeroScene';

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
  // Render the Poster on the server AND the first client render, then swap to
  // the WebGL scene only after mount. The scene is a `ssr:false` dynamic import:
  // gating it on a client-only probe during render (or even mounting it on the
  // first client pass) makes the server HTML disagree with the client tree
  // (Poster div vs. a Suspense boundary), which React reports as a hydration
  // mismatch and which left the hero stuck on the poster. Deferring the swap to
  // a post-mount effect guarantees identical first paint on both sides; the
  // scene then mounts client-only, with no hydration involved.
  const [showScene, setShowScene] = useState(false);
  useEffect(() => {
    setShowScene(true);
  }, []);
  return (
    <div data-hero-pin className={`relative h-[200vh] motion-reduce:h-auto ${className ?? ''}`}>
      <div className="sticky top-0 h-screen w-full overflow-hidden hero-stage landing-dark">
        <VideoBackdrop overlayClassName="bg-gradient-to-b from-canvas/45 via-canvas/40 to-canvas/75" />
        <div aria-hidden className="absolute inset-0 hero-canvas-clip">
          {showScene ? (
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
