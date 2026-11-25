import type { Metadata, Viewport } from 'next';
import localFont from 'next/font/local';
import { headScript } from '@/lib/motion';
import { site } from '@/content/site';
import { SmoothScroll } from '@/components/motion/SmoothScroll';
import { Header } from '@/components/layout/Header';
import { ProgressRail } from '@/components/layout/ProgressRail';
import { CursorFrame } from '@/components/ui/CursorFrame';
import { WhatsAppButton } from '@/components/ui/WhatsAppButton';
import { Analytics } from '@vercel/analytics/next';
import { services } from '@/content/services';
import './globals.css';

/* Fonts are self-hosted: Heebo is split into Hebrew + Latin subsets with
   explicit unicode ranges, so the browser only downloads what a page uses.
   (next/font options must be literals, hence the repeated range strings.) */

const heeboHebrew = localFont({
  src: './fonts/heebo-hebrew-wght-normal.woff2',
  weight: '100 900',
  style: 'normal',
  variable: '--font-heebo-he',
  display: 'swap',
  adjustFontFallback: false,
  declarations: [{ prop: 'unicode-range', value: 'U+0307-0308,U+0590-05FF,U+200C-2010,U+20AA,U+25CC,U+FB1D-FB4F' }],
});

const heeboLatin = localFont({
  src: './fonts/heebo-latin-wght-normal.woff2',
  weight: '100 900',
  style: 'normal',
  variable: '--font-heebo-latin',
  display: 'swap',
  adjustFontFallback: false,
  declarations: [{ prop: 'unicode-range', value: 'U+0000-00FF,U+0131,U+0152-0153,U+02BB-02BC,U+02C6,U+02DA,U+02DC,U+0304,U+0308,U+0329,U+2000-206F,U+20AC,U+2122,U+2191,U+2193,U+2212,U+2215,U+FEFF,U+FFFD' }],
});

const grotesk = localFont({
  src: './fonts/space-grotesk-latin-wght-normal.woff2',
  weight: '300 700',
  style: 'normal',
  variable: '--font-grotesk',
  display: 'swap',
  adjustFontFallback: false,
  declarations: [{ prop: 'unicode-range', value: 'U+0000-00FF,U+0131,U+0152-0153,U+02BB-02BC,U+02C6,U+02DA,U+02DC,U+0304,U+0308,U+0329,U+2000-206F,U+20AC,U+2122,U+2191,U+2193,U+2212,U+2215,U+FEFF,U+FFFD' }],
});

export const metadata: Metadata = {
  metadataBase: new URL(site.url),
  title: {
    default: `${site.fullName} | אסטרטגיה, אפיון, עיצוב ופיתוח`,
    template: `%s | ${site.name}`,
  },
  description: site.description,
  applicationName: site.name,
  authors: [{ name: 'נעמי מן' }],
  keywords: [
    'סטודיו דיגיטלי',
    'אפיון אתרים',
    'עיצוב אתרים',
    'פיתוח אתרים',
    'UX',
    'UI',
    'מערכות עיצוב',
    'אסטרטגיה דיגיטלית',
    'BEYOND',
  ],
  alternates: { canonical: '/' },
  openGraph: {
    type: 'website',
    locale: site.locale,
    url: '/',
    siteName: site.name,
    title: `${site.fullName} — ${site.slogan}`,
    description: site.description,
    images: [{ url: '/og.png', width: 1200, height: 630, alt: `${site.name} — ${site.slogan}` }],
  },
  twitter: {
    card: 'summary_large_image',
    title: `${site.fullName} — ${site.slogan}`,
    description: site.description,
    images: ['/og.png'],
  },
  robots: { index: true, follow: true },
  formatDetection: { telephone: false, email: false, address: false },
};

export const viewport: Viewport = {
  themeColor: '#10131A',
  colorScheme: 'dark',
  width: 'device-width',
  initialScale: 1,
  viewportFit: 'cover',
};

const jsonLd = {
  '@context': 'https://schema.org',
  '@type': 'ProfessionalService',
  name: site.fullName,
  alternateName: site.name,
  slogan: site.slogan,
  description: site.description,
  url: site.url,
  logo: `${site.url}/brand/beyond-logo-on-light.svg`,
  image: `${site.url}/og.png`,
  ...(site.email ? { email: site.email } : {}),
  ...(site.phone ? { telephone: site.phone } : {}),
  knowsAbout: ['Digital strategy', 'UX design', 'UI design', 'Web design', 'Web development', 'Design systems'],
  inLanguage: 'he',
  founder: { '@type': 'Person', name: 'נעמי מן', jobTitle: 'מפתחת ומעצבת UX/UI · פיתוח אינטראקטיבי בשילוב AI' },
  hasOfferCatalog: {
    '@type': 'OfferCatalog',
    name: 'שירותים',
    itemListElement: services.map((s) => ({
      '@type': 'Offer',
      itemOffered: { '@type': 'Service', name: s.category, description: s.description },
    })),
  },
  ...(site.social.length ? { sameAs: site.social.map((s) => s.url) } : {}),
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html
      lang="he"
      dir="rtl"
      className={`${heeboHebrew.variable} ${heeboLatin.variable} ${grotesk.variable}`}
      suppressHydrationWarning
    >
      <head>
        <script dangerouslySetInnerHTML={{ __html: headScript }} />
        <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
      </head>
      <body>
        <a className="skip-link" href="#main">
          דלגו לתוכן הראשי
        </a>
        <SmoothScroll>
          <Header />
          <ProgressRail />
          {children}
          <CursorFrame />
          <WhatsAppButton />
        </SmoothScroll>
        {/* Vercel Web Analytics exists only on Vercel deployments */}
        {process.env.VERCEL === '1' && process.env.NEXT_PUBLIC_STATIC_PREVIEW !== '1' && <Analytics />}
        <div className="grain" aria-hidden="true" />
      </body>
    </html>
  );
}
