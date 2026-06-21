// Geist (Vercel) — the clean, engineered grotesque the redesign is built on.
// Self-hosted via the `geist` package (no Google FOUT), exposing the CSS
// variables --font-geist-sans and --font-geist-mono.
//   - GeistSans: display + body. Authority comes from size + precise tracking,
//     not black weight (we top out at 600, never 900).
//   - GeistMono: tabular score numerals + mono eyebrow labels.
import { GeistSans } from 'geist/font/sans';
import { GeistMono } from 'geist/font/mono';

export const geistSans = GeistSans;
export const geistMono = GeistMono;
