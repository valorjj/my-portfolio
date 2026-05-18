import type { ReactNode } from 'react';
import styles from './Chip.module.css';

export function Chip({
  children,
  variant = 'default',
}: {
  children: ReactNode;
  variant?: 'default' | 'mono';
}) {
  const className = variant === 'mono' ? `${styles.chip} ${styles.mono}` : styles.chip;
  return <span className={className}>{children}</span>;
}
