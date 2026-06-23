'use client';

import { useRef, useState, KeyboardEvent } from 'react';

export type FaqItem = { q: string; a: string };

export function FaqAccordion({ items }: { items: FaqItem[] }) {
  const [openIndex, setOpenIndex] = useState<number | null>(null);
  const buttonRefs = useRef<Array<HTMLButtonElement | null>>([]);

  const focusItem = (i: number) => {
    const next = ((i % items.length) + items.length) % items.length;
    buttonRefs.current[next]?.focus();
  };

  const onKeyDown = (e: KeyboardEvent<HTMLButtonElement>, i: number) => {
    switch (e.key) {
      case 'ArrowDown':
        e.preventDefault();
        focusItem(i + 1);
        break;
      case 'ArrowUp':
        e.preventDefault();
        focusItem(i - 1);
        break;
      case 'Home':
        e.preventDefault();
        focusItem(0);
        break;
      case 'End':
        e.preventDefault();
        focusItem(items.length - 1);
        break;
    }
  };

  return (
    <dl className="mx-auto w-full">
      {items.map((item, i) => {
        const isOpen = openIndex === i;
        const triggerId = `faq-trigger-${i}`;
        const panelId = `faq-panel-${i}`;

        return (
          <div key={item.q} className="border-t border-surface last:border-b">
            <dt>
              <button
                ref={(el) => {
                  buttonRefs.current[i] = el;
                }}
                id={triggerId}
                type="button"
                aria-expanded={isOpen}
                aria-controls={panelId}
                onClick={() => setOpenIndex(isOpen ? null : i)}
                onKeyDown={(e) => onKeyDown(e, i)}
                className="flex w-full items-center justify-between gap-6 py-5 text-left text-[16px] leading-[1.5] tracking-[-0.025em] text-foreground transition-colors hover:text-muted focus-visible:outline-none focus-visible:shadow-[0_0_0_2px_rgb(var(--accent-rgb)_/_0.55)] rounded-sm"
              >
                <span>{item.q}</span>
                <span
                  aria-hidden
                  className={`shrink-0 text-[20px] leading-none transition-transform duration-200 ${
                    isOpen ? 'rotate-45' : 'rotate-0'
                  }`}
                >
                  +
                </span>
              </button>
            </dt>
            <dd
              id={panelId}
              role="region"
              aria-labelledby={triggerId}
              aria-hidden={!isOpen || undefined}
              className="grid overflow-hidden transition-all duration-200 ease-out"
              style={{
                gridTemplateRows: isOpen ? '1fr' : '0fr',
                opacity: isOpen ? 1 : 0
              }}
            >
              <div className="overflow-hidden">
                <p className="pb-5 text-[14px] leading-[1.43] tracking-[0.1px] text-muted">
                  {item.a}
                </p>
              </div>
            </dd>
          </div>
        );
      })}
    </dl>
  );
}
