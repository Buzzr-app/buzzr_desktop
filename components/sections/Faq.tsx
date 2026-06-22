import { Section } from '@/components/ui/Section';
import { FaqAccordion } from '@/components/FaqAccordion';
import { LEAGUES, LEAGUE_COUNT } from '@/src/lib/constants';

const LEAGUE_LIST = LEAGUES.map((l) => l.long).join(', ');

const FAQS = [
  { q: 'What is Buzzr?', a: 'Buzzr is the AI-native sports social app. Scroll live games, rate the action, follow dashboards, chat with friends, track leagues, and keep DFS slips in Buzzr Bets.' },
  { q: 'What is a Buzzr Score?', a: 'A single 1 to 10 signal for how alive a game feels. 9 and up is Peak, 8 to 8.9 is Great, 6.5 to 7.9 is Good, 5 to 6.4 is Mid, 3 to 4.9 is Bad, below 3 is Garbage. It blends star power, rivalry, stakes, game state, and fan reaction.' },
  { q: 'Is Buzzr a betting app?', a: 'No. Buzzr does not integrate sportsbooks, place wagers, or sell odds. Buzzr Bets is personal DFS slip tracking for picks placed elsewhere.' },
  { q: 'Which sports and leagues does it cover?', a: `Buzzr covers ${LEAGUE_COUNT} leagues across 12 sports: ${LEAGUE_LIST}. Live scores update in under 30 seconds where available; coverage tier varies by league.` },
  { q: 'How do friends and chat work?', a: 'Open a game, react, reply, and keep the take where the context lives. Friend threads, crews, and shared dashboards keep the conversation tied to the matchup instead of floating in a random group text.' },
  { q: 'Can I track DFS picks in Buzzr?', a: 'Yes. Buzzr Bets can track DFS slips from PrizePicks or Underdog and connect legs to game results where supported. You can also enter picks manually, compare history with friends, and review patterns. No sportsbooks are integrated.' },
  { q: 'What are Leagues?', a: 'Leagues are the app surface for the competitions you follow. Each league can expose schedules, scores, standings, recaps, dashboard widgets, and social activity depending on coverage status.' },
  { q: 'What is Pollen?', a: 'In-app points for engagement. Earn it through check-ins, predictions, crew entries, brackets, and activity. Pollen is not money, has no cash value, and is not a wager.' },
  { q: 'How do I get the app?', a: 'Buzzr is live on the iOS App Store and Google Play. Free on both.' },
  { q: 'Can I rate past games?', a: 'Yes. Search the catalog, log a game, score it, and add the memory to your profile.' },
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
        <p className="font-mono text-[12px] uppercase tracking-[0.22em] text-whisper">
          The rundown
        </p>
        <h2
          id="faq-title"
          className="mt-3 text-[clamp(32px,4.5vw,48px)] font-bold uppercase leading-[0.95] tracking-[-0.04em] text-foreground"
        >
          Questions.
        </h2>
        <p className="mt-4 text-[15px] leading-[1.6] text-muted">
          Everything you want to know before you scroll, score, and start running your group chat.
        </p>
      </header>

      <div className="max-w-[860px] rounded-2xl border border-[rgba(255,255,255,0.08)] bg-[rgba(255,255,255,0.015)] px-5 sm:px-7">
        <FaqAccordion items={FAQS} />
      </div>
    </Section>
  );
}
