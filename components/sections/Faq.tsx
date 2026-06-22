import { Section } from '@/components/ui/Section';
import { FaqAccordion } from '@/components/FaqAccordion';
import { LEAGUES, LEAGUE_COUNT } from '@/src/lib/constants';

const LEAGUE_LIST = LEAGUES.map((l) => l.long).join(', ');

const FAQS = [
  { q: 'What is a Buzzr Score?', a: 'A single 1 to 10 entertainment rating for every live game. 9 and up is Peak, 8 to 8.9 is Great, 6.5 to 7.9 is Good, 5 to 6.4 is Mid, 3 to 4.9 is Bad, below 3 is Garbage. Built from star power, rivalry, and stakes, not the final score.' },
  { q: 'Is Buzzr a betting app?', a: 'No. Zero spreads, zero sportsbooks, zero affiliate odds. Buzzr is entertainment tracking. (You can log DFS picks from PrizePicks or Underdog for personal bookkeeping, see below.)' },
  { q: 'Which sports and leagues does it cover?', a: `Buzzr covers ${LEAGUE_COUNT} leagues across 12 sports: ${LEAGUE_LIST}. Live scores update in under 30 seconds where available; coverage tier varies by league.` },
  { q: 'What are Crews?', a: 'Invite-only groups for your people. A shared bracket, a private leaderboard, and a group chat that runs the whole season. Spin one up for the playoffs, March Madness, or the World Cup and let the standings settle the arguments.' },
  { q: 'What is the Swarm?', a: 'Your community feed. Who just rated what, who joined a crew, who advanced in a bracket. Chat streaks and stacked message timestamps live here too. React with fire, open the game, keep scrolling.' },
  { q: 'Can I track DFS bets in Buzzr?', a: 'Yes. Snap a PrizePicks or Underdog slip and Buzzr OCRs it, links each leg to the right game, and auto-grades the bet as scores come in across NBA, NFL, MLB, and NHL. You can also enter bets manually with the player + game pickers, get a no-vig fair-line edge calculation, and follow public leaderboards or your crew bet pool. No sportsbooks are integrated, Buzzr just tracks what you placed elsewhere.' },
  { q: 'What sport brackets does Buzzr run?', a: 'NBA Playoffs (Play-In + series brackets), FIFA World Cup 2026, March Madness when in-season, plus per-tournament brackets for UFC and tennis Slams. Squad mode lets a crew share one leaderboard, with confidence weighting, series-script predictions, and Pollen rewards.' },
  { q: 'What is Pollen?', a: 'In-app points. You start with 1,000 Pollen and earn 100 daily for checking in, with bonuses at 3, 7, 14, and 30-day streaks. Spend it on predictions, crew entries, and bracket entries. Pollen is purely an engagement metric, so there is no wagering and no way to go bankrupt. No paywall, no purchases.' },
  { q: 'How do I get the app?', a: 'Buzzr is live on the iOS App Store and Google Play. Free on both.' },
  { q: 'Can I rate games from the past?', a: 'Yes. Search any game in the catalog, log it, rate it, and add it to your history. Last night or 2008 Finals.' },
  { q: 'How do I delete my account or data?', a: 'Settings → Delete account inside the app, or visit getbuzzr.online/delete-account from any browser. Full data export available on request via support.' }
];

export function Faq() {
  const faqLd = {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: FAQS.map(({ q, a }) => ({
      '@type': 'Question',
      name: q,
      acceptedAnswer: { '@type': 'Answer', text: a }
    }))
  };

  return (
    <Section id="faq" aria-labelledby="faq-title">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(faqLd) }} />

      <header className="mb-10 max-w-[720px]">
        <h2
          id="faq-title"
          className="mt-3 text-[clamp(32px,4.5vw,48px)] font-bold uppercase leading-[0.95] tracking-[-0.04em] text-foreground"
        >
          Questions.
        </h2>
      </header>

      <div className="max-w-[860px]">
        <FaqAccordion items={FAQS} />
      </div>
    </Section>
  );
}
