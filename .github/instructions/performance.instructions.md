<!-- Based on: https://github.com/github/awesome-copilot/blob/main/instructions/performance-optimization.instructions.md -->
<!-- Inspired by: https://github.com/github/awesome-copilot/blob/main/instructions/nextjs.instructions.md -->
---
applyTo: "**/*.{ts,tsx,js,jsx,css}"
description: "Performance optimization guidance"
---
# Performance Guidelines

Follow the repository instructions in .github/copilot-instructions.md.

## Core Principles
- Measure first and optimize only when necessary.
- Prefer simple solutions that are easy to maintain.
- Avoid premature optimization that harms readability.

## Next.js and React
- Keep most logic in server components to reduce client bundle size.
- Use lazy loading for non critical UI and heavy dependencies.
- Avoid unnecessary re renders and unstable props.

## Assets and Styling
- Use built in image and font optimization.
- Keep CSS and Tailwind usage minimal and reusable.
- Avoid large client side scripts on initial load.

## Reliability
- Avoid blocking operations in the request path.
- Cache expensive computations when appropriate and safe.
