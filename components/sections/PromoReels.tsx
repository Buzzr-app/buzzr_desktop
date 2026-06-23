import { ScrollText, ChartSpline, MessagesSquare, WalletCards, type LucideIcon } from 'lucide-react';
import { Section } from '@/components/ui/Section';
import { PhoneShowcase } from '@/components/ui/PhoneShowcase';

type PromoReel = {
  Icon: LucideIcon;
  body: string;
  poster: string;
  src: string;
  title: string;
};

const REELS: readonly PromoReel[] = [
  {
    Icon: ScrollText,
    title: 'Scroll',
    body: 'Every game, rated and ranked as it happens.',
    src: '/promo/buzzr-scroll.mp4',
    poster: '/app-screens/games.png'
  },
  {
    Icon: ChartSpline,
    title: 'Dashboards',
    body: 'Your teams, scores, and standings in one glance.',
    src: '/promo/buzzr-dashboard.mp4',
    poster: '/app-screens/dashboard.png'
  },
  {
    Icon: MessagesSquare,
    title: 'Friends',
    body: 'Talk trash and react with your crew, live.',
    src: '/promo/buzzr-friends.mp4',
    poster: '/app-screens/friends-chat.png'
  },
  {
    Icon: WalletCards,
    title: 'Bets',
    body: 'Track your DFS slips with the whole crew.',
    src: '/promo/buzzr-bets.mp4',
    poster: '/app-screens/bets-manual.png'
  }
];

export function PromoReels() {
  return (
    <Section
      id="promo"
      aria-labelledby="promo-title"
      className="max-w-[1480px] py-16 md:py-24"
    >
      <header className="mx-auto max-w-[760px] text-center">
        <p className="font-mono text-[11px] font-semibold uppercase leading-none tracking-[0.34em] text-accent-text">
          In motion
        </p>
        <h2
          id="promo-title"
          className="font-hero mt-5 text-balance text-[clamp(38px,5vw,68px)] font-extrabold leading-[0.94] tracking-[-0.035em] text-foreground"
        >
          It moves like the game.
        </h2>
      </header>

      <div className="mt-10 grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-4">
        {REELS.map((reel) => (
          <article
            key={reel.title}
            className="overflow-hidden rounded-[28px] border border-white/[0.09] bg-white/[0.045] shadow-[0_30px_80px_rgba(0,0,0,0.28)]"
          >
            <div className="flex justify-center bg-gradient-to-b from-white/[0.035] to-transparent px-4 pb-2 pt-8">
              <PhoneShowcase size="medium" className="w-full max-w-[226px]">
                <video
                  aria-label={`${reel.title} promo clip`}
                  autoPlay
                  className="absolute inset-0 h-full w-full object-cover"
                  loop
                  muted
                  playsInline
                  poster={reel.poster}
                  preload="metadata"
                >
                  <source src={reel.src} type="video/mp4" />
                </video>
              </PhoneShowcase>
            </div>
            <div className="p-5">
              <h3 className="font-hero flex items-center gap-2.5 text-[24px] font-extrabold leading-none tracking-[-0.035em] text-foreground">
                <span aria-hidden className="grid size-9 shrink-0 place-items-center rounded-control border border-white/[0.1] bg-accent/[0.12] text-accent-text">
                  <reel.Icon size={18} strokeWidth={1.9} />
                </span>
                {reel.title}
              </h3>
              <p className="mt-2 text-[14px] leading-[1.45] tracking-[-0.01em] text-muted">
                {reel.body}
              </p>
            </div>
          </article>
        ))}
      </div>
    </Section>
  );
}
