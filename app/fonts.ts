import { Montserrat, Space_Mono } from 'next/font/google';

// Montserrat is the Buzzr app's real display/body face (see app src/theme/typography.ts).
// Loaded across the weight range so display type can carry mass at 800/900.
export const montserrat = Montserrat({
  subsets: ['latin'],
  weight: ['400', '500', '600', '700', '800', '900'],
  variable: '--font-montserrat',
  display: 'swap'
});

// Space Mono drives tabular score numerals + mono eyebrow labels.
export const spaceMono = Space_Mono({
  subsets: ['latin'],
  weight: ['400', '700'],
  variable: '--font-space-mono',
  display: 'swap'
});
