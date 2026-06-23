import type { CSSProperties, ReactNode } from 'react';
import Image from 'next/image';
import { cn } from '@/components/utils';
import { PixelAura } from '@/components/ui/PixelAura';

type PhoneShowcaseProps = {
  alt?: string;
  aura?: boolean;
  children?: ReactNode;
  className?: string;
  phoneMax?: string;
  priority?: boolean;
  screenClassName?: string;
  size?: 'compact' | 'medium' | 'standard';
  src?: string;
};

export function PhoneShowcase({
  alt = '',
  aura = false,
  children,
  className,
  phoneMax,
  priority = false,
  screenClassName,
  size = 'standard',
  src
}: PhoneShowcaseProps) {
  const phoneStyle = phoneMax
    ? ({ '--phone-max': phoneMax } as CSSProperties)
    : undefined;

  return (
    <figure
      className={cn('phone-showcase', `phone-showcase-${size}`, className)}
      style={phoneStyle}
    >
      {aura ? <PixelAura density="panel" className="phone-showcase__aura" /> : null}
      <div className="phone-showcase__shell">
        <div className="phone-showcase__screen">
          {children ??
            (src ? (
              <Image
                src={src}
                alt={alt}
                fill
                sizes="(max-width: 768px) 76vw, 360px"
                className={cn('phone-showcase__media', screenClassName)}
                priority={priority}
              />
            ) : null)}
        </div>
        <div aria-hidden className="phone-showcase__island" />
        <div aria-hidden className="phone-showcase__glass" />
        <div aria-hidden className="phone-showcase__edge phone-showcase__edge-left" />
        <div aria-hidden className="phone-showcase__edge phone-showcase__edge-right" />
      </div>
    </figure>
  );
}
