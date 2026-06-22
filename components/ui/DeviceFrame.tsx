import Image from 'next/image';
import { cn } from '@/components/utils';

interface DeviceFrameProps {
  src: string;
  alt: string;
  /** Caption eyebrow (short, uppercase, pixel font) */
  eyebrow?: string;
  /** One-line caption under the eyebrow */
  caption?: string;
  className?: string;
  priority?: boolean;
}

/**
 * Glass phone-shaped frame wrapping a screenshot. Used on the Product Canvas.
 */
export function DeviceFrame({ src, alt, eyebrow, caption, className, priority }: DeviceFrameProps) {
  return (
    <figure className={cn('flex flex-col items-center gap-4', className)}>
      <div className="relative aspect-[9/19] w-full max-w-[240px]">
        {/* Outer soft shadow for elevation off the dark canvas */}
        <div
          aria-hidden
          className="absolute -inset-[6px] rounded-[18px] shadow-[var(--shadow-card)]"
        />
        {/* Frame */}
        <div className="bg-canvas border border-surface relative h-full w-full overflow-hidden rounded-[14px] p-[3px]">
          <div className="relative h-full w-full overflow-hidden rounded-[13px] bg-canvas">
            <Image
              src={src}
              alt={alt}
              fill
              sizes="(max-width: 768px) 80vw, 240px"
              className="object-cover"
              priority={priority}
            />
            {/* Subtle top glare */}
            <div
              aria-hidden
              className="pointer-events-none absolute inset-x-0 top-0 h-14"
              style={{ background: 'linear-gradient(to bottom, rgba(255,255,255,0.08), transparent)' }}
            />
          </div>
        </div>
      </div>

      {(eyebrow || caption) && (
        <figcaption className="flex flex-col items-center gap-1 text-center">
          {eyebrow && (
            <span className="font-medium text-[9px] uppercase tracking-[0.24em] text-foreground">
              {eyebrow}
            </span>
          )}
          {caption && (
            <span className="text-xs text-muted">
              {caption}
            </span>
          )}
        </figcaption>
      )}
    </figure>
  );
}
