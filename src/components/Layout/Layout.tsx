import type { ReactNode } from 'react';
import { Nav } from '../Nav/Nav';
import { Footer } from './Footer';
import { ScrollProgress } from '../ui/ScrollProgress';
import styles from './Layout.module.css';

export function Layout({ children }: { children: ReactNode }) {
  return (
    <div className={styles.layout}>
      <ScrollProgress />
      <Nav />
      <main className={styles.main}>{children}</main>
      <Footer />
    </div>
  );
}
