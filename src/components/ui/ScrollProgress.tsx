import { motion, useScroll, useSpring } from 'framer-motion';
import styles from './ScrollProgress.module.css';

export function ScrollProgress() {
  const { scrollYProgress } = useScroll();
  const scaleX = useSpring(scrollYProgress, {
    stiffness: 220,
    damping: 32,
    mass: 0.4,
  });

  return (
    <motion.div
      className={styles.bar}
      style={{ scaleX, transformOrigin: '0% 50%' }}
      aria-hidden="true"
    />
  );
}
