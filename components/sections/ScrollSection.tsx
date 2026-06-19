import { Section } from '@/components/ui/Section';
import { Badge } from '@/components/ui/Badge';
import { DeviceFrame } from '@/components/ui/DeviceFrame';

export function ScrollSection() {
  return (
    <Section id="scroll" aria-labelledby="scroll-title">
      <div className="grid items-center gap-12 lg:grid-cols-[1fr_1fr] lg:gap-16">
        <div className="flex flex-col gap-6">
          <Badge>One feed</Badge>
          <h2
            id="scroll-title"
            className="max-w-[16ch] text-[clamp(32px,4.5vw,48px)] font-bold uppercase leading-[0.95] tracking-[-0.04em] text-foreground"
          >
            Scroll the whole sports universe.
          </h2>

          <p className="max-w-[36ch] text-[20px] leading-[1.4] tracking-[-0.025em] text-muted">
            Games, news, players. One card at a time.
          </p>

          <p className="max-w-[48ch] text-[16px] leading-[1.5] tracking-[-0.025em] text-muted">
            Buzzr is a sports rating app built for fans, not fantasy managers. Every live game gets a 1 to 10 entertainment score, the Buzzr Score, built from chaos, energy, and drama. Not the final margin. A 40-point blowout and a triple-overtime thriller aren&apos;t the same game, and your feed shouldn&apos;t treat them like they are.
          </p>
        </div>

        <div className="relative flex justify-center lg:justify-end">
          <div className="relative mx-auto h-[470px] w-[330px]">
            <div
              aria-hidden
              className="absolute left-1/2 top-1/2 h-[320px] w-[320px] -translate-x-1/2 -translate-y-1/2 rounded-full blur-2xl"
              style={{ background: 'radial-gradient(circle, rgba(0,230,118,0.14), transparent 70%)' }}
            />
            <div className="absolute left-1 top-10 w-[176px] -rotate-[5deg]">
              <DeviceFrame src="/screenshot-rate.png" alt="Rating a live game in the Buzzr app" />
            </div>
            <div className="absolute right-0 top-0 w-[214px] rotate-[3deg]">
              <DeviceFrame src="/screenshot-games.png" alt="The Buzzr games feed" priority />
            </div>
          </div>
        </div>
      </div>
    </Section>
  );
}
