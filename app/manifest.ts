import { MetadataRoute } from 'next';
import { ALTERNATE_NAME, SITE_DESCRIPTION, SITE_NAME } from '@/src/lib/constants';

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: ALTERNATE_NAME,
    short_name: SITE_NAME,
    description: SITE_DESCRIPTION,
    start_url: '/',
    scope: '/',
    display: 'standalone',
    orientation: 'portrait',
    background_color: '#0a0a0c',
    theme_color: '#0a0a0c',
    lang: 'en-US',
    categories: ['sports', 'social', 'entertainment'],
    icons: [
      {
        src: '/brand/buzzr-mark-transparent.png',
        sizes: '512x512',
        type: 'image/png',
        purpose: 'any'
      },
      {
        src: '/brand/buzzr-mark-dark.png',
        sizes: '512x512',
        type: 'image/png',
        purpose: 'maskable'
      }
    ]
  };
}
