import type { ReactNode } from 'react';
import { cn } from '@/components/utils';

export function Prose({ children, className }: { children: ReactNode; className?: string }) {
  return (
    <div
      className={cn(
        'max-w-none text-white/66',
        '[&_p]:my-6 [&_p]:text-[18px] [&_p]:leading-[1.72] [&_p]:tracking-[0]',
        '[&_h2]:mb-4 [&_h2]:mt-14 [&_h2]:text-[32px] [&_h2]:font-semibold [&_h2]:leading-[1.12] [&_h2]:tracking-[0] [&_h2]:text-white md:[&_h2]:text-[40px]',
        '[&_h3]:mb-3 [&_h3]:mt-10 [&_h3]:text-[22px] [&_h3]:font-semibold [&_h3]:leading-[1.2] [&_h3]:tracking-[0] [&_h3]:text-white',
        '[&_h2>a]:text-inherit [&_h2>a]:no-underline hover:[&_h2>a]:underline [&_h3>a]:text-inherit [&_h3>a]:no-underline hover:[&_h3>a]:underline',
        '[&_a]:text-white [&_a]:underline [&_a]:decoration-accent/60 [&_a]:underline-offset-[4px] [&_a]:transition-colors hover:[&_a]:decoration-white',
        '[&_ul]:my-6 [&_ul]:space-y-3 [&_ul]:pl-5 [&_ul>li]:list-disc [&_ul>li]:text-[17px] [&_ul>li]:leading-[1.65] [&_ul>li]:marker:text-accent',
        '[&_ol]:my-6 [&_ol]:space-y-3 [&_ol]:pl-5 [&_ol>li]:list-decimal [&_ol>li]:text-[17px] [&_ol>li]:leading-[1.65] [&_ol>li]:marker:text-accent',
        '[&_blockquote]:my-8 [&_blockquote]:rounded-[8px] [&_blockquote]:border [&_blockquote]:border-white/10 [&_blockquote]:bg-white/[0.04] [&_blockquote]:p-5 [&_blockquote]:text-white [&_blockquote]:italic',
        '[&_strong]:text-white',
        '[&_em]:text-white',
        '[&_del]:text-white/45',
        '[&_pre]:my-7 [&_pre]:overflow-x-auto [&_pre]:rounded-[8px] [&_pre]:border [&_pre]:border-white/10 [&_pre]:bg-white/[0.05] [&_pre]:p-4',
        '[&_pre_code]:border-0 [&_pre_code]:bg-transparent [&_pre_code]:p-0',
        '[&_code]:rounded-[4px] [&_code]:border [&_code]:border-white/10 [&_code]:bg-white/[0.06] [&_code]:px-1.5 [&_code]:py-0.5 [&_code]:font-mono [&_code]:text-[14px] [&_code]:tracking-[0] [&_code]:text-white',
        '[&_hr]:my-12 [&_hr]:border-white/10',
        className
      )}
    >
      {children}
    </div>
  );
}
