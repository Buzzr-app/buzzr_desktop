'use client';

import { useEffect, useRef, useState, type ReactNode } from 'react';
import { cn } from '@/components/utils';

type ScrollRevealProps = {
  children: ReactNode;
  className?: string;
  delay?: 0 | 1 | 2 | 3 | 4 | 5 | 6;
  rootMargin?: string;
};

export function ScrollReveal({
  children,
  className,
  delay = 0,
  rootMargin = '0px 0px -48px 0px'
}: ScrollRevealProps) {
  const ref = useRef<HTMLDivElement>(null);
  const [inView, setInView] = useState(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    // No IntersectionObserver (old/edge env) -> reveal immediately; never trap
    // content behind a feature that isn't present.
    if (typeof IntersectionObserver === 'undefined') {
      setInView(true);
      return;
    }

    const observer = new IntersectionObserver(
      ([entry]) => { if (entry?.isIntersecting) setInView(true); },
      { threshold: 0.08, rootMargin }
    );

    observer.observe(el);
    return () => observer.disconnect();
  }, [rootMargin]);

  return (
    <div
      ref={ref}
      className={cn('scroll-reveal', className)}
      style={{
        containIntrinsicSize: inView ? undefined : '560px',
        contentVisibility: inView ? 'visible' : 'auto',
        opacity: inView ? 1 : 0,
        transform: inView ? 'translateY(0)' : 'translateY(8px)',
        transition: inView
          ? `opacity 0.22s cubic-bezier(0.22,1,0.36,1) ${delay * 40}ms, transform 0.22s cubic-bezier(0.22,1,0.36,1) ${delay * 40}ms`
          : 'none',
        willChange: inView ? undefined : 'opacity, transform',
      }}
    >
      {children}
    </div>
  );
}
