# Validation — 2026-11-18

Local release candidate tested on Windows using Node.js and installed Google Chrome through Playwright's Chromium driver. The source repository is published on GitHub; no hosted production deployment has been created. Version 0.2.0 adds Simplified Chinese.

## Executed checks

| Check | Result |
| --- | --- |
| TypeScript strict type checking | Passed |
| ESLint | Passed |
| Vitest + React Testing Library | 16 tests passed |
| Vite production build | Passed; code split into application, database, charts, and Markdown chunks |
| Production PWA generation | Passed; 43 precached assets, including local fonts and icons |
| Playwright desktop workflow | Passed |
| Playwright 390px mobile workflow | Passed; no horizontal page overflow |
| Offline navigation and refresh | Passed against production service worker |
| Local HTTP preview | HTTP 200 |
| Screenshots | Desktop light/dark and mobile focus captured and visually inspected |
| License | Full 34,523-byte official AGPL-3.0 text downloaded from GNU |

Unit coverage includes database persistence after closing/reopening, course editing, task completion, backup round-trip, invalid version and dangling reference rejection, duplicate ID detection, course deletion with retained tasks, overlap boundaries, CSV formula escaping, study interval calculations, timestamp accuracy, pause exclusion, partial sessions, duplicate finish prevention, sleep overshoot, break exclusion, task actual-duration updates, and labeled preferences.

The desktop browser workflow covers first-time onboarding, course creation/editing, task creation/completion/filtering, planner scheduling, calendar navigation and examination creation, note autosave across refresh and Markdown preview, timer start/pause/partial recording, dark theme persistence, JSON download and actual file restoration, dashboard, analytics navigation, offline reload, and browser runtime error collection. The mobile workflow covers onboarding skip, menu navigation, focus controls, and viewport fit.

CI runs type checking, lint, unit tests, build, and Chromium browser tests on Linux. Remote CI for this update will run after the commit is pushed. Local browser checks used `PLAYWRIGHT_CHANNEL=chrome`; the default CI configuration uses Playwright's downloaded Chromium.

## Known limitations

- This is a tested 0.1.0 release candidate, not a claim of exhaustive production certification. Firefox, Safari, actual mobile devices, screen readers, and a formal contrast/accessibility audit remain to be checked.
- Use one active timer tab. Timer writes are idempotent for a shared session ID, but cross-tab start/pause leadership is not implemented.
- Session totals exclude pauses accurately. Attribution across date boundaries is proportional to wall-clock span and may distribute paused minutes approximately; pause segments are not separately stored.
- Planner blocks move by editing their time fields; drag-and-drop is not implemented. Multi-day calendar items are listed on their starting date.
- Task completion analytics use the latest update timestamp of tasks currently completed. There is no immutable completion ledger.
- Weekly charts show the current week; date filtering controls the summary metrics and course distribution. Heatmaps cover the last 140 days.
- Data is browser-local and unencrypted. There is no sync. Browser deletion, eviction, or a changed origin can lose records. JSON backups are essential.
- English and Simplified Chinese are implemented; additional languages remain future work.
- Notifications require a supported browser and permission. Closed apps do not send notifications. Open tabs reconcile timestamps after waking.
- Dependencies are locked for reproducibility. Review supported-version upgrades before long-term production operation; the chosen Vite/Recharts/ESLint major versions are older established APIs.
- The source repository is danish-yaqoob/acadora. Maintainers should enable private vulnerability reporting.

## Reproduce

```sh
pnpm install --frozen-lockfile
pnpm lint
pnpm typecheck
pnpm test
pnpm build
pnpm exec playwright install chromium
pnpm test:e2e
```

Language coverage includes v1 database migration without data loss, legacy backup defaults, localized dates and dynamic labels, Chinese navigation across screens, task creation with stable enum values, unchanged user content, persisted language after refresh/offline reload, mobile layout, and switching back to English.
