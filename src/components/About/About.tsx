import type { ReactNode } from 'react';
import { Section } from '../ui/Section';
import { FadeIn } from '../ui/FadeIn';
import { useLocale } from '../../i18n/LocaleContext';
import styles from './About.module.css';

function renderInlineCode(text: string): ReactNode[] {
  const parts = text.split(/(`[^`]+`)/g);
  return parts.map((part, i) => {
    if (part.startsWith('`') && part.endsWith('`')) {
      return <code key={i}>{part.slice(1, -1)}</code>;
    }
    return <span key={i}>{part}</span>;
  });
}

export function About() {
  const { t } = useLocale();
  return (
    <Section id="about" eyebrow={t.about.eyebrow} title={t.about.title}>
      <div className={styles.body}>
        {t.about.paragraphs.map((para, i) => (
          <FadeIn key={i} delay={i * 0.1}>
            <p className={styles.paragraph}>{renderInlineCode(para)}</p>
          </FadeIn>
        ))}

        <FadeIn delay={0.3}>
          <ul className={styles.signature} aria-label={t.about.problemsLabel}>
            {t.about.problems.map((item) => (
              <li key={item} className={styles.signatureItem}>
                <span className={styles.signatureMark}>▸</span>
                <span>{item}</span>
              </li>
            ))}
          </ul>
        </FadeIn>
      </div>
    </Section>
  );
}
