import { Section } from '../ui/Section';
import { Chip } from '../ui/Chip';
import { FadeIn } from '../ui/FadeIn';
import { useLocale } from '../../i18n/LocaleContext';
import styles from './Skills.module.css';

export function Skills() {
  const { t } = useLocale();
  return (
    <Section id="skills" eyebrow={t.skills.eyebrow} title={t.skills.title}>
      <div className={styles.grid}>
        {t.skills.groups.map((group, index) => (
          <FadeIn key={group.label} delay={index * 0.06}>
            <div className={styles.group}>
              <p className={styles.groupLabel}>{group.label}</p>
              <ul className={styles.chips}>
                {group.items.map((item) => (
                  <li key={item} className={styles.chipItem}>
                    <Chip variant="mono">{item}</Chip>
                  </li>
                ))}
              </ul>
            </div>
          </FadeIn>
        ))}
      </div>
    </Section>
  );
}
