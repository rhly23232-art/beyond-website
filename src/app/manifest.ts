import type { MetadataRoute } from 'next';
import { site } from '@/content/site';

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: site.fullName,
    short_name: site.name,
    description: site.description,
    lang: 'he',
    dir: 'rtl',
    start_url: '/',
    display: 'standalone',
    background_color: '#10131A',
    theme_color: '#10131A',
    icons: [
      { src: '/icon.svg', type: 'image/svg+xml', sizes: 'any' },
      { src: '/brand/icon-192.png', type: 'image/png', sizes: '192x192' },
      { src: '/brand/icon-512.png', type: 'image/png', sizes: '512x512' },
    ],
  };
}
