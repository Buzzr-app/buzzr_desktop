/**
 * Staged cinematic pin, read as five acts over a tall scroll wrapper. Every band
 * is normalized progress (0 = pin enters, 1 = pin releases), driven by both the
 * WebGL scene and the copy overlay so they stay locked together.
 *
 *   Act 1  0.00-0.12  opening hold     intro headline + idle-spinning ball, nothing moves yet
 *   Act 2  0.12-0.56  detonate         intro lifts away (introOut) as the ball bursts (burst)
 *   Act 3  0.30-0.74  emerge           the phone rises THROUGH the tail of the burst (phoneRise
 *                                      overlaps burst/burstFade). Its screen lights up WITH the rise
 *                                      (phoneSurface leads, from 0.40) - the dark graphite body would
 *                                      be invisible on the black stage unlit, so a *glowing* phone
 *                                      climbs in as the last voxels disperse: never an empty frame
 *   Act 4  0.62-0.84  reveal           BUZZR wordmark drops in (logo) over the now-lit phone
 *   Act 5  0.80-0.94  settle + hold    tagline/CTAs rise, then a held final pose to ~1.0 so the
 *                                      release into the next section never snaps or shows a gap
 */
export const HERO_BANDS = {
  introOut: [0.12, 0.46],
  burst: [0.2, 0.56],
  burstFade: [0.52, 0.72],
  phoneRise: [0.3, 0.74],
  phoneSurface: [0.4, 0.68],
  logo: [0.62, 0.84],
  tagline: [0.8, 0.94]
} as const;

export type HeroBand = readonly [number, number];

export const clampHeroProgress = (t: number) => Math.max(0, Math.min(1, t));

export function bandProgress([start, end]: HeroBand, value: number) {
  const t = clampHeroProgress((value - start) / (end - start));
  return t * t * (3 - 2 * t);
}

export function sampleHeroProgress(wrapper: HTMLElement | null, reducedMotion = false) {
  if (!wrapper) return reducedMotion ? 1 : 0;
  const rect = wrapper.getBoundingClientRect();
  const total = rect.height - window.innerHeight;
  if (total <= 0) return reducedMotion ? 1 : 0;
  return clampHeroProgress(-rect.top / total);
}
