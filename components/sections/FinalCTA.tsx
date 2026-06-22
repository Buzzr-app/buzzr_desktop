import { MagneticButton } from '@/components/ui/MagneticButton';
import { ShimmerHoverLabel } from '@/components/ui/BrandShimmer';
import { APP_STORE_URL } from '@/src/lib/constants';

export function FinalCTA() {
  return (
    <section
      id="download"
      aria-labelledby="cta-title"
      className="relative w-full bg-steel"
    >
      <div className="mx-auto flex max-w-[760px] flex-col items-center gap-7 px-6 py-28 text-center">
        <h2
          id="cta-title"
          className="text-[clamp(36px,5vw,56px)] font-semibold leading-[1.02] tracking-[-0.032em] text-on-steel"
        >
          Rate the game.
        </h2>
        <p className="text-[18px] leading-[1.5] tracking-[-0.015em] text-on-steel-muted">
          Free on iOS and Android.
        </p>
        <MagneticButton
          href={APP_STORE_URL}
          external
          className="mt-2 inline-flex items-center rounded-button bg-accent px-6 py-3.5 text-[15px] font-medium tracking-[-0.01em] text-on-accent shadow-[var(--shadow-card)] hover:bg-accent-dim focus-visible:outline-none focus-visible:shadow-[var(--shadow-focus)]"
        >
          <ShimmerHoverLabel>Get the app</ShimmerHoverLabel>
        </MagneticButton>
      </div>
    </section>
  );
}
