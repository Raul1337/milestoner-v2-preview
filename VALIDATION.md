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

`npm test` runs every `tests/*.test.js` file: model, creation/editing, scheduling, navigation/history, stable geometry, translations, sidebar preferences, card metrics, reminder chronology, insight selection/consumption storage, palette/contrast, build-mode isolation and unified Project Details compatibility/metrics. The public build enables the accepted Home while excluding lab controls; Theme Playground explicitly disables the current-Home and lab flags.

Block publication for test/build failures, unintended source changes, sensitive content or broken Pages assets. Inspect all new/changed files and final bundles, including SVG metadata and external URLs. Publish synthetic data only. Do not stage generated builds, caches, diagnostic logs or review matrices.

## Focused browser regression

Run the public build under the Pages base, not only the development server:

- Home at 320/390 px and desktop with sidebar folded/expanded; EN/ES and Light/Dark; no horizontal overflow or broken images. Heading, Today and Your Life remain aligned.
- Today fold/expand, unchanged counts and Add; Your Life fold and category filtering. At 320/390/768 px retain Projects/Reminders tabs; at 901/1024/1440/1920/2560 px show Projects and Reminders together, with independent disclosures and both sidebar states. Verify chronological ordering, privacy masking in text and accessible labels, recurrence labels without new occurrences, editing/completion shared with Today, future/no-time records, empty state and reload without duplicate saved entities.
- Pending bell: open/close by bell, outside click, Escape and X; reload/reopen retains pending. Dismiss and contextual Review persist consumption. Review opens the correct Project; Back/Forward do not revive it. Verify focus and keyboard, modes and independent M+.
- Japan/French/dentist, manual creation, cancellation/discard, explicit confirmation, saved-content reload and project navigation. Unknown times stay empty; B1 stays descriptive and calendar ideas stay unscheduled.
- Discover, unified project Overview/Insights/Settings, Progress, simulated calendar and You/preferences. Check original and Miles-created projects, long titles/empty activities, quick editing/cancellation, identity/date association, B1 as descriptive only, ideas as unscheduled, and maximum-distance/summed-contribution metrics from actual non-future records. Verify contextual section order, next-step keyboard focus on the matching activity, non-repetitive Insights, compact empty scheduling, and Settings as the project configuration entry.
- Isolated Theme Playground loads without adopting app state or current Home behavior.

After normal push, verify the workflow for the exact commit succeeded, remote `main` matches the commit and the public HTTPS preview loads the new bundle and relevant flows. A local build alone is not a verified deployment.

## Evidence retention

CI and Git history retain technical results. Use temporary/ignored diagnostics during work; deliver only a concise change summary, URL, commit, tests/build outcome and remaining blocker/decision. No new permanent screenshot/log/JSON/HTML evidence package by default. A current lightweight `/review/` comparison is optional when useful, not a mandatory report.

Web validation is separate from iOS/backend regression, production readiness or physical-device/accessibility certification. Record blocked or untested cases as such; never reclassify them as passed.
