import Image from 'next/image';
import type { League } from '@/src/lib/constants';
import { getLeagueLogo } from '@/src/lib/leagueLogos';

export function LeagueChip({ league }: { league: League }) {
  const logo = getLeagueLogo(league.label);
  const initials = league.label.replace(/[^A-Z0-9]/gi, '').slice(0, 2);

  return (
    <span
      title={league.long}
      className="inline-flex items-center gap-2 border border-surface bg-canvas py-1 pl-1 pr-3 font-mono text-[12px] tracking-[0.1em] leading-[2] text-muted transition-colors hover:text-foreground hover:border-white/25"
    >
      <span
        aria-hidden
        className="relative inline-flex h-5 w-5 shrink-0 items-center justify-center overflow-hidden rounded-none bg-foreground"
      >
        {logo ? (
          <Image src={logo} alt="" width={18} height={18} sizes="18px" className="h-[16px] w-[16px] object-contain" />
        ) : (
          <span className="font-mono text-[9px] font-bold leading-none text-canvas">{initials}</span>
        )}
      </span>
      {league.label}
    </span>
  );
}
