import type { ReactNode } from 'react';
import { cn } from '@/components/utils';

export function Prose({ children, className }: { children: ReactNode; className?: string }) {
  return (
    <div
      className={cn(
        'max-w-none text-white/62',
        '[&_p]:my-[1.6em] [&_p]:text-[17px] [&_p]:leading-[1.78] [&_p]:tracking-[0.003em]',
        '[&_h2]:mb-3 [&_h2]:mt-12 [&_h2]:text-[22px] [&_h2]:font-semibold [&_h2]:leading-[1.18] [&_h2]:tracking-[-0.01em] [&_h2]:text-white md:[&_h2]:text-[26px]',
        '[&_h3]:mb-2.5 [&_h3]:mt-9 [&_h3]:text-[18px] [&_h3]:font-semibold [&_h3]:leading-[1.3] [&_h3]:tracking-[-0.005em] [&_h3]:text-white',
        '[&_h2>a]:text-inherit [&_h2>a]:no-underline hover:[&_h2>a]:underline [&_h3>a]:text-inherit [&_h3>a]:no-underline hover:[&_h3>a]:underline',
        '[&_a]:text-white/80 [&_a]:underline [&_a]:decoration-accent/40 [&_a]:underline-offset-[4px] [&_a]:transition-[text-decoration-color,color] [&_a]:duration-200 hover:[&_a]:text-white hover:[&_a]:decoration-accent',
        '[&_ul]:my-[1.4em] [&_ul]:space-y-2 [&_ul]:pl-5 [&_ul>li]:list-disc [&_ul>li]:text-[17px] [&_ul>li]:leading-[1.68] [&_ul>li]:marker:text-accent/70',
        '[&_ol]:my-[1.4em] [&_ol]:space-y-2 [&_ol]:pl-5 [&_ol>li]:list-decimal [&_ol>li]:text-[17px] [&_ol>li]:leading-[1.68] [&_ol>li]:marker:text-accent/70',
        '[&_blockquote]:my-8 [&_blockquote]:border-l-[1.5px] [&_blockquote]:border-white/[0.12] [&_blockquote]:pl-5 [&_blockquote]:text-white/55 [&_blockquote]:italic',
        '[&_strong]:font-medium [&_strong]:text-white/88',
        '[&_em]:text-white/80',
        '[&_del]:text-white/38',
        '[&_pre]:my-7 [&_pre]:overflow-x-auto [&_pre]:rounded-control [&_pre]:border [&_pre]:border-white/[0.07] [&_pre]:bg-white/[0.04] [&_pre]:p-4',
        '[&_pre_code]:border-0 [&_pre_code]:bg-transparent [&_pre_code]:p-0',
        '[&_code]:rounded [&_code]:border [&_code]:border-white/[0.08] [&_code]:bg-white/[0.05] [&_code]:px-1.5 [&_code]:py-0.5 [&_code]:font-mono [&_code]:text-[13px] [&_code]:tracking-[0] [&_code]:text-white/80',
        '[&_hr]:my-14 [&_hr]:border-white/[0.07]',
        className
      )}
    >
      {children}
    </div>
  );
}
