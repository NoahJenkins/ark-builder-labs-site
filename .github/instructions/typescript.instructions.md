<!-- Based on: https://github.com/github/awesome-copilot/blob/main/instructions/typescript-5-es2022.instructions.md -->
<!-- Inspired by: https://github.com/github/awesome-copilot/blob/main/instructions/nextjs.instructions.md -->
<!-- Inspired by: https://github.com/github/awesome-copilot/blob/main/instructions/reactjs.instructions.md -->
<!-- Inspired by: https://github.com/github/awesome-copilot/blob/main/instructions/nextjs-tailwind.instructions.md -->
---
applyTo: "**/*.ts,**/*.tsx"
description: "TypeScript standards for Next.js, React, and Tailwind"
---
# TypeScript and Next.js Development Guidelines

Follow the repository instructions in .github/copilot-instructions.md.

## Core Principles
- Prefer clear, readable code over clever optimizations.
- Favor functional programming, immutability, and pure functions when practical.
- Keep functions and components small, focused, and easy to test.
- Reuse existing utilities and patterns before creating new abstractions.

## TypeScript
- Use strict typing and avoid implicit any.
- Prefer type inference when it improves readability.
- Use discriminated unions for complex state and event handling.
- Keep shared types close to their domain and avoid duplication.
- Use descriptive names for types, functions, and variables.

## Next.js App Router
- Default to server components and only use client components for interactivity.
- Keep data fetching and business logic on the server when possible.
- Place route handlers in the app api structure and validate inputs.
- Avoid using dynamic client-only patterns in server component code.

## React
- Use functional components and hooks.
- Keep component responsibilities narrow and composable.
- Use custom hooks to share stateful logic.
- Maintain predictable data flow and avoid implicit side effects.

## Tailwind CSS
- Use Tailwind utility classes for styling and keep markup semantic.
- Follow existing spacing, typography, and color conventions.
- Ensure responsive and accessible UI patterns.

## Project Conventions
- Follow repository folder structure and naming conventions.
- Keep tests in the designated test directories for Jest and Playwright.
- Avoid adding example or demo files unless explicitly requested.
