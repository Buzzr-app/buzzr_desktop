import type { ReactNode } from 'react';
import { cn } from '@/components/utils';
import { EditorialBreadcrumbs, type BreadcrumbItem } from '@/components/blog/EditorialBreadcrumbs';

type EditorialShellProps = {
  labelledBy: string;
  eyebrow: string;
  title: string;
  description: string;
  breadcrumbs: BreadcrumbItem[];
  children: ReactNode;
  prelude?: ReactNode;
  headerAside?: ReactNode;
  className?: string;
  contentClassName?: string;
  titleClassName?: string;
};

export function EditorialShell({
  labelledBy,
  eyebrow,
  title,
  description,
  breadcrumbs,
  children,
  prelude,
  headerAside,
  className,
  contentClassName,
  titleClassName
}: EditorialShellProps) {
  return (
    <section
      aria-labelledby={labelledBy}
      className={cn(
        'relative isolate overflow-hidden bg-[#090e13] text-white',
        className
      )}
    >
      <div
        aria-hidden
        className="absolute inset-0 -z-10 bg-[linear-gradient(180deg,#0f151c_0%,#090e13_46%,#11161d_100%)]"
      />
      <div
        aria-hidden
        className="absolute inset-0 -z-10 opacity-[0.18] [background-image:linear-gradient(rgba(255,255,255,0.08)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.08)_1px,transparent_1px)] [background-size:72px_72px]"
      />

      <div className={cn('mx-auto w-full max-w-[1200px] px-6 pb-20 pt-24 md:pb-28 md:pt-32', contentClassName)}>
        {prelude}

        <div className="mb-10">
          <EditorialBreadcrumbs items={breadcrumbs} />
        </div>

        <header className="mb-12 grid gap-8 border-b border-white/10 pb-10 lg:grid-cols-[minmax(0,1fr)_340px] lg:items-end">
          <div className="max-w-[760px]">
            <p className="font-mono text-[12px] uppercase leading-[2] tracking-[0.14em] text-accent-text">
              {eyebrow}
            </p>
            <h1
              id={labelledBy}
              className={cn(
                'mt-4 text-[40px] font-semibold leading-[1.02] tracking-[0] text-white md:text-[64px]',
                titleClassName
              )}
            >
              {title}
            </h1>
            <p className="mt-5 max-w-[680px] text-[17px] leading-[1.6] tracking-[0] text-white/62 md:text-[19px]">
              {description}
            </p>
          </div>
          {headerAside ? <div>{headerAside}</div> : null}
        </header>

        {children}
      </div>
    </section>
  );
}
