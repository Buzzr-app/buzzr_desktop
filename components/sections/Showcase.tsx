import { Section } from '@/components/ui/Section';
import { PhoneShowcase } from '@/components/ui/PhoneShowcase';

type Screen = {
  src: string;
  alt: string;
};

const SCREENS: Screen[] = [
  { src: '/app-screens/friends-chat.png', alt: 'Buzzr friends and chat activity' },
  { src: '/app-screens/feed.png', alt: 'Buzzr AI feed screen' },
  { src: '/app-screens/rate.png', alt: 'Buzzr game context screen' }
];

export function Showcase() {
  return (
    <Section id="showcase" aria-labelledby="showcase-title">
      <header className="mb-12 max-w-[48ch]">
        <h2
          id="showcase-title"
          className="text-[clamp(34px,4.8vw,56px)] font-semibold leading-[0.98] tracking-[-0.04em] text-foreground"
        >
          Friends and chat stay with the game.
        </h2>
        <p className="mt-4 max-w-[34ch] text-[16px] leading-[1.5] tracking-[-0.02em] text-muted">
          Matchups, takes, replies, and DMs stay attached to the moment.
        </p>
      </header>

      <div className="mx-auto grid max-w-[900px] grid-cols-1 gap-x-6 gap-y-8 sm:grid-cols-3 sm:gap-8">
        {SCREENS.map((s, i) => (
          <PhoneShowcase
            key={s.src}
            src={s.src}
            alt={s.alt}
            priority={i === 0}
            size="medium"
            className="mx-auto"
          />
        ))}
      </div>
    </Section>
  );
}
