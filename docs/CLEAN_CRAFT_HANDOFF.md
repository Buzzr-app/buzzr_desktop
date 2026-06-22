# Buzzr Landing Modernization Handoff

**Repo:** `Buzzr-app/buzzr_desktop`
**Branch:** `feat/clean-craft-finish`
**Current direction:** Keep the Clean Craft foundation from PR #20 and refine it.

## Product Story

Buzzr is the AI-native sports social app. The landing page should sell one connected product:

1. AI Feed
2. Scroll
3. Dashboards
4. Friends and Chat
5. Leagues
6. Buzzr Bets

Buzzr Bets tracks DFS slips placed elsewhere. Buzzr does not integrate sportsbooks, place wagers, or sell odds.

## Design System

- Typography: Geist Sans and Geist Mono.
- Layout: premium interface density, clear rhythm, full-width bands, cards only for repeated items and framed tools.
- Palette: dark steel surfaces with green as the live signal.
- Motion: calm, purposeful, transform and opacity first, reduced-motion safe.
- Hero: raw Three.js, no React Three Fiber, with a WebGL fallback and GPU cleanup.
- Edge atmosphere: use non-3D overlay layers for radial mask, grain, and edge blur.

## Navigation

Top nav should make the product map obvious:

- AI
- Scroll
- Dashboards
- Friends
- Leagues
- Bets
- App Store CTA

Mobile nav should keep the same IA and include a sticky primary app CTA.

## Assets

- Use `public/brand/buzzr-mark-transparent.png` as the visible site mark with no background shell.
- Dark brand moments can use glow, shadow, and aura around the transparent mark.
- Keep square app icons for favicon, install, manifest, and OS-style placement.
- Use local league logo files only when verified assets exist.
- Use text chips when no verified league logo is local.
- Remove stale legacy screenshots if unused.

## Copy Rules

- No em dashes.
- No old group viewing language.
- No stale entertainment-only positioning.
- No stale gesture labels in user-facing copy.
- Prefer concrete product nouns over hype.
- Repeat one primary CTA: `Get the app`.

## Verification

Required checks before handoff:

1. `npm ci`
2. `npm run build`
3. `npx tsc --noEmit -p tsconfig.json`
4. `npm test -- --runInBand`
5. Browser review on desktop and mobile
6. Hero review at progress 0, 0.5, and 1
7. Changelog page review
8. Dark-only contrast review

## Guardrails

Do not revert PR #20 modernization work unless a local file proves it is stale or broken. Refine the current Clean Craft, Geist, floating nav, centered hero, and raw Three.js direction.
