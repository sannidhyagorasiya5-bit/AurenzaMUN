# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

@AGENTS.md

## Commands

```bash
npm run dev     # start dev server at http://localhost:3000 (also regenerates the AGENTS.md rules block — see AGENTS.md)
npm run build   # production build
npm run start   # serve the production build
npm run lint    # ESLint (flat config in eslint.config.mjs)
```

There is no test runner or test suite configured.

## Stack

- **Next.js 16.3.1** with the **App Router** — see AGENTS.md: this Next.js has breaking changes from older versions; read the guide under `node_modules/next/dist/docs/01-app/` before writing code.
- **React 19**, **TypeScript** (strict), **Tailwind CSS v4** (configured via `@import "tailwindcss"` in `app/globals.css` + `@tailwindcss/postcss`; there is no `tailwind.config.*` — theme tokens live in `app/globals.css` under `@theme inline`).
- **motion** (the `motion/react` package, formerly Framer Motion) for all animation. Shared easing/duration/stagger/variants live in `lib/motion.ts` — reuse `EASE`, `DURATION`, `fadeUp`, `containerStagger`, `wordReveal`, `VIEWPORT` instead of redefining animation constants in components.
- Path alias `@/*` maps to the repo root.
- Framework-provided global types are used (e.g. `LayoutProps<"/">` in `app/layout.tsx`) — no import needed.

## Architecture

The site is a single page (`app/page.tsx`) composed of section components stacked in order: `Hero` → `Marquee` → `Committees` → `Registration` → `Secretariat` → `Resources`, wrapped by `SiteHeader` / `SiteFooter`. Navigation is anchor-based (`#committees`, `#register`, `#secretariat`, `#resources`); `app/globals.css` sets `scroll-margin-top` on `section[id]` for sticky-header offset and forces `scroll-behavior: auto` (see comment there — smooth-scroll was too janky on this page).

- **`lib/content.ts` is the single source of truth for all copy** (hero, committees, registration, secretariat, resources). It's plain data (no JSX) so both Server and Client Components can import it. Content was originally extracted from `info.md`; when editing copy, edit `lib/content.ts`, not `info.md`.
- **`components/sections/*`** — one component per page section, each a `"use client"` component composing primitives, reading from `lib/content.ts`, and animating with `motion/react` + `lib/motion.ts` variants.
- **`components/primitives/*`** — reusable animated building blocks (`TiltCard`, `TrackTabs`, `MagneticButton`, `Marquee`, `Pill`, `Reveal`, `AnimatedHeading`, `CountUp`, `SectionIntro`, `GenerativeBackground`). Sections should compose these rather than reimplementing tab/card/button behavior inline.
- **`components/layout/*`** — `SiteHeader` (fixed, scroll-aware, mobile menu with Escape-to-close + scroll lock) and `SiteFooter`.
- **Accent system**: the `Accent` type (`"blue" | "gold" | "ice"`) in `lib/content.ts` drives per-track theming (e.g. committee tracks in `Committees.tsx`/`TrackTabs.tsx`). Components map `Accent` to Tailwind classes via `Record<Accent, string>` lookup tables (e.g. `accentText`, `accentPill`) — follow this pattern rather than interpolating accent names directly into class strings.
- **Theme tokens** are CSS custom properties defined once in `app/globals.css` (`--background`, `--brand` (gold), `--blue`, `--ice`, `--surface`, `--border-glass`, etc.) and exposed to Tailwind via `@theme inline` as `--color-*`. The theme is forced dark (`className="dark"` in `app/layout.tsx`, `color-scheme: dark`).
- Reusable non-color CSS lives in `app/globals.css` too: `.glass` (translucent surface, deliberately no `backdrop-filter` — see comment, it was too expensive across many cards) and transform/opacity-only `@keyframes` (`marquee`, `float`, `glow`) driven by CSS custom properties like `--marquee-duration`.
- Respect `prefers-reduced-motion`: components read `useReducedMotion()` from `motion/react` and branch their variants (see `Committees.tsx`, `SiteHeader.tsx`); `globals.css` also force-collapses animation/transition durations as a CSS-level fallback.

## Content gaps / known TODOs

`info.md` documents gaps still open in `lib/content.ts`: 6 of 11 committees still need agendas/names for the College and IP tracks, no registration Google Form link yet, no secretariat photos, no resource files, no pricing/schedule/FAQ. Note `info.md`'s "Design System (Observed)" section (orange/green/purple accents) reflects an earlier reference screenshot and is **out of date** — the implemented theme (`app/globals.css`, `lib/content.ts`'s `Accent` type) uses gold/blue/ice. Treat `lib/content.ts` and `app/globals.css` as the current source of truth over `info.md` for anything already implemented; use `info.md` only for copy/structure that hasn't been built yet.
