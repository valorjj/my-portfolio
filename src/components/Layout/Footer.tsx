import { useLocale } from '../../i18n/LocaleContext';
import { profile } from '../../data/profile';
import styles from './Footer.module.css';

export function Footer() {
  const { t } = useLocale();
  const year = new Date().getFullYear();
  return (
    <footer className={styles.footer}>
      <div className={styles.inner}>
        <p className={styles.copy}>
          &copy; {year} {profile.name}
        </p>
        <p className={styles.built}>{t.footer.builtWith}</p>
      </div>
    </footer>
  );
}
