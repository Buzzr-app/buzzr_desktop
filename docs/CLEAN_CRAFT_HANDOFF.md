# Buzzr Landing Redesign: Senior Design Engineer Handoff

**Owner:** Sarvesh (buzzr461@gmail.com)
**Repo:** `Buzzr-app/buzzr_desktop` (Next.js 16, Tailwind v4, TypeScript)
**Branch:** `feat/void-arena-redesign` (open as PR #19)
**Local working copy:** `/Users/sarveshchidambaram/Projects/buzzr_desktop` (note: this clone has no `.git`; commit from a fresh clone or re-init against the remote)
**Live site:** getbuzzr.online
**Last updated:** 2026-06-20

---

## 0. Mission in one paragraph

Reframe the Buzzr marketing site as **the AI-native sports social app**. The visual language is "Clean Craft": Geist type, a cream / light-grey / steel palette, soft radii, restrained motion, modeled on interfacecraft.dev. The foundation and hero are already built and verified. What remains is a full copy rewrite to the AI-native positioning (tighter, zero em dashes), a voxel basketball hero visual, placement of the real buzzr logo, a clean light/dark section rhythm, and a polish pass. Honesty bar: only claim capabilities the app actually ships (see section 4.1).

---

## 1. Environment and run

```bash
cd /Users/sarveshchidambaram/Projects/buzzr_desktop
npm install          # geist font package is already a dependency
npm run dev          # serves on :3000 (or use the preview launch config on :3010)
npm run build        # use this to verify a clean production compile before handoff
```

- Tailwind v4 with the design tokens declared in `app/globals.css` under `@theme`. There is no `tailwind.config`; tokens become utilities automatically (for example `--color-canvas` becomes `bg-canvas`).
- Fonts load through the `geist` npm package (`geist/font/sans`, `geist/font/mono`), self hosted, no Google dependency.

---

## 2. Design system: Clean Craft (fully specified)

All of this is already live in `app/globals.css`. Do not reintroduce the old "Void Arena" dark brutalist system (Montserrat 900, uppercase crush, pure black, zero radius). That has been replaced.

### Type
- Display and body: **Geist Sans**. Numerals and eyebrow labels: **Geist Mono**.
- Headings lead with size and tracking, never mass. Max weight is 600 (semibold). Never 900. Sentence case, not uppercase.
- Tracking tightens as size grows: body near `-0.011em`, display near `-0.032em`. No crush.
- Scale tokens: `--text-body 16px/1.6`, `--text-subheading 19px`, `--text-heading 30px`, `--text-heading-lg 44px`, `--text-display 64px/1.04`.

### Color (cream / light grey / steel)
| Token | Value | Use |
|---|---|---|
| `--color-canvas` | `#f6f3ec` | page background (warm cream) |
| `--color-surface` | `#ffffff` | cards, raised surfaces |
| `--color-subtle` | `#ece7dd` | hover fills, wells |
| `--color-border` | `#ddd8cc` | hairlines, card edges |
| `--color-foreground` | `#232a31` | primary text (steel ink) |
| `--color-muted` | `#5a626b` | secondary text (steel grey, passes AA) |
| `--color-whisper` | `#9aa1a9` | faint, decorative only (fails AA, never body copy) |
| `--color-steel` | `#20262d` | dark section background |
| `--color-steel-surface` | `#2a313a` | raised card on steel |
| `--color-steel-border` | `#3a424c` | hairline on steel |
| `--color-on-steel` | `#f3f0e9` | cream text on steel |
| `--color-on-steel-muted` | `#a7afb8` | secondary text on steel |
| `--color-accent` | `#00c264` | brand green, solid fills |
| `--color-accent-dim` | `#00a152` | green hover |
| `--color-accent-text` | `#047857` | green text and links on cream (AA safe) |
| `--color-on-accent` | `#04150b` | text on a green fill |
| `--color-live` | `#e0322f` | live indicator red |

Rule: green is the single brand accent, used sparingly as signal. Use `accent-text` for green text on cream, `accent` only for fills.

### Radius and elevation
- Soft radius now: `--radius-button 10px`, `--radius-callout 16px`. The old "0px everywhere" rule is dead.
- `--shadow-card` for clean elevation, `--shadow-focus` for the green focus ring.

### Interaction primitives (already built)
- `components/ui/MagneticButton.tsx`: a Link that pulls toward the cursor and snaps back. Reduced-motion safe. Use for primary CTAs.
- `.link-underline` utility (in globals.css): underline that wipes in on hover and focus. Applied to footer links; extend to nav and inline links.
- Baseline: 200ms color and shadow transitions, green focus-visible rings on every interactive element.

### Light/dark rhythm
The steel token set exists so sections can flip to dark for rhythm. A dark section is a full-bleed `bg-steel` band with `text-on-steel`, `bg-steel-surface` cards, `border-steel-border`. `components/sections/FinalCTA.tsx` is the reference implementation.

---

## 3. Current state (done and verified live)

Verified on the running dev server (cream canvas, Geist active, no console errors):
- `app/fonts.ts`: Montserrat and Space Mono replaced by Geist and Geist Mono.
- `app/globals.css`: full Clean Craft token system, light color-scheme, animated underline utility.
- `app/layout.tsx`: Geist wired, `dark` class removed, WebGL shader (`BrandAura`) removed, footer borders and links converted, underline applied to footer links.
- `components/SiteHeader.tsx`: fully reworked to light tokens, soft radius, green CTA, subtle active nav.
- `components/sections/Hero.tsx`: sentence-case semibold display, restrained scale, soft card with `--shadow-card`, magnetic primary CTA.
- All 12 sections plus footer: dark-only classes swept to light tokens (zero residual `border-white`, `bg-white/x`, opacity-on-void text).
- `components/sections/FinalCTA.tsx`: flipped to a full-bleed steel-dark band with a magnetic green CTA (the first light/dark counterpoint).
- `components/BrandAura.tsx` still exists on disk but is unused (safe to delete).

---

## 4. Remaining work (the brief)

### 4.1 Copy reframe: AI-native sports social (highest priority)

**Positioning.** Buzzr is the AI-native social app for sports fans. You rate live games, talk takes, and the app's AI fans react, score the buzz, and keep the feed alive between whistles. Replace every instance of the old "Letterboxd for sports, rate games by entertainment" framing.

**What is real (honesty bar, do not over-claim).** From the mobile app: live game ratings 1 to 10, a Buzz score, a social feed (Swarm), takes and threads, crews (compete with friends), watch parties, DFS and pick tracking, and AI bot personas / "AI fans" that generate content and reactions. Lean the AI angle on: AI fans and AI-generated takes, AI buzz scoring, and AI recaps. Do not invent features.

**Voice rules.**
- No em dashes, ever. Use periods, commas, colons, or parentheses.
- Cut word count hard. Aim for headlines under 7 words, subcopy under 22 words.
- Sentence case for headers. Active voice. Concrete over hype. No "revolutionary", "seamless", "unleash".
- One primary CTA, repeated: "Get the app".

**Files to rewrite.**
- `src/lib/constants.ts`: `SITE_TAGLINE`, `SITE_DESCRIPTION`, `ALTERNATE_NAME`, `TRUST_STRIP`.
- `app/page.tsx`: `PAGE_TITLE`, `PAGE_DESCRIPTION`, `keywords`.
- Every file in `components/sections/*` (headings and body): Hero, RateMission, Showcase, ScrollSection, SurfacesGrid, ScrollRail, Highlights, DataBento, LeaguesWall, Reviews, Faq, LatestPosts, FinalCTA.

**Starter lines (pick or refine, keep the voice).**
- Eyebrow: `AI-native sports social`
- Hero headline options: `Sports social, with AI in the room.` / `Your sports feed talks back.` / `The AI-native home for sports fans.`
- Hero subcopy: `Rate live games, post takes, and watch AI fans argue every call. One feed for everything you watch.`
- Mission (RateMission): `Every game, scored by the fans and the AI.`
- Showcase: `The whole season, in one feed.`
- DataBento (anatomy): `How the Buzz score thinks.`
- FinalCTA: `Get in the group chat.` with subcopy `Free on iOS and Android.`

**Data fix (from the audit).** The "47 leagues" claim is wrong; `LEAGUES` holds 49 to 50 entries and the FAQ enumerates a different subset. Replace hardcoded "47" everywhere with a value computed from `LEAGUES.length`, and reconcile the FAQ list to the array. Affected surfaces: `app/page.tsx`, `Hero.tsx`, `DataBento.tsx`, `Faq.tsx`, `LeaguesWall.tsx`, `Highlights.tsx`, `ScrollRail.tsx`, and `SITE_DESCRIPTION`.

### 4.2 Voxel basketball hero visual

Owner asked to **prototype in chat first**, then wire the approved version. Do not ship a version that has not been previewed and approved.

**5-line spec.**
1. Palette: orange voxels (`#f97316` top, `#ea580c` left, `#c2410c` right faces), dark seam voxels, on the cream canvas. Brand green only as a tiny optional accent.
2. Light/dark: lives on cream in light sections; provide a variant that reads on steel for dark sections.
3. Motion feel: calm, precise, weighty. Optional slow idle rotation or parallax on scroll. Reduced-motion safe (static fallback).
4. Must NOT look like: a smooth glossy 3D render, a flat emoji, a noisy particle field, or anything cute.
5. Reference: clean isometric voxel art (think MagicaVoxel basketball), paired with interfacecraft.dev restraint.

**Approach.** Recommend a generated SVG asset (a small script places isometric cubes on a sphere shell with basketball seam logic, emits `public/voxel-basketball.svg`). This keeps the bundle light and avoids a 3D runtime. If true 3D motion is wanted later, react-three-fiber is the fallback, but start with SVG. Placement: hero right column, replacing or anchoring the phone mockups, sized around 360 to 420px.

### 4.3 Logo placement

The real logo already exists: `public/buzzr-logo.svg` (full "buzzr." wordmark), plus `public/buzzr-icon-light.svg`, `buzzr-icon-dark.svg`, and `public/brand/buzzr-mark-*.png`. Place `buzzr-logo.svg` prominently in the hero (for example above or beside the headline) via `next/image`. Keep the existing `BrandMark` in the header. Do not recreate the logo.

### 4.4 Light/dark section rhythm

FinalCTA is steel-dark. Add at most two more dark bands for rhythm, do not over-alternate. Best candidates: **Showcase** and **DataBento** (their dark app screenshots and data visuals pop on steel). Convert by switching the section background to `bg-steel`, text to `text-on-steel` and `text-on-steel-muted`, cards to `bg-steel-surface` and `border-steel-border`.

### 4.5 Cleaner / polish pass

- Reduce density and increase whitespace toward the interfacecraft.dev standard.
- QA the mid sections on cream: the in-app mock widgets (`components/mocks/app/*` such as `BuzzrMeter`, `WinProbBar`) were built dark and may need a steel-surface container or a light restyle.
- Calmer reveals: `components/ScrollReveal.tsx` currently sets `opacity: 0` plus `content-visibility: auto` and only reveals on intersection. This hides 10 of 13 sections with JS disabled and removes them from the a11y tree until scrolled. Consider a no-JS fallback (reveal by default, animate only when JS confirms support) and gentler motion.

---

## 5. Open audit findings still unfixed (reference)

From the design audit on PR #19:
- "47 leagues" is actually 49 to 50, repeated across roughly 9 surfaces (see 4.1 data fix).
- Broken CSS var references in `components/mocks/app/WinProbBar.tsx` and `SceneScoreboard.tsx`: `rgb(var(--muted-foreground))` and `rgb(var(--foreground))` resolve to invalid colors. Use `var(--color-foreground)` and `var(--color-muted)`.
- `ScrollReveal` no-JS and a11y issue (see 4.5).

---

## 6. Conventions and gotchas

- **Edit gate.** This environment runs an ECC GateGuard hook that demands a "facts" preamble before every Edit and Write (importers, affected exports, data files, the user instruction). To work without friction, run with `ECC_GATEGUARD=off` or add `pre:edit-write:gateguard-fact-force` to `ECC_DISABLED_HOOKS`.
- **Tokens only.** Use semantic tokens, never hardcode hex in components. No em dashes in any user-facing string.
- **Preview limits.** The preview screenshot tool reloads and only captures the top of the page. To verify lower sections, read computed styles with an eval, or rely on `npm run build` plus targeted reads.
- **ScrollReveal.** Below-fold sections start at `opacity: 0` until scrolled, so they will not appear in a top-only screenshot or in the a11y snapshot until in view.
- **Verification per change:** `npm run build` clean, browser console clean, and a screenshot or computed-style check of the affected surface.

---

## 7. Phased execution plan

Operate within the autonomous budget the owner set (about 2k). Verify after every phase. Stop and report if a phase fails twice.

| Phase | Work | Verify | Done when |
|---|---|---|---|
| 1 | Copy reframe: constants, page metadata, all section heds and body to AI-native, tight, no em dashes. Fix league count to computed value. | build clean, grep for em dashes returns zero in user-facing strings, read each section | Every surface reads AI-native, word counts down, zero em dashes |
| 2 | Logo into hero (`buzzr-logo.svg`). Voxel basketball: prototype in chat, get approval, then generate `public/voxel-basketball.svg` and place in hero. | screenshot hero | Logo present, voxel approved and wired, hero balanced |
| 3 | Light/dark rhythm: convert Showcase and DataBento to steel-dark bands. | computed bg checks, screenshot | Clean alternation, no broken contrast |
| 4 | Polish: whitespace, mock-widget containers, calmer reveals, fix `--muted-foreground` token refs. | build clean, full scroll review | Page reads clean end to end on cream and steel |

---

## 8. Definition of done

- [ ] All copy reframed to AI-native, tighter, zero em dashes, one primary CTA repeated.
- [ ] League count computed from `LEAGUES.length`, FAQ reconciled.
- [ ] buzzr logo placed in hero, voxel basketball approved and wired.
- [ ] Two to three steel-dark sections for rhythm, the rest cream, all AA-safe.
- [ ] Broken token refs fixed, mock widgets legible, reveals calmer and no-JS safe.
- [ ] `npm run build` clean, console clean, mobile (375px) and desktop verified.

---

## 9. Ready-to-paste agent prompt

> You are a senior design engineer working in `/Users/sarveshchidambaram/Projects/buzzr_desktop` (Next.js 16, Tailwind v4). Read `docs/CLEAN_CRAFT_HANDOFF.md` fully before touching code. Execute Phase 1 (copy reframe to AI-native, tighter, no em dashes ever, fix the league count to a computed value) end to end, then stop and show me a diff summary plus the new hero copy. Use only the design tokens in `app/globals.css`. Do not invent product features beyond those listed in the handoff. Verify with `npm run build` and report the exit code. Do not start Phase 2 (logo and voxel basketball) until I approve the voxel prototype in chat. Stay within the autonomous budget. No em dashes in any output or copy.

---

## 10. Voice cheat sheet (pin this)

- AI-native, sports social, fans plus AI in one feed.
- Short. Concrete. Active voice. Sentence case.
- Never: em dashes, "Letterboxd for sports", "47 leagues", hype words.
- Always: one primary CTA ("Get the app"), green as signal not decoration, Geist, cream and steel.
