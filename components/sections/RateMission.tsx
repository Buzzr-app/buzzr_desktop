import { Section } from '@/components/ui/Section';
import { PhoneShowcase } from '@/components/ui/PhoneShowcase';

export function RateMission() {
  return (
    <Section id="mission" aria-labelledby="mission-title" className="py-16 md:py-20">
      <div className="grid items-center gap-8 lg:grid-cols-[minmax(0,0.9fr)_minmax(340px,0.82fr)] lg:gap-10">
        <div className="mx-auto flex max-w-[520px] flex-col gap-5 text-center lg:mx-0 lg:text-left">
          <h2
            id="mission-title"
            className="text-[clamp(36px,5vw,58px)] font-semibold leading-[0.98] tracking-[-0.032em] text-foreground"
          >
            The AI layer for sports social.
          </h2>
          <p className="max-w-[36ch] text-[16px] leading-[1.5] text-muted lg:max-w-[40ch]">
            Buzzr turns live games, friend signals, league context, and ratings into one feed that understands the night.
          </p>
        </div>

        <div className="relative mx-auto grid w-full max-w-[430px] place-items-center lg:mx-0 lg:justify-self-end">
          <div className="absolute inset-6 rounded-[32px] bg-[#00c264]/10 blur-3xl" aria-hidden />
          <PhoneShowcase
            src="/app-screens/feed.png"
            alt="Buzzr AI feed with games, leagues, and friend signals"
            aura
            size="medium"
            className="mx-auto"
          />
        </div>
      </div>
    </Section>
  );
}
