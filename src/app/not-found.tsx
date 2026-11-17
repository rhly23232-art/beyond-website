import type { Metadata } from 'next';
import { BrandSymbol } from '@/components/brand/BrandSymbol';
import { Button } from '@/components/ui/Button';
import styles from './not-found.module.css';

export const metadata: Metadata = {
  title: 'העמוד לא נמצא',
  robots: { index: false },
};

export default function NotFound() {
  return (
    <main id="main" tabIndex={-1} className={`section ${styles.page}`} data-theme="dark">
      <BrandSymbol className={styles.symbol} />
      <p className={`${styles.code} en`}>404</p>
      <h1 className={styles.title}>העמוד הזה נמצא מעבר לגבולות.</h1>
      <p className={styles.text}>אולי הקישור השתנה, ואולי הוא מעולם לא היה. בכל מקרה — הדרך חזרה קצרה.</p>
      <Button href="/" size="lg">
        חזרה לעמוד הבית
      </Button>
    </main>
  );
}
