# Reproducible Web validation

## Publication gate

Use a clean final source candidate and the committed lockfile. CI is the retained execution record:

```sh
npm ci
npm test
npm run build
npm run build:lab
npm run build:playground
```

`npm test` runs every `tests/*.test.js` file: model, creation/editing, scheduling, navigation/history, stable geometry, translations, sidebar preferences, card metrics, reminder chronology, insight selection/consumption storage, palette/contrast and build-mode isolation. The public build enables the accepted Home while excluding lab controls; Theme Playground explicitly disables the current-Home and lab flags.

Block publication for test/build failures, unintended source changes, sensitive content or broken Pages assets. Inspect all new/changed files and final bundles, including SVG metadata and external URLs. Publish synthetic data only. Do not stage generated builds, caches, diagnostic logs or review matrices.

## Focused browser regression

Run the public build under the Pages base, not only the development server:

- Home at 320/390 px and desktop with sidebar folded/expanded; EN/ES and Light/Dark; no horizontal overflow or broken images. Heading, Today and Your Life remain aligned.
- Today fold/expand, unchanged counts and Add; Your Life fold, category filtering, Projects/Reminders, chronological and private reminders.
- Pending bell: open/close by bell, outside click, Escape and X; reload/reopen retains pending. Dismiss and contextual Review persist consumption. Review opens the correct Project; Back/Forward do not revive it. Verify focus and keyboard, modes and independent M+.
- Japan/French/dentist, manual creation, cancellation/discard, explicit confirmation, saved-content reload and project navigation. Unknown times stay empty; B1 stays descriptive and calendar ideas stay unscheduled.
- Discover, project Overview/Insights/Settings, Progress, simulated calendar and You/preferences.
- Isolated Theme Playground loads without adopting app state or current Home behavior.

After normal push, verify the workflow for the exact commit succeeded, remote `main` matches the commit and the public HTTPS preview loads the new bundle and relevant flows. A local build alone is not a verified deployment.

## Evidence retention

CI and Git history retain technical results. Use temporary/ignored diagnostics during work; deliver only a concise change summary, URL, commit, tests/build outcome and remaining blocker/decision. No new permanent screenshot/log/JSON/HTML evidence package by default. A current lightweight `/review/` comparison is optional when useful, not a mandatory report.

Web validation is separate from iOS/backend regression, production readiness or physical-device/accessibility certification. Record blocked or untested cases as such; never reclassify them as passed.
