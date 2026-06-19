import { Section } from '@/components/ui/Section';
import { CalloutCard } from '@/components/ui/CalloutCard';
import { Badge } from '@/components/ui/Badge';
import { APP_STORE_URL } from '@/src/lib/constants';

type Review = {
  title: string;
  body: string;
  author: string;
  age: string;
  stars: 1 | 2 | 3 | 4 | 5;
};

export const REVIEWS_SUMMARY = { rating: 5.0, count: 4 };
const SUMMARY = REVIEWS_SUMMARY;

const REVIEWS: Review[] = [
  {
    title: 'The Watch Party feature carried March Madness for me',
    body: "Got 9 friends in a party for the Final Four, live reactions popping off, everyone's brackets on one screen. This replaced our groupchat. Only complaint is I wish I could pin someone's reactions so I could see my buddy's meltdown in real time without scrolling. Otherwise perfect, we're doing the whole NBA playoffs here now.",
    author: 'Sid Sain',
    age: '2D AGO',
    stars: 5
  },
  {
    title: 'finally an app that treats WTA like it matters',
    body: "Been waiting years for something that covers women's tennis without burying it. Buzzr actually has WTA swipes with headshots and set scores and everything. Only knocking a star because the tennis deep links occasionally open to a blank screen and I have to back out and tap again. Fix that and it's a 5.",
    author: 'sarveshsea',
    age: '2D AGO',
    stars: 5
  },
  {
    title: 'okay the swipe thing is actually addictive',
    body: "I downloaded this to rate one game and ended up swiping for 45 minutes. Didn't even realize. Right to love a take, left to skip, and every once in a while it throws a random person at you to follow. Followed like 8 people already. My screen time is cooked.",
    author: 'a.sar11',
    age: '2D AGO',
    stars: 5
  },
  {
    title: 'Amazing',
    body: 'This is a cool place to look out for games and rate with my friends.',
    author: 'jinwhys',
    age: '2D AGO',
    stars: 5
  }
];

export function Reviews() {
  return (
    <Section id="reviews" aria-labelledby="reviews-title">
      <header className="mb-10 grid gap-8 md:grid-cols-[1fr_1.4fr] md:items-end md:gap-16">
        <div>
          <Badge>Ratings &amp; Reviews</Badge>
          <h2
            id="reviews-title"
            className="mt-3 text-[clamp(32px,4.5vw,48px)] font-bold uppercase leading-[0.95] tracking-[-0.04em] text-foreground"
          >
            5.0 on the App Store.
          </h2>
        </div>

        <div className="flex items-end gap-8">
          <div>
            <div className="score-mono text-[64px] leading-[1] tracking-[-0.025em] text-foreground">
              {SUMMARY.rating.toFixed(1)}
            </div>
            <Badge>OUT OF 5</Badge>
          </div>
          <div className="flex-1 pb-2">
            <Badge>{SUMMARY.count} RATINGS</Badge>
          </div>
        </div>
      </header>

      <div className="grid gap-3 md:grid-cols-2">
        {REVIEWS.map((r) => (
          <ReviewCard key={r.author} review={r} />
        ))}
      </div>

      <div className="mt-10 flex items-center justify-center">
        <a
          href={APP_STORE_URL}
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center gap-2 rounded-full border border-white/25 px-4 py-2 text-[14px] tracking-[-0.025em] text-foreground transition-colors hover:border-white/50"
        >
          Read all reviews on the App Store
          <span aria-hidden>→</span>
        </a>
      </div>
    </Section>
  );
}

function ReviewCard({ review }: { review: Review }) {
  return (
    <CalloutCard as="article">
      <header className="mb-3 flex items-start justify-between gap-4">
        <h3 className="text-[16px] leading-[1.5] tracking-[-0.025em] text-foreground">{review.title}</h3>
        <div className="shrink-0 text-right">
          <Badge>{review.age}</Badge>
          <div className="font-mono text-[12px] tracking-[0.1em] leading-[2] text-muted">{review.author}</div>
        </div>
      </header>
      <p className="text-[14px] leading-[1.43] tracking-[0.1px] text-muted">{review.body}</p>
    </CalloutCard>
  );
}
