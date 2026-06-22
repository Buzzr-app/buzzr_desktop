import { Section } from '@/components/ui/Section';

type PromoReel = {
  body: string;
  poster: string;
  src: string;
  title: string;
};

const REELS: readonly PromoReel[] = [
  {
    title: 'Scroll',
    body: 'Live game cards, ratings, and league filters moving like the app.',
    src: '/promo/buzzr-scroll.mp4',
    poster: '/app-screens/games.png'
  },
  {
    title: 'Dashboards',
    body: 'Team context, standings, form, and schedule in one capture.',
    src: '/promo/buzzr-dashboard.mp4',
    poster: '/app-screens/dashboard.png'
  },
  {
    title: 'Friends',
    body: 'Chat, reactions, profile icons, and the social layer in motion.',
    src: '/promo/buzzr-friends.mp4',
    poster: '/app-screens/friends-chat.png'
  },
  {
    title: 'Bets',
    body: 'Manual DFS tracking with slip details, legs, and friend visibility.',
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
          App motion
        </p>
        <h2
          id="promo-title"
          className="font-hero mt-5 text-[clamp(38px,5vw,68px)] font-extrabold leading-[0.94] tracking-[-0.035em] text-foreground"
        >
          Real Buzzr clips, cut clean.
        </h2>
      </header>

      <div className="mt-10 grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-4">
        {REELS.map((reel) => (
          <article
            key={reel.title}
            className="overflow-hidden rounded-[28px] border border-white/[0.09] bg-white/[0.045] shadow-[0_30px_80px_rgba(0,0,0,0.28)]"
          >
            <div className="relative aspect-[9/16] overflow-hidden bg-black">
              <video
                aria-label={`${reel.title} promo clip`}
                autoPlay
                className="h-full w-full object-cover"
                loop
                muted
                playsInline
                poster={reel.poster}
                preload="metadata"
              >
                <source src={reel.src} type="video/mp4" />
              </video>
              <div
                aria-hidden
                className="pointer-events-none absolute inset-x-0 bottom-0 h-1/2 bg-gradient-to-t from-black/78 via-black/10 to-transparent"
              />
            </div>
            <div className="p-5">
              <h3 className="font-hero text-[24px] font-extrabold leading-none tracking-[-0.035em] text-foreground">
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
