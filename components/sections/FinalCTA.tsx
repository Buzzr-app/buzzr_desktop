import Link from 'next/link';
import { Section } from '@/components/ui/Section';
import { APP_STORE_URL } from '@/src/lib/constants';

export function FinalCTA() {
  return (
    <Section id="download" aria-labelledby="cta-title" className="text-center">
      <div className="mx-auto flex max-w-[760px] flex-col items-center gap-6 py-16">
        <h2
          id="cta-title"
          className="text-[clamp(36px,5vw,48px)] font-bold uppercase leading-[0.95] tracking-[-0.04em] text-foreground"
        >
          Rate the game.
        </h2>
        <p className="text-[20px] leading-[1.4] tracking-[-0.025em] text-muted">
          Free on iOS and Android.
        </p>
        <Link
          href={APP_STORE_URL}
          target="_blank"
          rel="noopener noreferrer"
          className="mt-2 inline-flex items-center rounded-2xl bg-foreground px-3 py-1 text-[14px] tracking-[-0.025em] text-canvas transition-colors hover:bg-foreground/90"
        >
          Get the App
        </Link>
      </div>
    </Section>
  );
}
