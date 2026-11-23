import { Intro } from '@/components/sections/Intro';
import { Hero } from '@/components/sections/hero/Hero';
import { Manifesto } from '@/components/sections/manifesto/Manifesto';
import { Services } from '@/components/sections/services/Services';
import { Studio } from '@/components/sections/studio/Studio';
import { Work } from '@/components/sections/work/Work';
import { Why } from '@/components/sections/why/Why';
import { Process } from '@/components/sections/process/Process';
import { Experience } from '@/components/sections/experience/Experience';
import { Faq } from '@/components/sections/faq/Faq';
import { FinalCta } from '@/components/sections/cta/FinalCta';
import { Contact } from '@/components/sections/contact/Contact';
import { Footer } from '@/components/layout/Footer';
import { ScrollRefresh } from '@/components/motion/ScrollRefresh';
import { hasPublishedWork } from '@/content/projects';

/**
 * The journey: opening → statement → approach → what I create → who's behind
 * BEYOND → work (once real projects exist) → why → process → client
 * experience → FAQ → closing → contact.
 */
export default function HomePage() {
  return (
    <>
      <Intro />
      <main id="main" tabIndex={-1}>
        <Hero />
        <Manifesto />
        <Services />
        <Studio />
        {hasPublishedWork && <Work />}
        <Why />
        <Process />
        <Experience />
        <Faq />
        <FinalCta />
        <Contact />
        <ScrollRefresh />
      </main>
      <Footer />
    </>
  );
}
