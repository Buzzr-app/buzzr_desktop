import { Section } from '@/components/ui/Section';
import { Badge } from '@/components/ui/Badge';
import { DeviceFrame } from '@/components/ui/DeviceFrame';

type Screen = {
  src: string;
  eyebrow: string;
  caption: string;
};

const SCREENS: Screen[] = [
  { src: '/screenshot-home.png',  eyebrow: 'Feed',  caption: 'Ratings, takes, and news' },
  { src: '/screenshot-games.png', eyebrow: 'Games', caption: 'Every live game, scored' },
  { src: '/screenshot-rate.png',  eyebrow: 'Swipe', caption: 'Swipe to score, 1 to 10' }
];

export function Showcase() {
  return (
    <Section id="showcase" aria-labelledby="showcase-title">
      <header className="mb-12 max-w-[48ch]">
        <Badge>The app</Badge>
        <h2
          id="showcase-title"
          className="mt-3 text-[clamp(32px,4.5vw,48px)] font-bold uppercase leading-[0.95] tracking-[-0.04em] text-foreground"
        >
          The whole thing, in your pocket.
        </h2>
        <p className="mt-5 max-w-[44ch] text-[16px] leading-[1.5] tracking-[-0.025em] text-muted">
          Four taps from box score to banter. Here is exactly what you get.
        </p>
      </header>

      <div className="mx-auto grid max-w-[820px] grid-cols-1 gap-x-6 gap-y-12 sm:grid-cols-3 sm:gap-8">
        {SCREENS.map((s, i) => (
          <DeviceFrame
            key={s.src}
            src={s.src}
            alt={`Buzzr ${s.eyebrow} screen`}
            eyebrow={s.eyebrow}
            caption={s.caption}
            priority={i === 0}
          />
        ))}
      </div>
    </Section>
  );
}
