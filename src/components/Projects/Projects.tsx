import { Section } from '../ui/Section';
import { FadeIn } from '../ui/FadeIn';
import { ProjectCard } from './ProjectCard';
import { projectsEn } from '../../data/projects';
import { projectsKo } from '../../data/projects.ko';
import { useLocale } from '../../i18n/LocaleContext';
import styles from './Projects.module.css';

export function Projects() {
  const { t, locale } = useLocale();
  const projects = locale === 'ko' ? projectsKo : projectsEn;
  return (
    <Section id="projects" eyebrow={t.projects.eyebrow} title={t.projects.title}>
      <div className={styles.list}>
        {projects.map((project, i) => (
          <FadeIn key={project.index} delay={i * 0.08}>
            <ProjectCard project={project} />
          </FadeIn>
        ))}
      </div>
    </Section>
  );
}
