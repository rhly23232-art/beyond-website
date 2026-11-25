import type { MetadataRoute } from 'next';
import { site } from '@/content/site';
import { cases } from '@/content/cases';

export default function sitemap(): MetadataRoute.Sitemap {
  const now = new Date();
  return [
    { url: `${site.url}/`, lastModified: now, changeFrequency: 'monthly', priority: 1 },
    ...cases.map((c) => ({ url: `${site.url}/work/${c.slug}`, lastModified: now, changeFrequency: 'monthly' as const, priority: 0.8 })),
    { url: `${site.url}/accessibility`, lastModified: now, changeFrequency: 'yearly', priority: 0.3 },
    { url: `${site.url}/privacy`, lastModified: now, changeFrequency: 'yearly', priority: 0.3 },
  ];
}
