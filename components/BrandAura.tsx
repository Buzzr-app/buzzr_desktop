/**
 * Brand backdrop — pure CSS, no client JS, no WebGL, so it can never throw
 * during hydration or blank the page. A brand-green aura sits at the top of
 * the void and fades down; a fractal-noise SVG layer provides the film grain.
 * (Replaces the previous WebGL shader to remove every client-side failure mode.)
 */
export function BrandAura() {
  return (
    <div aria-hidden className="pointer-events-none fixed inset-0 -z-10 overflow-hidden">
      {/* Green ambient aura, top of page */}
      <div
        className="absolute inset-x-0 top-0 h-[720px]"
        style={{
          background:
            'radial-gradient(ellipse 90% 70% at 50% -12%, rgba(0,230,118,0.18) 0%, rgba(0,230,118,0.07) 32%, transparent 64%)'
        }}
      />
      {/* Film grain */}
      <div
        className="absolute inset-0 opacity-[0.07]"
        style={{
          backgroundImage:
            "url(\"data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='2' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)'/%3E%3C/svg%3E\")",
          backgroundSize: '170px 170px'
        }}
      />
    </div>
  );
}
