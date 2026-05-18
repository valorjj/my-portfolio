import type { ReactNode } from 'react';
import { motion } from 'framer-motion';

type FadeInAs = 'div' | 'section' | 'li' | 'p';

export function FadeIn({
  children,
  delay = 0,
  as = 'div',
}: {
  children: ReactNode;
  delay?: number;
  as?: FadeInAs;
}) {
  const Component = motion[as];
  return (
    <Component
      initial={{ opacity: 0, y: 12 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.2 }}
      transition={{ duration: 0.5, delay, ease: [0.4, 0, 0.2, 1] }}
    >
      {children}
    </Component>
  );
}
