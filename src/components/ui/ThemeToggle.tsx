import { Moon, Sun } from 'lucide-react';
import { useTheme } from '../../hooks/useTheme';
import { useLocale } from '../../i18n/LocaleContext';
import styles from './ThemeToggle.module.css';

export function ThemeToggle() {
  const { theme, toggle } = useTheme();
  const { t } = useLocale();
  const isDark = theme === 'dark';

  return (
    <button
      type="button"
      className={styles.toggle}
      onClick={toggle}
      aria-label={t.a11y.themeToggle}
      title={t.a11y.themeToggle}
    >
      {isDark ? <Sun size={16} aria-hidden="true" /> : <Moon size={16} aria-hidden="true" />}
    </button>
  );
}
