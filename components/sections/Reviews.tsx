import Image from 'next/image';
import { Section } from '@/components/ui/Section';
import { APP_STORE_URL } from '@/src/lib/constants';

// Live App Store numbers for Buzzr Sports (id6760628256).
export const REVIEWS_SUMMARY = { rating: 5.0, count: 11 };

type Review = {
  title: string;
  body: string;
  author: string;
  date: string;
  stars: 1 | 2 | 3 | 4 | 5;
  response?: string;
};

const REVIEWS: Review[] = [
  {
    title: 'Our group chat finally has a scoreboard',
    body: "Got 9 friends following the Final Four, live reactions popping off, everyone's brackets and takes in one place. this replaced our groupchat. only complaint is I wish i could pin someone's bracket to the top.",
    author: 'Sid',
    date: 'Apr 18',
    stars: 5,
    response:
      "9 friends following the Final Four with everyone's brackets on one screen is exactly why we built the social layer. Pinning is on the way."
  },
  {
    title: 'Just what I need with everything in one place',
    body: "Finally an app where you get to skip the fluff and give straight ratings on games from 1 to 10, see what other people thought, and maybe drop a take if you want. that's it. no betting spam.",
    author: 'Isishsbjssihsbnsjsjsi',
    date: 'Apr 22',
    stars: 5,
    response:
      '"No betting spam, no fantasy nonsense" is literally the whole point. Glad it clicked.'
  },
  {
    title: 'Chats has been a pretty nice experience',
    body: 'Been enjoying being able to chat with others and discover new friends that have the same niche sports interests as me. Its also fun to filter the swarm sometimes and rate it.',
    author: 'AllenJHHHHH',
    date: 'May 4',
    stars: 4,
    response:
      'This is exactly what we built the swarm for, niche sports fans finding each other. Thanks for being here.'
  }
];

// 5 to 1 star distribution for the histogram (avg 5.0 across 11 ratings).
const DISTRIBUTION: { stars: number; pct: number }[] = [
  { stars: 5, pct: 1 },
  { stars: 4, pct: 0.09 },
  { stars: 3, pct: 0 },
  { stars: 2, pct: 0 },
  { stars: 1, pct: 0 }
];

const STAR_PATH =
  'M10 1.5l2.6 5.27 5.82.85-4.21 4.1.99 5.78L10 14.77l-5.2 2.73.99-5.78-4.21-4.1 5.82-.85z';

function Stars({ value, sizeClass = 'h-3.5 w-3.5' }: { value: number; sizeClass?: string }) {
  return (
    <span
      className="inline-flex items-center gap-0.5"
      role="img"
      aria-label={`${value} out of 5 stars`}
    >
      {[0, 1, 2, 3, 4].map((i) => (
        <svg
          key={i}
          viewBox="0 0 20 20"
          fill="currentColor"
          aria-hidden
          className={`${sizeClass} ${i < value ? 'text-foreground' : 'text-foreground/15'}`}
        >
          <path d={STAR_PATH} />
        </svg>
      ))}
    </span>
  );
}

export function Reviews() {
  return (
    <Section id="reviews" aria-labelledby="reviews-title">
      {/* App lockup, App Store style */}
      <div className="mb-8 flex items-center gap-3.5">
        <Image
          src="/app-store-icon.png"
          alt="Buzzr Sports app icon"
          width={56}
          height={56}
          className="h-14 w-14 rounded-[13px] border border-border shadow-[var(--shadow-card)]"
        />
        <div>
          <p className="text-[15px] font-semibold leading-tight tracking-[-0.01em] text-foreground">
            Buzzr Sports
          </p>
          <p className="font-mono text-[11px] uppercase tracking-[0.14em] text-muted">App Store</p>
        </div>
      </div>

      <h2
        id="reviews-title"
        className="flex items-center gap-1.5 text-[22px] font-semibold tracking-[-0.02em] text-foreground"
      >
        Ratings &amp; Reviews
        <svg
          viewBox="0 0 24 24"
          className="h-4 w-4 text-whisper"
          fill="none"
          stroke="currentColor"
          strokeWidth={2.5}
          aria-hidden
        >
          <path d="M9 6l6 6-6 6" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
      </h2>

      {/* Summary: big score + distribution histogram */}
      <div className="mt-6 grid gap-8 border-b border-border pb-10 sm:grid-cols-[auto_1fr] sm:items-end sm:gap-14">
        <div>
          <div className="score-mono text-[72px] font-semibold leading-[0.9] tracking-[-0.03em] text-foreground">
            {REVIEWS_SUMMARY.rating.toFixed(1)}
          </div>
          <div className="mt-2">
            <Stars value={5} sizeClass="h-4 w-4" />
          </div>
          <p className="mt-1.5 text-[13px] text-muted">out of 5</p>
        </div>

        <div className="w-full max-w-[300px] justify-self-end">
          {DISTRIBUTION.map((row) => (
            <span
              key={row.stars}
              className="mb-1.5 block h-[6px] overflow-hidden rounded-full bg-foreground/[0.08] last:mb-0"
            >
              <span
                className="block h-full rounded-full bg-foreground/70"
                style={{ width: `${row.pct * 100}%` }}
              />
            </span>
          ))}
          <p className="mt-3 text-right text-[13px] text-muted">{REVIEWS_SUMMARY.count} Ratings</p>
        </div>
      </div>

      {/* Review cards */}
      <div className="mt-8 grid gap-4 md:grid-cols-3">
        {REVIEWS.map((r) => (
          <ReviewCard key={r.author} review={r} />
        ))}
      </div>

      <div className="mt-10 flex justify-center">
        <a
          href={APP_STORE_URL}
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center gap-2 rounded-button border border-border bg-surface px-5 py-3 text-[14px] font-medium tracking-[-0.01em] text-foreground transition-[transform,border-color,background-color] duration-200 ease-out hover:-translate-y-0.5 hover:border-accent/50 active:translate-y-0 focus-visible:outline-none focus-visible:shadow-[var(--shadow-focus)]"
        >
          See all reviews on the App Store
          <span aria-hidden>&rarr;</span>
        </a>
      </div>
    </Section>
  );
}

function ReviewCard({ review }: { review: Review }) {
  return (
    <article className="flex flex-col rounded-2xl border border-border bg-surface p-5">
      <div className="flex items-start justify-between gap-3">
        <h3 className="text-[15px] font-semibold leading-[1.35] tracking-[-0.01em] text-foreground">
          {review.title}
        </h3>
        <span className="shrink-0 pt-0.5 font-mono text-[11px] uppercase tracking-[0.08em] text-whisper">
          {review.date}
        </span>
      </div>

      <div className="mt-2 flex items-center gap-2">
        <Stars value={review.stars} sizeClass="h-3 w-3" />
        <span className="text-[12px] text-muted">{review.author}</span>
      </div>

      <p className="mt-3 text-[14px] leading-[1.5] text-muted">{review.body}</p>

      {review.response ? (
        <div className="mt-4 rounded-xl border border-border bg-subtle/60 p-3.5">
          <p className="font-mono text-[10px] uppercase tracking-[0.12em] text-whisper">
            Developer Response
          </p>
          <p className="mt-1.5 text-[13px] leading-[1.5] text-muted">{review.response}</p>
        </div>
      ) : null}
    </article>
  );
}
