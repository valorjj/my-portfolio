import { useState } from 'react';
import type { ReactNode } from 'react';
import { ChevronDown, ChevronRight } from 'lucide-react';
import { Chip } from '../ui/Chip';
import { CodeBlock } from '../ui/CodeBlock';
import { useLocale } from '../../i18n/LocaleContext';
import type { Project } from '../../data/projects';
import styles from './ProjectCard.module.css';

function renderBold(text: string): ReactNode[] {
  const parts = text.split(/(\*\*[^*]+\*\*)/g);
  return parts.map((part, i) => {
    if (part.startsWith('**') && part.endsWith('**')) {
      return <strong key={i}>{part.slice(2, -2)}</strong>;
    }
    return <span key={i}>{part}</span>;
  });
}

export function ProjectCard({ project }: { project: Project }) {
  const { t } = useLocale();
  const [expanded, setExpanded] = useState<boolean>(false);
  const [codeOpen, setCodeOpen] = useState<boolean>(false);
  const takeawayCount = project.takeaways.length;
  const panelId = `takeaways-${project.index}`;
  const codePanelId = `code-${project.index}`;

  return (
    <article className={styles.card}>
      <p className={styles.meta}>
        <span>{project.index}</span>
        <span aria-hidden="true">·</span>
        <span>{project.period}</span>
        <span aria-hidden="true">·</span>
        <span>{project.role}</span>
        <span aria-hidden="true">·</span>
        <span>{project.team}</span>
      </p>

      <h3 className={styles.title}>{project.title}</h3>

      <p className={styles.client}>
        {project.client}
        {project.product ? (
          <>
            <span className={styles.clientSep} aria-hidden="true"> · </span>
            <span className={styles.product}>{project.product}</span>
          </>
        ) : null}
      </p>

      <hr className={styles.divider} />

      <p className={styles.context}>{project.context}</p>

      {project.diagram ? (
        <pre className={styles.diagram} aria-label="System diagram">
          <code>{project.diagram}</code>
        </pre>
      ) : null}

      {project.scale && project.scale.length > 0 ? (
        <dl className={styles.scaleGrid}>
          {project.scale.map((item) => (
            <div key={item.label} className={styles.scaleItem}>
              <dt className={styles.scaleLabel}>{item.label}</dt>
              <dd className={styles.scaleValue}>{item.value}</dd>
            </div>
          ))}
        </dl>
      ) : null}

      <ul className={styles.highlights}>
        {project.highlights.map((h) => (
          <li key={h.title} className={styles.highlight}>
            <span className={styles.highlightTitle}>{h.title}</span>{' '}
            <span className={styles.highlightBody}>{h.body}</span>
          </li>
        ))}
      </ul>

      <div className={styles.chips}>
        {project.tech.map((t) => (
          <Chip key={t} variant="mono">
            {t}
          </Chip>
        ))}
      </div>

      <div className={styles.toggles}>
        {project.snippet ? (
          <button
            type="button"
            className={styles.toggle}
            aria-expanded={codeOpen}
            aria-controls={codePanelId}
            onClick={() => setCodeOpen((v) => !v)}
          >
            {codeOpen ? (
              <ChevronDown className={styles.toggleIcon} size={16} aria-hidden="true" />
            ) : (
              <ChevronRight className={styles.toggleIcon} size={16} aria-hidden="true" />
            )}
            <span>{t.projects.cardCode}</span>
          </button>
        ) : null}

        <button
          type="button"
          className={styles.toggle}
          aria-expanded={expanded}
          aria-controls={panelId}
          onClick={() => setExpanded((v) => !v)}
        >
          {expanded ? (
            <ChevronDown className={styles.toggleIcon} size={16} aria-hidden="true" />
          ) : (
            <ChevronRight className={styles.toggleIcon} size={16} aria-hidden="true" />
          )}
          <span>{t.projects.cardTakeaways} ({takeawayCount})</span>
        </button>
      </div>

      {project.snippet ? (
        <div
          id={codePanelId}
          className={`${styles.codePanel} ${codeOpen ? styles.codePanelOpen : ''}`}
          aria-hidden={!codeOpen}
        >
          <div className={styles.codePanelInner}>
            <CodeBlock
              code={project.snippet.code}
              language={project.snippet.language}
              caption={project.snippet.caption}
            />
          </div>
        </div>
      ) : null}

      <div
        id={panelId}
        className={`${styles.takeawaysPanel} ${expanded ? styles.takeawaysPanelOpen : ''}`}
        aria-hidden={!expanded}
      >
        <ul className={styles.takeaways}>
          {project.takeaways.map((t, i) => (
            <li key={i} className={styles.takeaway}>
              {renderBold(t)}
            </li>
          ))}
        </ul>
      </div>
    </article>
  );
}
