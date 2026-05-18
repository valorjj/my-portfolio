import { useLocale } from '../../i18n/LocaleContext';
import styles from './LocaleToggle.module.css';

export function LocaleToggle() {
  const { locale, toggle, t } = useLocale();
  const next = locale === 'en' ? 'KO' : 'EN';
  return (
    <button
      type="button"
      onClick={toggle}
      className={styles.toggle}
      aria-label={t.a11y.localeToggle}
      title={t.a11y.localeToggle}
    >
      <span className={styles.current}>{locale.toUpperCase()}</span>
      <span className={styles.divider} aria-hidden="true">/</span>
      <span className={styles.next}>{next}</span>
    </button>
  );
}
