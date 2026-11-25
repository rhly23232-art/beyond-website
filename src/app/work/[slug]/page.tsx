import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { cases, getCase } from '@/content/cases';
import { CaseStudy } from '@/components/case/CaseStudy';

export const dynamicParams = false;

export function generateStaticParams() {
  return cases.map((c) => ({ slug: c.slug }));
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params;
  const c = getCase(slug);
  if (!c) return {};
  const title = `${c.name}: ${c.type}`;
  return {
    title,
    description: c.summary,
    alternates: { canonical: `/work/${c.slug}` },
    openGraph: { title: `${title} | BEYOND`, description: c.summary, url: `/work/${c.slug}` },
  };
}

export default async function CasePage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const c = getCase(slug);
  if (!c) notFound();
  return <CaseStudy c={c} />;
}
