import { useEffect, useState } from 'react';

/**
 * Returns the id of the section currently most in view.
 * Uses IntersectionObserver against the provided section ids.
 */
export function useScrollSpy(
  ids: readonly string[],
  options?: { rootMargin?: string; threshold?: number | number[] },
): string | null {
  const [activeId, setActiveId] = useState<string | null>(null);

  useEffect(() => {
    if (typeof window === 'undefined' || typeof document === 'undefined') {
      return;
    }
    if (ids.length === 0) {
      return;
    }

    const elements = ids
      .map((id) => document.getElementById(id))
      .filter((el): el is HTMLElement => el !== null);

    if (elements.length === 0) {
      return;
    }

    const visibility = new Map<string, number>();

    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          const id = entry.target.id;
          if (entry.isIntersecting) {
            visibility.set(id, entry.intersectionRatio);
          } else {
            visibility.delete(id);
          }
        }

        let bestId: string | null = null;
        let bestRatio = -1;
        for (const [id, ratio] of visibility) {
          if (ratio > bestRatio) {
            bestRatio = ratio;
            bestId = id;
          }
        }
        if (bestId) {
          setActiveId(bestId);
        }
      },
      {
        rootMargin: options?.rootMargin ?? '-30% 0px -55% 0px',
        threshold: options?.threshold ?? [0, 0.25, 0.5, 0.75, 1],
      },
    );

    for (const element of elements) {
      observer.observe(element);
    }

    return () => {
      observer.disconnect();
    };
  }, [ids, options?.rootMargin, options?.threshold]);

  return activeId;
}
