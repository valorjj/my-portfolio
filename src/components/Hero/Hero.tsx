import { ArrowDown, Download, Mail } from 'lucide-react';
import { FadeIn } from '../ui/FadeIn';
import { CountUp } from '../ui/CountUp';
import { useLocale } from '../../i18n/LocaleContext';
import { profile } from '../../data/profile';
import styles from './Hero.module.css';

export function Hero() {
  const { t } = useLocale();

  const stats: { value: string; label: string }[] = [
    { value: '4', label: t.hero.stats.projects },
    { value: '6', label: t.hero.stats.tenants },
    { value: '~8,000', label: t.hero.stats.processes },
    { value: '500+', label: t.hero.stats.runners },
    { value: '22', label: t.hero.stats.stages },
  ];

  return (
    <section id="hero" className={styles.hero}>
      <div className={styles.inner}>
        <FadeIn delay={0}>
          <p className={styles.eyebrow}>{t.hero.eyebrow}</p>
        </FadeIn>

        <FadeIn delay={0.1}>
          <h1 className={styles.name}>{profile.name}</h1>
        </FadeIn>

        <FadeIn delay={0.2}>
          <p className={styles.tagline}>{t.hero.tagline}</p>
        </FadeIn>

        <FadeIn delay={0.3}>
          <div className={styles.ctas}>
            <a href="#projects" className={styles.ctaPrimary}>
              <span>{t.hero.ctaProjects}</span>
              <ArrowDown size={16} aria-hidden="true" />
            </a>
            <a href="#contact" className={styles.ctaSecondary}>
              <Mail size={16} aria-hidden="true" />
              <span>{t.hero.ctaContact}</span>
            </a>
            <a href="/resume.pdf" className={styles.ctaTertiary} download>
              <Download size={16} aria-hidden="true" />
              <span>{t.hero.ctaResume}</span>
            </a>
          </div>
        </FadeIn>

        <FadeIn delay={0.4}>
          <dl className={styles.stats} aria-label="At-a-glance metrics">
            {stats.map((s, i) => (
              <div key={s.label} className={styles.statCell}>
                <dt className={styles.statLabel}>{s.label}</dt>
                <dd className={styles.statValue}>
                  <CountUp value={s.value} delayMs={500 + i * 80} />
                </dd>
              </div>
            ))}
          </dl>
        </FadeIn>

        <FadeIn delay={0.5}>
          <pre className={styles.status} aria-label="At a glance">
            <code>
              <span className={styles.statusLine}>
                <span className={styles.statusArrow}>▸</span>
                <span className={styles.statusKey}>{t.hero.status.stack.key}</span>
                <span className={styles.statusValue}>{t.hero.status.stack.value}</span>
              </span>
              {'\n'}
              <span className={styles.statusLine}>
                <span className={styles.statusArrow}>▸</span>
                <span className={styles.statusKey}>{t.hero.status.focus.key}</span>
                <span className={styles.statusValue}>{t.hero.status.focus.value}</span>
              </span>
              {'\n'}
              <span className={styles.statusLine}>
                <span className={styles.statusArrow}>▸</span>
                <span className={styles.statusKey}>{t.hero.status.experience.key}</span>
                <span className={styles.statusValue}>{t.hero.status.experience.value}</span>
              </span>
            </code>
          </pre>
        </FadeIn>
      </div>
    </section>
  );
}
