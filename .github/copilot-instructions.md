# Project-Specific Guidelines for GitHub Copilot

## Project Overview
- Primary language(s): TypeScript, JavaScript, MDX/Markdown
- Framework(s): Next.js 15 (App Router), React 19
- Architecture pattern: Next.js app-router web application with component-library organization and file-based MDX content

## Coding Standards

### Language & Framework Versions
- Node.js: `22.x`
- Next.js: `^15.5.12`
- React / React DOM: `19.1.0`
- TypeScript: `^5.9.3`
- Tailwind CSS: `^4.2.1`

### Code Style
Observed project patterns:
- Naming conventions:
  - Components: `PascalCase`
  - Utility/functions/variables: `camelCase`
  - Route segments/files: Next.js conventions (`page.tsx`, `route.ts`)
- File organization:
  - App routes in `src/app/`
  - Shared UI and page components in `src/components/`
  - Utilities/config in `src/lib/`
  - Unit tests in `src/__tests__/`, E2E tests in `tests/`
- Import structure:
  - Path alias `@/*` configured in `tsconfig.json`
- Error handling patterns:
  - API routes use structured `try/catch`, typed validation (`zod`), and explicit HTTP responses
- Testing patterns:
  - Jest with Testing Library for unit tests
  - Playwright for E2E and responsive/browser coverage

### Testing Conventions
- Test file naming:
  - Unit: `*.test.ts` / `*.test.tsx` under `src/__tests__/`
  - E2E: `*.spec.ts` under `tests/`
- Test framework:
  - Unit: Jest (`next/jest` wrapper)
  - E2E: Playwright
- Coverage expectations:
  - Run targeted unit tests for changed areas; maintain no regressions in CI checks
- Mocking approach:
  - `jest.setup.js` provides mocks for `next/navigation`, `framer-motion`, browser APIs, and `fetch`

## Documentation Structure

This repository follows a structured documentation approach:

### docs/architecture/
High-level architecture overviews, system diagrams, and data flow documentation. Update when overall system design changes significantly.

### docs/adr/ (Architecture Decision Records)
Architecture Decision Records documenting significant architectural choices. Files are named `NNNN-short-title.md` (e.g., `0001-use-postgresql.md`). ADRs are immutable and append-only.

**Each ADR must include:**
- Status (proposed, accepted, deprecated, superseded)
- Context (problem, constraints, requirements)
- Options considered (alternatives with pros/cons)
- Decision (what was chosen and why)
- Consequences (trade-offs, implications)

Write an ADR when decisions affect structure, dependencies, non-functional requirements, interfaces, or construction techniques.

### docs/context/
Exploratory research, planning session notes, and working documentation. Files named `YYYY-MM-DD-topic-name.md` with Summary, Options/Findings, and Open Questions sections. Maintain an `index.md` linking related notes to resulting ADRs.

### docs/TODO.md
Living project task tracker. Add major tasks as they arise, keep checkbox status current (`- [ ]` / `- [x]`), and mark completed tasks immediately as work finishes.

## Information Sources Priority

### 1. Primary: Documentation Lookup Tools
- Use available documentation lookup tools (for example Context7 MCP docs tools) for technical lookups when available
- Look up:
  - Library/framework documentation
  - API references
  - Language features and syntax
  - Current-version best practices

### 2. Secondary: First-Party Official Documentation
Use first-party official sources when tool-based lookup is unavailable:
- nextjs.org docs for Next.js
- react.dev for React
- typescriptlang.org for TypeScript
- Official GitHub repositories and vendor-maintained docs

### 3. Never Rely Solely on Training Data
- Do not rely only on static model memory for:
  - Current package versions
  - Breaking changes and deprecations
  - Security recommendations

## Security Guidelines

### Critical Requirements
- Never commit secrets, credentials, API keys, or tokens
- Use environment variables for sensitive configuration
- Validate and sanitize user input (use `zod` where applicable)
- Keep dependencies current and audited
- Preserve privacy-aware logging patterns in API routes

### Code Review Focus
- Input validation/sanitization
- AuthN/AuthZ checks for protected routes
- Error handling without sensitive data leakage
- Dependency and supply-chain risk

## Build & Deployment
- Build command: `pnpm run build`
- Test command: `pnpm test` and `pnpm run test:e2e`
- Development server: `pnpm run dev`
- Production build: Next.js build output, deployed via Vercel config in `vercel.json`

## Documentation Update Policy (Automatic, No Prompt)

For any non-trivial code change, update documentation in the same turn without asking for confirmation.

### Required behavior
- Perform a docs impact check after every code edit
- If impacted, update relevant files under `docs/`, including:
  - `docs/TODO.md`
  - `docs/context/index.md`
  - A new dated context note in `docs/context/`
  - A new ADR in `docs/adr/` when architecture/behavior/dependency/runtime decisions changed
  - `docs/architecture/` when execution flow/system design changed
- Do not ask for confirmation when docs targets are clear

### Autonomy rule
- Assume user consent for documentation updates directly related to implemented code changes

### Completion gate
- A task is incomplete until required documentation updates are applied

### Delegation requirement
- Use `@documentation-specialist` automatically after implementation for docs updates when available

### ADR triggers
- Significant design/architecture decisions
- Decisions affecting structure, dependencies, interfaces, runtime, or behavior
- Adoption of new technologies/patterns

### Context note triggers
- Research/exploration sessions
- Planning notes
- Documenting rationale behind experiments

### Architecture doc triggers
- Refactors changing system structure
- New major components/services
- Data flow/integration changes

## General Documentation Principles
- Keep docs focused on one topic
- Use markdown for all documentation
- Link ADRs, context notes, and architecture docs
- Store documentation with code in version control
- Never include secrets or sensitive PII in docs

## Sub-Agent Delegation

This repository has specialized Copilot agents in `.github/agents/`. Delegate tasks to the appropriate agent:

| Task type | Delegate to |
|-----------|-------------|
| Technical research, version lookups, API references | `@research-agent` |
| Code quality review and refactoring suggestions | `@code-reviewer` |
| Security analysis and vulnerability checks | `@security-specialist` |
| ADRs, architecture docs, context notes, README updates | `@documentation-specialist` |

Optional expanded delegates installed for this stack:
- `@frontend-specialist`
- `@backend-specialist`
- `@devops-specialist`

### Delegation guidelines
- Provide context (paths, requirements, constraints)
- Let each specialist finish its full analysis before applying outcomes
- Use multiple specialists in sequence for multi-domain tasks
