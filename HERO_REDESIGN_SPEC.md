# Hero Redesign Brief - buzzr_desktop (`feat/clean-craft-finish`)

> Repo: clone of `Buzzr-app/buzzr_desktop` on branch `feat/clean-craft-finish` (PR #20).
> NEVER touch `~/Projects/buzzr_desktop` (stale snapshot). Verify in a REAL browser (Claude Preview, :3010)
> That is the ONLY source of truth. Do NOT claim done off typecheck alone.

## ✅ CURRENT STATE - already built, RENDERS. Do NOT start over.
The scene was rebuilt in RAW three.js (no @react-three/fiber because R3F v8 crashes on Next 16 / React 19) and it works:
- `components/ui/ClayHeroScene.tsx` - raw `THREE.WebGLRenderer` in a `useEffect`: translucent instanced voxel ball (Buzz heat-ramp `onBeforeCompile` shader), clay phone, pinned-scroll progress sampling, pointer parallax, reduced-motion, token reading. **It renders a clean translucent stained-glass heat-sphere.**
- `components/ui/ClayHero.tsx` - pinned wrapper (`data-hero-pin`, ~200vh, `sticky top-0 h-screen` stage) + `dynamic(ssr:false)` + error boundary + poster + `hasWebGL`. Keep this.
- `components/sections/Hero.tsx` - copy + mounts the pinned `<ClayHero/>`.
- **Blowout already fixed:** the voxel material is `THREE.NormalBlending` (NOT Additive because additive blew the center to pure white). Keep Normal.
- Confirmed in-browser: copy = "AI-Native Sports Social Media", pin mechanic locks the page, tokens read, no console errors.

## 🔧 PUNCH LIST - broken / missing (fix these)
1. **Phone reveal is BURIED.** On scroll the phone rises (`phone.position.y` lerp in `poseScene`) but lands behind/inside the ball and is too dark, so it becomes invisible. Rework per the NEW narrative below: the phone must be lit, pulled forward in z, and land in clear center stage.
2. **Grain + edge vignette NOT landing.** Voxel edges are crisp/hard. Add a soft permeable edge (radial mask) + film grain. Simplest robust route: a CSS overlay on the sticky stage (token-driven; only neutral grain/black alpha literals allowed).
3. **Dark-only app shell.** Verify the single dark canvas, not a light/dark toggle.

## 🎯 NEW CREATIVE DIRECTION (from the user - this is the goal)
1. **VOXELS: way more DETAILED and cooler.** Right now it feels lo-fi/chunky. Increase resolution (finer, denser voxel shell), and make it premium: smaller cubes, beveled/rounded edges, subtle per-voxel size/emissive variation, crisper heat-ramp shading, consider a fresnel rim. Keep translucent + Buzz heat ramp + token-only.
2. **SCROLL = "when the phone comes up, the ball EXPLODES."** As scroll progresses the voxel ball BURSTS APART. Animate per-instance offsets outward along each voxel's radial direction (+ scale/opacity fade, maybe slight tumble) while the clay phone rises from below into center stage where the ball was.
3. **CENTER-STAGE TEXT ANIMATION.** As you scroll, animate in **"BUZZR - the first AI-Native Sports Social Media"** with real CENTER-STAGE presence (centered, bold, revealing in sync with the explosion + phone rise). "BUZZR" is the brand; "the first AI-Native Sports Social Media" is the tagline. This becomes the focal moment (the current static left-aligned headline gives way to this centered reveal).
4. **"Really understand interface design"** - premium, intentional, cohesive motion. Pinned so the page doesn't move while the sequence plays.

## SCROLL SEQUENCE (assemble the above)
- **p = 0.0:** detailed translucent voxel heat-ball, centered, idle spin. Minimal/quiet text.
- **p ≈ 0.3–0.7:** ball DETONATES (voxels scatter outward + fade); phone RISES from below into center; "BUZZR / the first AI-Native Sports Social Media" animates in center-stage.
- **p = 1.0:** clean phone center-stage, text fully in, ball dissipated. Then the pin releases to the rest of the page.
- Phone must be VISIBLE: lit, forward in z (not occluded), clean clay body + dashboard screen (`/screenshot-dashboard.png`).

## CONSTRAINTS (unchanged)
Raw three.js only (no `@react-three/*`). ZERO hardcoded brand hex (read CSS tokens via getComputedStyle; re-read on `.dark` mutation). Reduced-motion safe (static pose, NO scroll-jack, section still scrollable past). Keep error boundary + poster + `hasWebGL`. Dispose GPU resources; handle resize + dpr; correct sRGB. Works in light AND dark.

## TOKENS
Buzz heat ramp: `--color-buzz-peak`(green) → `-great` → `-good`(yellow) → `-mid`(orange) → `-bad`(red) → `-garbage`(violet). Plus `--color-canvas`, `--color-accent`, `--color-foreground`, `--color-steel`. Phone screen texture: `/screenshot-dashboard.png` (1000×2174).

## VERIFY (real GPU - required)
1. `node_modules/.bin/tsc --noEmit -p tsconfig.json` -> 0.   2. `npm test` -> 15/15.
3. Claude Preview: `preview_start "buzzr-web"` (`.claude/launch.json`, :3010). Screenshot dark-only first paint.
   SCROLL the pinned section (force instant: set `document.documentElement.style.scrollBehavior='auto'`, then `window.scrollTo(0, innerHeight*p)`) and screenshot at p≈0.0 / 0.5 / 1.0 to verify the explosion + phone rise + text reveal. Confirm `<canvas>` is in the DOM (poster showing = broken). Read console.
4. Iterate on pixels until it's premium.

## DONE
Confirm with the user, then push to `feat/clean-craft-finish` (PR #20). Do NOT push without the user's OK.

---
_User's latest direction (verbatim):_ "Hand the polish loop to a fresh session on the now-working clone make the voxels
way more detailed and cooler, right now it feels lofi but this is good and the scroll animation is when the phone comes
up the ball explodes. really understand interface design and then have BUZZR the first AI-Native Sports Social Media
animation in as you scroll in the center stage presense."
