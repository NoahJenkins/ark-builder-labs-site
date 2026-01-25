<!-- Inspired by: https://github.com/github/awesome-copilot/blob/main/instructions/playwright-typescript.instructions.md -->
<!-- Inspired by: https://github.com/github/awesome-copilot/blob/main/prompts/javascript-typescript-jest.prompt.md -->
---
applyTo: "**/*.{test,spec}.ts,**/*.{test,spec}.tsx,src/__tests__/**,tests/**"
description: "Testing standards for Jest and Playwright"
---
# Testing Standards

Follow the repository instructions in .github/copilot-instructions.md.

## Test Strategy
- Use Jest and React Testing Library for unit and component tests.
- Use Playwright for end to end tests.
- Keep tests deterministic and avoid flaky patterns.
- Focus on behavior and user outcomes, not implementation details.

## Jest and React Testing Library
- Place tests under src/__tests__ following existing naming conventions.
- Use descriptive test names that explain expected behavior.
- Use arrange act assert or given when then structure.
- Mock external dependencies and network calls.
- Prefer testing user interactions and accessibility queries.

## Playwright
- Place tests under tests with feature or page based names.
- Use role based and user facing locators.
- Use test steps for readable test flow.
- Avoid hard waits and rely on web first assertions.
- Keep setup minimal and shared with beforeEach when appropriate.

## Coverage and Maintenance
- Add tests for critical paths and regressions.
- Update or remove tests when behavior changes.
- Keep tests small and focused on one scenario.
