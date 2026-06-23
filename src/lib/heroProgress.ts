export const HERO_BANDS = {
  introOut: [0.16, 0.64],
  burst: [0.25, 0.65],
  burstFade: [0.66, 0.9],
  phoneRise: [0.3, 0.9],
  phoneSurface: [0.5, 0.76],
  logo: [0.66, 0.9],
  tagline: [0.74, 0.98]
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
