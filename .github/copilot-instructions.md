# GitHub Copilot Instructions

Use these instructions for all Copilot interactions in this repository.

## Project Context
- TypeScript with Next.js App Router, React 19, and Tailwind CSS 4.
- Basic marketing web app deployed on Vercel and hosted on GitHub.
- Solo team with a priority on clean, simple, readable code.
- Prefer functional programming and pure, composable utilities.

## Code Style and Architecture
- Keep code simple and explicit; avoid clever abstractions.
- Prefer small, focused functions and components.
- Favor composition over inheritance.
- Use existing patterns and utilities before introducing new ones.
- Maintain server and client component boundaries in the App Router.

## Styling
- Use Tailwind CSS for styling and keep markup semantic.
- Avoid custom CSS unless necessary and consistent with existing patterns.

## Testing
- Unit tests live under src/__tests__ using Jest and React Testing Library.
- E2E tests live under tests using Playwright.
- Do not mix Jest and Playwright test locations.
- Use the mocks provided in jest.setup.js.

## Repository-Specific Rules
- Use the easing curve [0.25, 0.25, 0.25, 0.75] for Framer Motion transitions.
- Keep animated gradient keyframes defined via inline style patterns used in existing UI components.
- Do not remove the 1s delay or the 100-character logging limit in the contact API route.
- Keep the Tailwind theme mapping pattern in globals.css, including the required theme inline directive.

## Security and Privacy
- Never introduce hardcoded secrets or sensitive data.
- Sanitize and validate user input for API routes and forms.
- Log only what is necessary and avoid storing sensitive information.

## Documentation
- Update README or relevant docs when behavior, setup, or public APIs change.
- Keep documentation concise and user focused.
