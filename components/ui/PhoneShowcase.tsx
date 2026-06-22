import Image from 'next/image';
import { cn } from '@/components/utils';
import { PixelAura } from '@/components/ui/PixelAura';

type PhoneShowcaseProps = {
  alt: string;
  aura?: boolean;
  className?: string;
  priority?: boolean;
  screenClassName?: string;
  size?: 'compact' | 'medium' | 'standard';
  src: string;
};

export function PhoneShowcase({
  alt,
  aura = false,
  className,
  priority = false,
  screenClassName,
  size = 'standard',
  src
}: PhoneShowcaseProps) {
  return (
    <figure className={cn('phone-showcase', `phone-showcase-${size}`, className)}>
      {aura ? <PixelAura density="panel" className="phone-showcase__aura" /> : null}
      <div className="phone-showcase__shell">
        <div className="phone-showcase__screen">
          <Image
            src={src}
            alt={alt}
            fill
            sizes="(max-width: 768px) 76vw, 360px"
            className={cn('object-cover object-top', screenClassName)}
            priority={priority}
          />
        </div>
        <div aria-hidden className="phone-showcase__glass" />
        <div aria-hidden className="phone-showcase__edge phone-showcase__edge-left" />
        <div aria-hidden className="phone-showcase__edge phone-showcase__edge-right" />
      </div>
    </figure>
  );
}
