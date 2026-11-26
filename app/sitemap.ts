import type { MetadataRoute } from 'next';

const BASE = 'https://qariai.app';

const SEO_SLUGS = [
  'ghunnah',
  'qalqalah',
  'madd-rules',
  'noon-sakinah',
  'meem-sakinah',
  'tajweed-for-beginners',
  'arabic-pronunciation',
  'tajweed-checker',
  'quran-pronunciation-checker',
  'quran-recitation-mistakes',
];

const PLUGIN_PATHS = ['', '/privacy', '/terms', '/support'];

export default function sitemap(): MetadataRoute.Sitemap {
  return [
    { url: BASE, changeFrequency: 'weekly', priority: 1 },
    ...SEO_SLUGS.map((s) => ({ url: `${BASE}/${s}`, changeFrequency: 'monthly' as const, priority: 0.8 })),
    ...PLUGIN_PATHS.map((p) => ({
      url: `${BASE}/arabic-roots/plugin${p}`,
      changeFrequency: 'monthly' as const,
      priority: p === '' ? 0.8 : 0.4,
    })),
  ];
}
