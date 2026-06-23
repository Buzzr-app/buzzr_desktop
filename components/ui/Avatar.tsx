import Image from 'next/image';

// DiceBear Notionists cast, downloaded to /public/avatars (MIT licensed). Each
// seed carries a vivid per-seed background, so the avatars double as the
// "splashes of intentional color" across the social surfaces (chat, reviews).
export const AVATAR_SEEDS = [
  'maya',
  'sid',
  'marcus',
  'alex',
  'nina',
  'jordan',
  'devin',
  'sam',
  'priya',
  'leo',
  'tyler',
  'chris'
] as const;

export type AvatarSeed = (typeof AVATAR_SEEDS)[number];

export function Avatar({
  className = '',
  seed,
  size = 36
}: {
  className?: string;
  seed: AvatarSeed;
  size?: number;
}) {
  return (
    <Image
      src={`/avatars/${seed}.svg`}
      alt=""
      width={size}
      height={size}
      unoptimized
      className={`rounded-full ${className}`}
    />
  );
}
