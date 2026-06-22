// Geist (Vercel) - the clean, engineered grotesque the redesign is built on.
// Self-hosted via the `geist` package (no Google FOUT), exposing the CSS
// variables --font-geist-sans and --font-geist-mono.
//   - GeistSans: display + body. Authority comes from size + precise tracking,
//     not black weight (we top out at 600, never 900).
//   - GeistMono: tabular score numerals + mono eyebrow labels.
import { GeistSans } from 'geist/font/sans';
import { GeistMono } from 'geist/font/mono';
import { Bricolage_Grotesque } from 'next/font/google';

export const geistSans = GeistSans;
export const geistMono = GeistMono;

// Hero / big-heading display face: a modern grotesque with tighter, more
// characterful kerning than the body Geist. Loaded only where it is applied.
export const heroFont = Bricolage_Grotesque({
  subsets: ['latin'],
  weight: ['600', '700', '800'],
  display: 'swap',
  variable: '--ff-hero'
});
