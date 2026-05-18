import { useScrollSpy } from '../../hooks/useScrollSpy';
import { useLocale } from '../../i18n/LocaleContext';
import { ThemeToggle } from '../ui/ThemeToggle';
import { LocaleToggle } from '../ui/LocaleToggle';
import styles from './Nav.module.css';

const SECTION_IDS = ['about', 'projects', 'notes', 'skills', 'contact'] as const;

function scrollToTop(event: React.MouseEvent<HTMLAnchorElement>) {
  event.preventDefault();
  if (typeof window !== 'undefined') {
    window.scrollTo({ top: 0, behavior: 'smooth' });
    window.history.replaceState(null, '', '#');
  }
}

export function Nav() {
  const activeId = useScrollSpy(SECTION_IDS);
  const { t } = useLocale();

  const links: ReadonlyArray<{ id: (typeof SECTION_IDS)[number]; label: string }> = [
    { id: 'about', label: t.nav.about },
    { id: 'projects', label: t.nav.projects },
    { id: 'notes', label: t.nav.notes },
    { id: 'skills', label: t.nav.skills },
    { id: 'contact', label: t.nav.contact },
  ];

  return (
    <header className={styles.nav}>
      <div className={styles.inner}>
        <a
          href="#"
          className={styles.brand}
          onClick={scrollToTop}
          aria-label="Scroll to top"
        >
          &lt;jeongjin /&gt;
        </a>

        <nav className={styles.links} aria-label="Primary">
          {links.map((link) => {
            const isActive = activeId === link.id;
            return (
              <a
                key={link.id}
                href={`#${link.id}`}
                className={isActive ? `${styles.link} ${styles.linkActive}` : styles.link}
                aria-current={isActive ? 'true' : undefined}
              >
                {link.label}
              </a>
            );
          })}
        </nav>

        <div className={styles.actions}>
          <LocaleToggle />
          <ThemeToggle />
        </div>
      </div>
    </header>
  );
}
