import type { ReactNode } from 'react';
import { Section } from '../ui/Section';
import { FadeIn } from '../ui/FadeIn';
import { useLocale } from '../../i18n/LocaleContext';
import styles from './Notes.module.css';

function renderInlineCode(text: string): ReactNode[] {
  const parts = text.split(/(`[^`]+`)/g);
  return parts.map((part, i) => {
    if (part.startsWith('`') && part.endsWith('`')) {
      return (
        <code key={i} className={styles.inlineCode}>
          {part.slice(1, -1)}
        </code>
      );
    }
    return <span key={i}>{part}</span>;
  });
}

export function Notes() {
  const { t } = useLocale();
  return (
    <Section id="notes" eyebrow={t.notes.eyebrow} title={t.notes.title}>
      <ul className={styles.list}>
        {t.notes.items.map((note, i) => (
          <FadeIn key={note.index} as="li" delay={i * 0.06}>
            <article className={styles.note}>
              <span className={styles.index}>{note.index}</span>
              <h3 className={styles.title}>{note.title}</h3>
              <p className={styles.body}>{renderInlineCode(note.body)}</p>
            </article>
          </FadeIn>
        ))}
      </ul>
    </Section>
  );
}
