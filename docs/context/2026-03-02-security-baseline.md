# Security Baseline Report
*Generated: 2026-03-02*

## Summary
The repository has a strong baseline security posture for current dependencies and CI policy controls. Dependency audit results show no known vulnerabilities at this time, and no obvious hard-coded secrets were detected in tracked source files. Follow-up work should focus on dependency hygiene policy consistency and continued periodic auditing.

## Critical Findings
- No Critical or High dependency vulnerabilities detected by `npm audit` in current lockfile state.
- No hard-coded credentials matched common secret patterns in tracked source files.

## Dependency Inventory
- Total direct dependencies: 36
- Total resolved lockfile packages: 886
- Dependencies with known vulnerabilities: 0
- Dependencies without exact version pinning: 35 (semver ranges); 1 exact pin (`react`, `react-dom`)
- Outdated dependencies (>1 year): # TODO: Determine via scheduled dependency-age reporting (not directly available from local audit output)

### Scan Provenance
- Generated from `npm audit --json` on 2026-03-02
- Runtime context: Node.js 22.x repository policy
- Manifest/lockfiles reviewed: `package.json`, `pnpm-lock.yaml`, `package-lock.json`
- Audit scope: all dependencies in current lockfile state (prod and dev)
- Suppressions/exceptions configured: none

## Detailed Findings

### Known Vulnerabilities
- `npm audit --json` reported:
  - Critical: 0
  - High: 0
  - Moderate: 0
  - Low: 0
- CI fail-threshold policy for vulnerabilities: # TODO: define (recommended: fail CI for High/Critical)

### Dependency Analysis
- Direct dependency specs in `package.json` are mostly semver-ranged (`^`), not exact-pinned.
- Transitive dependency resolution is currently locked by lockfiles (886 packages total).
- Risk note: lockfile refresh can pull newer transitive versions where semver ranges permit.

### Configuration Issues
- Both `pnpm-lock.yaml` and `package-lock.json` are present; dual lockfiles can create drift risk between local/CI environments.
- No `.github/dependabot.yml` detected in repository (Dependabot auto-merge workflow exists, but update-source config file is absent in-repo).

### Security Configuration
- CI security scanning: no dedicated SAST workflow detected.
- Dependency policy automation: present via Dependabot auto-merge gates.
- Secret scanning in CI: not explicitly configured as a dedicated workflow.

### HTTPS/TLS
- Deployment model relies on Vercel-managed TLS termination for production.
- In-repo TLS/certificate configuration is not required for this Next.js hosting model.
- HTTP→HTTPS redirect and HSTS posture should be validated in deployed environment settings.

### Secrets & Credentials
- Secret-pattern scan across tracked files found no obvious tokens/keys/password literals.
- `.gitignore` already includes `.env*` coverage; onboarding updates further harden ignore patterns.
- Scan scope covered tracked source/config/docs files; git history and external systems were not scanned in this pass.

## Recommendations
1. Standardize lockfile policy (prefer single package manager lockfile) and enforce in CI.
2. Add or confirm Dependabot configuration file (`.github/dependabot.yml`) to ensure update coverage is explicit.
3. Schedule monthly dependency + secret scanning in CI (audit + secret scanner) and track findings in `docs/TODO.md`.

## Open Questions
- Should this project retain both `npm` and `pnpm` lockfiles intentionally, or standardize on `pnpm` only?
- Does the team want to enforce dependency update automation via in-repo Dependabot config?
- Should CI add dedicated secret scanning (e.g., gitleaks) beyond pre-commit and ad-hoc checks?
