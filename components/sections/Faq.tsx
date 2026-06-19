import { Section } from '@/components/ui/Section';
import { Badge } from '@/components/ui/Badge';
import { FaqAccordion } from '@/components/FaqAccordion';

const FAQS = [
  { q: 'What is a Buzzr Score?', a: 'A single 1 to 10 entertainment rating for every live game. 9 and up is Elite, 7 to 8.9 is Good, 5 to 6.9 is Mid, 3 to 4.9 is Meh, below 3 is Skip. Built from chaos, energy, and drama, not the final score.' },
  { q: 'Is Buzzr a betting app?', a: 'No. Zero spreads, zero sportsbooks, zero affiliate odds. Buzzr is entertainment tracking. (You can log DFS picks from PrizePicks or Underdog for personal bookkeeping, see below.)' },
  { q: 'Which sports and leagues does it cover?', a: 'Buzzr covers 47 leagues across 12 sports: NBA, WNBA, NCAAM, NCAAW, NCAAF, NFL, MLB, NHL, MLS, EPL, La Liga, Bundesliga, Serie A, Ligue 1, Liga MX, NWSL, UCL, FIFA World Cup, Copa América, Euros, AFCON, Asian Cup, F1, NASCAR, IndyCar, MotoGP, UFC, Boxing, ATP, WTA, plus League of Legends, Valorant, Counter-Strike 2, Dota 2, IPL, BBL, PSL, CPL, The Hundred, ICC Cricket World Cup, international cricket, Six Nations, Premiership Rugby, Top 14, and Rugby World Cup. Live scores update in under 30 seconds where available; coverage tier varies by league.' },
  { q: 'What is a Watch Party?', a: 'A live rate-along with friends. One host, shared chat, shared RSVP, shared ratings. You can run it streaming or in-person, invite by link, and see the Buzzr Score shift together as the game unfolds.' },
  { q: 'What is the Swarm?', a: 'Your community feed, formerly Pulse. Who just rated what, who joined a watch party, who advanced in a bracket. Chat streaks and stacked message timestamps live here too. React with fire, open the game, keep scrolling.' },
  { q: 'Can I track DFS bets in Buzzr?', a: 'Yes. Snap a PrizePicks or Underdog slip and Buzzr OCRs it, links each leg to the right game, and auto-grades the bet as scores come in across NBA, NFL, MLB, and NHL. You can also enter bets manually with the player + game pickers, get a no-vig fair-line edge calculation, and follow public leaderboards or your crew bet pool. No sportsbooks are integrated, Buzzr just tracks what you placed elsewhere.' },
  { q: 'What sport brackets does Buzzr run?', a: 'NBA Playoffs (Play-In + series brackets), FIFA World Cup 2026, March Madness when in-season, plus per-tournament brackets for UFC and tennis Slams. Squad mode lets a crew share one leaderboard, with confidence weighting, series-script predictions, and Pollen rewards.' },
  { q: 'What is Pollen?', a: 'In-app points. You start with 1,000 Pollen and earn 100 daily for checking in, with bonuses at 3, 7, 14, and 30-day streaks. Spend it on predictions, watch-party RSVPs, and bracket entries. If you bankrupt below 50, you get auto-refilled to 250 once a day. No paywall, no purchases.' },
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
        <Badge>FAQ</Badge>
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
