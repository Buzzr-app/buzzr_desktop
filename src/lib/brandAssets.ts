export const BRAND_ASSETS = {
  dark: '/brand/buzzr-mark-dark.png',
  transparent: '/brand/buzzr-mark-transparent.png',
  shortcut: '/favicon.png'
} as const;

export type BrandAssetVariant = keyof Omit<typeof BRAND_ASSETS, 'shortcut'>;
