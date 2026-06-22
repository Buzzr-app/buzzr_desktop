import { MagneticButton } from '@/components/ui/MagneticButton';
import { ShimmerHoverLabel } from '@/components/ui/BrandShimmer';
import { AppleIcon } from '@/components/ui/BrandIcons';
import { APP_STORE_URL } from '@/src/lib/constants';
import { BrandMark } from '@/components/BrandMark';
import { PixelAura } from '@/components/ui/PixelAura';

export function FinalCTA() {
  return (
    <section
      id="download"
      aria-labelledby="cta-title"
      className="landing-dark relative w-full overflow-hidden"
    >
      <PixelAura density="footer" className="absolute inset-0" />
      <div className="relative mx-auto flex max-w-[760px] flex-col items-center gap-7 px-6 py-28 text-center">
        <BrandMark alt="Buzzr" size={92} variant="transparent" />
        <h2
          id="cta-title"
          className="text-[clamp(36px,5vw,56px)] font-semibold leading-[1.02] tracking-[-0.032em] text-on-steel"
        >
          Sports feels better when Buzzr gets it.
        </h2>
        <p className="max-w-[34ch] text-[18px] leading-[1.5] tracking-[-0.015em] text-white/62">
          One app for the feed, dashboards, crews, leagues, and Buzzr Bets.
        </p>
        <MagneticButton
          href={APP_STORE_URL}
          external
          className="mt-2 inline-flex items-center gap-2 rounded-button bg-accent px-6 py-3.5 text-[15px] font-medium tracking-[-0.01em] text-on-accent shadow-[var(--shadow-card)] hover:bg-accent-dim focus-visible:outline-none focus-visible:shadow-[var(--shadow-focus)]"
        >
          <AppleIcon size={18} />
          <ShimmerHoverLabel>Get the app</ShimmerHoverLabel>
        </MagneticButton>
      </div>
    </section>
  );
}
