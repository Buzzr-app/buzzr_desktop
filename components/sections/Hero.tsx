import { ClayHero } from '@/components/ui/ClayHero';
import { HeroCopy } from '@/components/ui/HeroCopy';

export function Hero() {
  return (
    <section id="top" aria-labelledby="hero-title" className="relative w-full">
      {/* Pinned scene: tall wrapper + sticky 100vh stage host the WebGL hero.
          HeroCopy overlays the scroll-driven copy choreography (intro → reveal),
          locked to the same pin progress that drives the ball burst + phone rise. */}
      <ClayHero>
        <HeroCopy />
      </ClayHero>
    </section>
  );
}
