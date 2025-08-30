# AGENTS.md

This file provides guidance to agents when working with code in this repository.

## Non-Obvious Project Patterns

- **CSS Variables System**: Uses CSS custom properties with `@theme inline` directive in [`globals.css`](src/app/globals.css:50) - requires Tailwind v4 syntax
- **Animation Pattern**: Custom easing `[0.25, 0.25, 0.25, 0.75]` used consistently across animations in [`fade-in.tsx`](src/components/animations/fade-in.tsx:49) and [`stagger-children.tsx`](src/components/animations/stagger-children.tsx:42)
- **Theme Toggle Hydration**: Uses mounted state check to prevent hydration mismatch in [`theme-toggle.tsx`](src/components/layout/theme-toggle.tsx:16)
- **AnimatedGradient**: Uses inline `<style jsx>` for keyframes instead of external CSS in [`animated-gradient.tsx`](src/components/ui/animated-gradient.tsx:22)
- **Contact API**: Simulates 1-second delay and logs truncated messages for privacy in [`route.ts`](src/app/api/contact/route.ts:50)
- **Constants Pattern**: All data uses `as const` assertions for type safety in [`constants.ts`](src/lib/constants.ts:14)
- **ESLint**: Disables `react/no-unescaped-entities` and `@typescript-eslint/no-empty-object-type` rules in [`eslint.config.mjs`](eslint.config.mjs:16)
- **Font Setup**: Three font families loaded via Google Fonts - Inter (sans), Poppins (display), JetBrains Mono (code) in [`globals.css`](src/app/globals.css:71)
- **No Testing Framework**: Project has no test configuration files (no Jest/Vitest setup)
- **Tailwind v4**: Uses `@tailwindcss/postcss` plugin with no traditional config file in [`postcss.config.mjs`](postcss.config.mjs:2)