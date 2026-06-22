import Image from 'next/image';
import { cn } from '@/components/utils';
import { BRAND_ASSETS, type BrandAssetVariant } from '@/src/lib/brandAssets';

type BrandMarkProps = {
  alt?: string;
  className?: string;
  priority?: boolean;
  size: number;
  variant?: BrandAssetVariant;
};

export function BrandMark({
  alt = 'Buzzr',
  className,
  priority = false,
  size,
  variant = 'transparent'
}: BrandMarkProps) {
  return (
    <Image
      src={BRAND_ASSETS[variant]}
      alt={alt}
      width={size}
      height={size}
      sizes={`${size}px`}
      priority={priority}
      className={cn(
        'shrink-0 object-contain drop-shadow-[0_0_18px_rgba(0,194,100,0.52)]',
        className
      )}
    />
  );
}
