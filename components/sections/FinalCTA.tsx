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
        <p className="max-w-[34ch] text-pretty text-[18px] leading-[1.5] tracking-[-0.015em] text-white/62 motion-safe:animate-[ctaReveal_0.7s_var(--ease-out)_0.12s_both]">
          One app for the feed, dashboards, crews, leagues, and Buzzr Bets.
        </p>
        <MagneticButton
          href={APP_STORE_URL}
          external
          className="mt-2 inline-flex items-center gap-2 rounded-button bg-accent px-6 py-3.5 text-[15px] font-medium tracking-[-0.01em] text-on-accent shadow-[var(--shadow-card)] transition-[background-color,transform] duration-150 ease-[var(--ease-out)] hover:bg-accent-dim active:scale-[0.97] focus-visible:outline-none focus-visible:shadow-[var(--shadow-focus)] motion-safe:animate-[ctaReveal_0.7s_var(--ease-out)_0.18s_both]"
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
