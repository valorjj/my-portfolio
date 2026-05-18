import { useEffect, useRef, useState } from 'react';

export type CountUpProps = {
  /** Final string to display, e.g. "4", "~8,000", "500+". The numeric part will animate. */
  value: string;
  /** Animation duration in milliseconds. */
  durationMs?: number;
  /** Delay before starting, in milliseconds. */
  delayMs?: number;
};

type Parsed = { prefix: string; num: number; suffix: string; useLocale: boolean };

function parseValue(value: string): Parsed {
  const match = value.match(/^(\D*)([\d,]+)(.*)$/);
  if (!match) {
    return { prefix: '', num: 0, suffix: value, useLocale: false };
  }
  const [, prefix, digits, suffix] = match;
  const useLocale = digits.includes(',');
  const num = parseInt(digits.replace(/,/g, ''), 10);
  return { prefix, num, suffix, useLocale };
}

function prefersReducedMotion(): boolean {
  if (typeof window === 'undefined') return false;
  return window.matchMedia('(prefers-reduced-motion: reduce)').matches;
}

export function CountUp({ value, durationMs = 1100, delayMs = 0 }: CountUpProps) {
  const parsed = useRef<Parsed>(parseValue(value));
  const [display, setDisplay] = useState<number>(() =>
    prefersReducedMotion() ? parsed.current.num : 0,
  );

  useEffect(() => {
    parsed.current = parseValue(value);
    if (prefersReducedMotion()) {
      setDisplay(parsed.current.num);
      return;
    }

    let raf = 0;
    let startTimer = 0;

    const animate = () => {
      const start = performance.now();
      const tick = (now: number) => {
        const elapsed = now - start;
        const t = Math.min(1, elapsed / durationMs);
        // ease-out cubic
        const eased = 1 - Math.pow(1 - t, 3);
        setDisplay(Math.round(parsed.current.num * eased));
        if (t < 1) {
          raf = requestAnimationFrame(tick);
        }
      };
      raf = requestAnimationFrame(tick);
    };

    if (delayMs > 0) {
      startTimer = window.setTimeout(animate, delayMs);
    } else {
      animate();
    }

    return () => {
      if (startTimer) window.clearTimeout(startTimer);
      if (raf) cancelAnimationFrame(raf);
    };
  }, [value, durationMs, delayMs]);

  const { prefix, suffix, useLocale } = parsed.current;
  const formatted = useLocale ? display.toLocaleString('en-US') : String(display);

  return (
    <>
      {prefix}
      {formatted}
      {suffix}
    </>
  );
}
