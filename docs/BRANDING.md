# Buzzr Branding Guide

This file is the source of truth for Buzzr visual and copy branding in this repository.

## 1. Brand Identity

- Product name: `Buzzr`
- Tagline: `AI-native sports social media.`
- Company/legal entity: `Humyn LLC`
- Required disclaimer: `Buzzr is not affiliated with BUZZR TV (Fremantle).`

Implementation source:

- `src/lib/constants.ts`

## 2. Voice and Messaging

Use concise, fan-first language.

Core positioning:

- Buzzr is the AI-native sports social app.
- The main surfaces are AI Feed, Scroll, Dashboards, Friends and Chat, Leagues, and Buzzr Bets.
- Buzzr Bets tracks DFS slips placed elsewhere. It does not integrate sportsbooks.

Copy style rules:

- Keep headlines short and concrete.
- Use one primary CTA: `Get the app`.
- Avoid launch clutter, vague hype, and stale feature names.
- Do not use em dashes.

## 3. Asset System

- Visible site mark: `public/brand/buzzr-mark-transparent.png` with no background shell.
- Dark brand moments can use glow, shadow, and aura around the transparent mark.
- Square app icons are reserved for favicon, install, manifest, and OS-style surfaces.
- Open Graph and share images should keep using the metallic brand mark from `public/brand/`.
- League logos must come from local verified assets. Use text chips when no verified logo is present.

## 4. Color and Type

- Type: Geist Sans and Geist Mono.
- Green is signal, not decoration.
- Use semantic CSS tokens from `app/globals.css`.
- Do not hardcode colors inside components unless the file is defining the token system or a canvas shader.

## 5. Product Taxonomy

Use these labels in navigation, metadata, and section copy:

1. AI Feed
2. Scroll
3. Dashboards
4. Friends and Chat
5. Leagues
6. Buzzr Bets

Avoid old labels in public copy:

- Stale launch badges
- Old group viewing language
- Old entertainment-only positioning
- Stale gesture labels

## 6. Branding QA Checklist

1. Product naming is consistently `Buzzr`.
2. Footer disclaimer remains present.
3. Visible landing branding uses the metallic green Buzzr mark with no black shell.
4. No em dashes in app, component, content, or docs text.
5. No old group viewing or entertainment-only marketing copy.
6. Buzzr Bets is described as tracking only, with no sportsbook integrations.
