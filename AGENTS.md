# AGENTS.md

This file provides guidance to agents when working with code in this repository.

- Build / run
  - Dev server: npm run dev
  - Build: npm run build
  - Lint: npm run lint

- Testing (non-obvious)
  - Unit tests: Jest is configured; run a single unit test file with:
    [`npx jest src/__tests__/components/blog-content.test.tsx`](src/__tests__/components/blog-content.test.tsx:1)
    (Jest is wrapped with `next/jest` - see [`jest.config.js`](jest.config.js:1) and setup mocks in [`jest.setup.js`](jest.setup.js:1))
  - E2E: Playwright is configured under [`tests/`] and uses a dev server. Run a single E2E file:
    [`npx playwright test tests/navigation.spec.ts`](tests/navigation.spec.ts:1) or
    npm run test:e2e -- tests/navigation.spec.ts
    (See [`playwright.config.ts`](playwright.config.ts:1) — it starts the app with `npm run dev` and uses baseURL http://localhost:3000)

- Key non-obvious rules (avoid mistakes)
  - Unit tests must live under src/__tests__ (Jest). The Playwright tests live under tests/ and are ignored by Jest — do not mix locations. See [`jest.config.js`](jest.config.js:7-11) and [`playwright.config.ts`](playwright.config.ts:7).
  - Jest setup (`jest.setup.js`) mocks `next/navigation`, `framer-motion`, IntersectionObserver, matchMedia, and global.fetch — tests rely on those mocks.
  - Playwright webServer reuses existing server (reuseExistingServer: true) — CI behavior differs (retries/workers) when NODE env CI is set. See [`playwright.config.ts`](playwright.config.ts:71-81).
  - Tailwind uses the PostCSS plugin [`@tailwindcss/postcss`] via [`postcss.config.mjs`](postcss.config.mjs:1) and requires `@theme inline` in [`src/app/globals.css`](src/app/globals.css:50). Removing this breaks CSS variable mapping.
  - Animated gradients use inline `<style jsx>` for keyframes (see [`src/components/ui/animated-gradient.tsx`](src/components/ui/animated-gradient.tsx:22)) — follow that pattern for component-specific animations.
  - Use the easing curve `[0.25, 0.25, 0.25, 0.75]` for Framer Motion transitions (see [`src/components/animations/fade-in.tsx`](src/components/animations/fade-in.tsx:49)).
  - All configuration objects use `as const` for type safety (see [`src/lib/constants.ts`](src/lib/constants.ts:1)).
  - Contact API at [`src/app/api/contact/route.ts`](src/app/api/contact/route.ts:11) simulates a 1s delay and logs only the first 100 chars of the message for privacy — do not remove that behavior.

- ESLint notes (non-obvious)
  - Rules overridden in [`eslint.config.mjs`](eslint.config.mjs:15-19): `react/no-unescaped-entities` is off and `@typescript-eslint/no-empty-object-type` is off; unused vars are warned.

(Only list surprising, project-specific constraints here — everything else follows standard Next.js/TypeScript practices.)