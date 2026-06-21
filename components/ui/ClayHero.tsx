'use client';

import dynamic from 'next/dynamic';
import Image from 'next/image';
import { Component, type ReactNode } from 'react';

/** Static fallback shown while the WebGL chunk loads or if WebGL is unavailable. */
function Poster() {
  return (
    <div className="flex h-full w-full items-center justify-center">
      <Image
        src="/screenshot-dashboard.png"
        alt=""
        width={300}
        height={652}
        className="h-[82%] w-auto rounded-[2rem] border border-border object-contain shadow-[var(--shadow-card)]"
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

export function ClayHero({ className }: { className?: string }) {
  return (
    <div className={className} aria-hidden>
      <WebGLBoundary>
        <ClayHeroScene />
      </WebGLBoundary>
    </div>
  );
}
