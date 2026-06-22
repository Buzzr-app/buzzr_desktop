# Buzzr

**The AI-native sports social app.**

Buzzr brings Scroll, live game ratings, dashboards, friends and chat, leagues, and Buzzr Bets into one dark sports social surface. This repository contains the Next.js landing page, blog, changelog, and legal pages for the Buzzr mobile app.

## Design System

- **Visible mark**: transparent metallic green Buzzr B with no background shell.
- **Theme**: dark-only app shell and browser chrome.
- **Typography**: Geist Sans and Geist Mono with zero letter-spacing for product UI.
- **Interface**: compact premium surfaces, real app screenshots, focused motion, and restrained green aura.

## Product Taxonomy

- AI Feed
- Scroll
- Dashboards
- Friends and Chat
- Leagues
- Buzzr Bets

Buzzr Bets tracks DFS slips placed elsewhere. Buzzr does not integrate sportsbooks, place wagers, or sell odds.

## Tech Stack

- **Framework**: [Next.js](https://nextjs.org/) App Router
- **Styling**: [Tailwind CSS](https://tailwindcss.com/)
- **Icons**: [Lucide React](https://lucide.dev/)
- **3D hero**: raw [Three.js](https://threejs.org/)
- **Deployment**: Vercel

## Getting Started

Install dependencies:

```bash
npm ci
```

Run the development server:

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

## Verification

```bash
npx tsc --noEmit -p tsconfig.json
npm test -- --runInBand
npm run build
```

## Branding And Legal

Product naming must use **Buzzr**.

Buzzr is not affiliated with BUZZR TV (Fremantle).
