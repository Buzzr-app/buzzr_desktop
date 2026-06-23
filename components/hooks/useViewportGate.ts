'use client';

import { useEffect, useMemo, useRef, useState } from 'react';

type ViewportGateOptions = {
  defaultActive?: boolean;
  disabled?: boolean;
  once?: boolean;
  rootMargin?: string;
  threshold?: number | number[];
};

export function useViewportGate<T extends Element>({
  defaultActive = false,
  disabled = false,
  once = false,
  rootMargin = '700px 0px',
  threshold = 0.01
}: ViewportGateOptions = {}) {
  const ref = useRef<T | null>(null);
  const [isActive, setIsActive] = useState(defaultActive);
  const thresholdKey = useMemo(
    () => (Array.isArray(threshold) ? threshold.join(',') : String(threshold)),
    [threshold]
  );

  useEffect(() => {
    if (disabled) {
      setIsActive(defaultActive);
      return;
    }

    const node = ref.current;

    if (!node) {
      return;
    }

    if (typeof IntersectionObserver === 'undefined') {
      setIsActive(true);
      return;
    }

    let observer: IntersectionObserver | null = new IntersectionObserver(
      ([entry]) => {
        const nextActive = entry.isIntersecting || entry.intersectionRatio > 0;
        setIsActive(nextActive);

        if (nextActive && once) {
          observer?.disconnect();
          observer = null;
        }
      },
      {
        rootMargin,
        threshold
      }
    );

    observer.observe(node);

    return () => {
      observer?.disconnect();
      observer = null;
    };
  }, [defaultActive, disabled, once, rootMargin, threshold, thresholdKey]);

  return [ref, isActive] as const;
}
