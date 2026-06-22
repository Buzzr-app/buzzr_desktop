'use client';

import dynamic from 'next/dynamic';
import { Component, useEffect, useState, type ReactNode } from 'react';
import { PhoneShowcase } from '@/components/ui/PhoneShowcase';
import { PixelAura } from '@/components/ui/PixelAura';

/** Static fallback shown while the WebGL chunk loads or if WebGL is unavailable. */
function Poster() {
  return (
    <div className="flex h-full w-full items-center justify-center">
      <PhoneShowcase
        src="/app-screens/dashboard.png"
        alt=""
        priority
        aura
        size="standard"
      />
    </div>
  );
}

// WebGL scene is client-only (needs the DOM) and heavy, so load it lazily;
// the poster shows until it is ready.
const ClayHeroScene = dynamic(() => import('./ClayHeroScene'), {
  ssr: false,
  loading: () => <Poster />
});

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

/** Cheap synchronous probe - avoids constructing the renderer (and its throw path). */
function hasWebGL(): boolean {
  if (typeof window === 'undefined') return false;
  try {
    return !!document.createElement('canvas').getContext('webgl2');
  } catch {
    return false;
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
    if (hasWebGL()) setShowScene(true);
  }, []);
  return (
    <div data-hero-pin className={`relative h-[200vh] motion-reduce:h-auto ${className ?? ''}`}>
      <div className="sticky top-0 h-screen w-full overflow-hidden hero-stage landing-dark">
        <PixelAura density="hero" className="absolute inset-0" />
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
