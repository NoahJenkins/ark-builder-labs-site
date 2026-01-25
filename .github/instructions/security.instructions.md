<!-- Based on: https://github.com/github/awesome-copilot/blob/main/instructions/security-and-owasp.instructions.md -->
---
applyTo: "**/*.{ts,tsx,js,jsx}"
description: "Security best practices for web applications"
---
# Security Guidelines

Follow the repository instructions in .github/copilot-instructions.md.

## General Security
- Validate and sanitize all user input on both client and server.
- Enforce least privilege and deny by default when accessing sensitive resources.
- Never hardcode secrets or tokens and avoid logging sensitive data.

## Web Security
- Prevent cross site scripting by treating all user content as untrusted.
- Use secure authentication and authorization checks for protected routes.
- Protect against abuse with basic rate limiting where applicable.

## Dependencies and Configuration
- Use up to date dependencies and monitor for vulnerabilities.
- Keep environment variables and secrets out of source control.
- Avoid unsafe dynamic code execution patterns.
