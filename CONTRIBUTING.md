# Contributing

Thank you for helping make academic tools accessible. Open an issue describing the problem and expected behavior before a substantial change. For small fixes, a focused pull request is welcome.

Use Node 22.12+ and pnpm 11.25.0. Run `pnpm install --frozen-lockfile`, then `pnpm dev`. Before submitting, run `pnpm lint`, `pnpm typecheck`, `pnpm test`, `pnpm build`, and `pnpm test:e2e` (install Chromium with `pnpm exec playwright install chromium`). Add regression coverage for data or timer changes. Verify narrow layouts and keyboard access for UI changes.

Keep personal data local. Do not add analytics, paid services, mandatory registration, secrets, generated dependencies, real student records, or copyrighted third-party artwork. New database structures need explicit versioned migrations and import validation. Protect export compatibility and backup atomicity. Explain behavior, validation, and limitations in the PR. Contributions are licensed under AGPL-3.0-only.
