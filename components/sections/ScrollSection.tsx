import { Section } from '@/components/ui/Section';
import { PhoneShowcase } from '@/components/ui/PhoneShowcase';

export function ScrollSection() {
  return (
    <Section id="scroll" aria-labelledby="scroll-title" className="py-16 md:py-20">
      <div className="grid items-center gap-8 lg:grid-cols-[minmax(0,0.92fr)_minmax(340px,0.86fr)] lg:gap-10">
        <div className="mx-auto flex max-w-[520px] flex-col gap-5 text-center lg:mx-0 lg:text-left">
          <h2
            id="scroll-title"
            className="max-w-[13ch] text-[clamp(34px,4.8vw,56px)] font-semibold leading-[0.98] tracking-[-0.032em] text-foreground"
          >
            Scroll knows what games are becoming.
          </h2>

          <p className="max-w-[34ch] text-[16px] leading-[1.5] text-muted">
            A fast stream tuned by game state, stakes, and your leagues.
          </p>
        </div>

        <div className="relative mx-auto grid w-full max-w-[430px] place-items-center lg:mx-0 lg:justify-self-end">
          <div className="absolute inset-6 rounded-[32px] bg-[#00c264]/10 blur-3xl" aria-hidden />
          <PhoneShowcase
            src="/app-screens/games.png"
            alt="Buzzr Scroll game stream"
            priority
            aura
            size="medium"
            className="mx-auto"
          />
        </div>
      </div>
    </Section>
  );
}
