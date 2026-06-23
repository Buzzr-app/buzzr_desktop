import { MagneticButton } from '@/components/ui/MagneticButton';
import { ShimmerHoverLabel } from '@/components/ui/BrandShimmer';
import { AppleIcon } from '@/components/ui/BrandIcons';
import { btnPrimary } from '@/components/ui/button';
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
      <div className="relative mx-auto flex max-w-[760px] flex-col items-center gap-7 px-6 py-28 text-center [--ease-out:cubic-bezier(0.23,1,0.32,1)]">
        <BrandMark
          alt="Buzzr"
          size={92}
          variant="transparent"
          className="motion-safe:animate-[ctaReveal_0.7s_var(--ease-out)_both]"
        />
        <h2
          id="cta-title"
          className="text-balance text-[clamp(36px,5vw,56px)] font-semibold leading-[1.02] tracking-[-0.032em] text-on-steel motion-safe:animate-[ctaReveal_0.7s_var(--ease-out)_0.06s_both]"
        >
          Sports feels better when Buzzr gets it.
        </h2>
        <MagneticButton
          href={APP_STORE_URL}
          external
          className={`${btnPrimary} mt-2 shadow-[var(--shadow-card)] motion-safe:animate-[ctaReveal_0.7s_var(--ease-out)_0.18s_both]`}
        >
          <AppleIcon size={18} />
          <ShimmerHoverLabel>Get the app</ShimmerHoverLabel>
        </MagneticButton>
      </div>

      <style>{`
        @keyframes ctaReveal {
          from { opacity: 0; transform: translate3d(0, 14px, 0); }
          to { opacity: 1; transform: translate3d(0, 0, 0); }
        }
        @media (prefers-reduced-motion: reduce) {
          @keyframes ctaReveal {
            from { opacity: 0; transform: none; }
            to { opacity: 1; transform: none; }
          }
        }
      `}</style>
    </section>
  );
}
