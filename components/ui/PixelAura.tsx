import { cn } from '@/components/utils';
import type { CSSProperties } from 'react';

type PixelAuraProps = {
  className?: string;
  density?: 'hero' | 'footer' | 'panel';
};

const PIXELS = [
  [8, 12, 6, 0.35],
  [14, 34, 4, 0.22],
  [22, 18, 8, 0.3],
  [31, 62, 5, 0.2],
  [39, 28, 4, 0.18],
  [47, 48, 7, 0.34],
  [55, 14, 5, 0.24],
  [61, 36, 9, 0.34],
  [69, 21, 4, 0.22],
  [74, 58, 6, 0.28],
  [83, 33, 8, 0.32],
  [90, 13, 4, 0.2],
  [94, 68, 6, 0.24]
] as const;

export function PixelAura({ className, density = 'hero' }: PixelAuraProps) {
  return (
    <div aria-hidden className={cn('pixel-aura', `pixel-aura-${density}`, className)}>
      <div className="pixel-aura__bloom" />
      <div className="pixel-aura__subtract" />
      <div className="pixel-aura__grid">
        {PIXELS.map(([x, y, size, opacity], index) => (
          <span
            key={`${x}-${y}`}
            style={{
              '--x': `${x}%`,
              '--y': `${y}%`,
              '--s': `${size}px`,
              '--o': String(opacity),
              '--delay': `${index * 80}ms`
            } as CSSProperties}
          />
        ))}
      </div>
    </div>
  );
}
