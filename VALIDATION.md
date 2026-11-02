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

`npm test` runs every `tests/*.test.js` file: model, creation/editing, scheduling, navigation/history, stable geometry, translations, sidebar preferences, card metrics, reminder chronology, insight selection/consumption storage, palette/contrast, build-mode isolation unified Project Details compatibility/metrics, Agenda projections/week navigation/event confirmation/duplicate prevention, Progress period/lifetime/unit/eligibility/frequency semantics, independent Discover catalog/search/seeds/duplicate matching/storage compatibility, and isolated Interest Universe affinity/explicit confirmation/storage/routes. The public build enables the accepted Home while excluding lab controls; Theme Playground explicitly disables the current-Home and lab flags.

Block publication for test/build failures, unintended source changes, sensitive content or broken Pages assets. Inspect all new/changed files and final bundles, including SVG metadata and external URLs. Publish synthetic data only. Do not stage generated builds, caches, diagnostic logs or review matrices.

## Focused browser regression

Run the public build under the Pages base, not only the development server:

- Home at 320/390 px and desktop with sidebar folded/expanded; EN/ES and Light/Dark; no horizontal overflow or broken images. Heading, Today and Your Life remain aligned.
- Today fold/expand, unchanged counts and Add; Your Life fold and category filtering. At 320/390/768 px retain Projects/Reminders tabs; at 901/1024/1440/1920/2560 px show Projects and Reminders together, with independent disclosures and both sidebar states. Verify chronological ordering, privacy masking in text and accessible labels, recurrence labels without new occurrences, editing/completion shared with Today, future/no-time records, empty state and reload without duplicate saved entities.
- Pending bell: open/close by bell, outside click, Escape and X; reload/reopen retains pending. Dismiss and contextual Review persist consumption. Review opens the correct Project; Back/Forward do not revive it. Verify focus and keyboard, modes and independent M+.
- Japan/French/dentist, manual creation, cancellation/discard, explicit confirmation, saved-content reload and project navigation. Unknown times stay empty; B1 stays descriptive and calendar ideas stay unscheduled.
- Discover, unified project Overview/Insights/Settings, Progress, simulated calendar and You/preferences. Check original and Miles-created projects, long titles/empty activities, quick editing/cancellation, identity/date association, B1 as descriptive only, ideas as unscheduled, and maximum-distance/summed-contribution metrics from actual non-future records. Verify contextual section order, next-step keyboard focus on the matching activity, non-repetitive Insights, compact empty scheduling, and Settings as the project configuration entry.
- Agenda from Today/Project Details; explicit dates only, project filter, chronological type labels, untimed items, private masking until reveal, recurrence labels without expansion, week/date/hash Back/Forward/reload and M+ return. Event creation starts blank, review does not save, explicit confirmation/identity-preserving edit, duplicate explanation without draft loss, cancel/discard/focus restoration. Compare original activity/reminder/event records across Agenda, Today and Project Details.
- Progress: Overall/project views for week/month/year, count distribution versus unit-specific values, finance period contributions versus lifetime savings/remaining, fitness maximum versus sum, learning sessions/practice days without B1 proficiency, travel without completion, generic and empty projects. Compare shared lifetime metrics with Project Details; invalid/future/private/orphan records never enter charts/history. Verify text equivalents, filters/keyboard, long titles, EN/ES, Light/Dark and mobile/desktop overflow/centering.
- Discover: independent eight-idea catalog, four categories, search/case/accents and no-result reset; readable long EN/ES titles at mobile/desktop widths and both appearances. Explore opens the matching manual proposal, editable and undated; cancellation saves nothing, explicit confirmation preserves existing projects/IDs and reload. Verify existing-project access, bilingual title matches, edited-title matching, explicit duplicate wording, focus restoration and unchanged scripted creation.
- You: direct Universe entry; central user node → Profile → General Settings; interest detail and all four affinities, stable node order, custom add/duplicate/remove, proposed Add/Not really separated from confirmed nodes and persisted after reload. Orbital composition at 320/375/390/428/768/1024/1440 widths and counts 0/1/8/9/12/16/24, eight normal nodes, complete saved-order collection in one expanded orbit with exactly one avatar and one node per confirmed ID, all four affinity sizes and stable positions after explicit edits, maximum-size collision reservation, long names, original illustrated avatar, lower actions. Expanded entry/exit/Escape and additional nodes, Back/Forward and M+ return. Check 320/390 px and desktop/sidebar states, EN/ES, Light/Dark, readable targets/names, no clipping/overlap, keyboard/focus and no continuous animation. Profile must not invent milestone metrics or achievements; existing language/modes/context/reset confirmation remain available and app records remain unchanged.
- Isolated Theme Playground loads without adopting app state or current Home behavior.

After normal push, verify the workflow for the exact commit succeeded, remote `main` matches the commit and the public HTTPS preview loads the new bundle and relevant flows. A local build alone is not a verified deployment.

## Evidence retention

CI and Git history retain technical results. Use temporary/ignored diagnostics during work; deliver only a concise change summary, URL, commit, tests/build outcome and remaining blocker/decision. No new permanent screenshot/log/JSON/HTML evidence package by default. A current lightweight `/review/` comparison is optional when useful, not a mandatory report.

Web validation is separate from iOS/backend regression, production readiness or physical-device/accessibility certification. Record blocked or untested cases as such; never reclassify them as passed.

## Approved mobile baseline

V2.5B.1e source candidate `c3bae01` was owner-approved for Web preview publication on 1 November 2026. Validate 320/390px Light/Dark, unchanged desktop geometry, single expanded canvas/profile, interest details and identity-preserving affinity edits, reload and navigation. Existing geometry checks cover 273–449px containers and maximum-size bubbles. Full publication gate remains 112 tests and all three builds; verify the exact published SHA in Actions and live Pages. Approval does not extend to native iOS or production services.

## Profile Overview V2.5B.2a candidate

PENDING OWNER REVIEW. Preview publication is authorized and required after validation; publication does not accept the UX. `tests/profile-overview.test.js` verifies the three-record projection, original record/project identities and dates, existing privacy/date/value eligibility, no task/event-derived achievements, empty state and saved Miles/long-content compatibility without persistence changes. Browser checks cover 320/375/390/768/1440, EN/ES and Light/Dark: four readable unavailable statistics, one shared illustrated portrait, compact empty domain/badge sections, activity destinations, Progress/Settings/Universe, Back/Forward/reload, M+ return and visible interactive focus without a persistent heading outline. Capture only the five requested final views. Keep the recovered mockup outside public assets and all build outputs; any reference comparison is private and local only.

## Edit Profile V2.5B.2b candidate

PENDING OWNER VISUAL AND FUNCTIONAL REVIEW. Full tests include profile defaults/versioned isolated storage, explicit-save-only writes, Unicode names/demo field limits, optional alias/bio, three reversible avatar variants, corrupt/denied storage with truthful visit-only results, reset separation and dirty-editor route/M+ protection. Browser checks: Save/Cancel, name/alias errors, 160-character bio/long name, empty optional fields, shared saved name/avatar across Overview/editor/Universe, reload, Back/Forward, quick-link discard/keep, picker Escape/focus and M+ draft return. Validate 320/375/390/1280/1440 in EN/ES and Light/Dark, readable inputs/touch targets, no header overlaps or horizontal overflow. Storage-denial behavior is covered with injected failing storage in unit tests; physical browser before-unload behavior remains browser-controlled. Keep only the current public review captures and exclude all private references.

## Badges V2.5B.2c candidate

PENDING OWNER VISUAL AND FUNCTIONAL REVIEW. The full suite includes an immutable bilingual illustrative catalog without award/eligibility/history fields, empty Featured regardless of activity records, and Badges/Featured history, reload and M+ return without storage access. Full publication gate: 125 tests and all three builds.

Browser validation covers 320/390/768/1280/1440 × EN/ES × Light/Dark: eight distinct medallions, complete translated names/descriptions, readable 2/3/4-column layouts, no horizontal overflow or clipped labels, and links at least 44px tall. Verify All/Featured, honest unavailable earned/empty Featured state, disclosure by keyboard, visible link focus, Profile/Settings/Universe routes, M+ focus return, Back/Forward and direct reload. Saved long names and avatar appearances must be shared from Edit Profile; neither catalog navigation nor filtering writes badge state or changes records. Keep the six current review captures only; private original references stay excluded from every build. Physical-device and spoken-screen-reader certification are not claimed.

## First-use onboarding V2.5C.1a candidate

PENDING OWNER VISUAL AND FUNCTIONAL REVIEW. Full publication gate: **143 tests and all three builds**. The original nine onboarding tests cover optional/Unicode/blank names, no initial selections, reversible deterministic Curious initialization, zero–12 selections, normal/expanded collision-safe geometry, immutable catalog semantics, session-only key isolation, unchanged Profile/Universe/application sentinels, corrupt/denied storage, reload, Back/Forward and discard without history resurrection. Shared Light/Dark/increased-contrast roles and text/link/action contrast are checked; build configuration has a separate review HTML input.

Browser checks cover all four stages at 320/375/390/428/768/1440 in EN/ES and Light/Dark, plus desktop 1280. Verify actual inner viewport dimensions. Check complete selection labels, full accessible names, one profile, no collisions/overflow, focus, dialogs/Escape/keep/discard, reload, named/unnamed/zero/8/12 selections, all-selected expansion and explicit finish. Review 200% text and reduced motion at mobile/desktop, including short 320×600 dialogs with internal scroll and keyboard-reachable actions. Inspect both appearance choices using the review control, not only URL labels.

Observe saved Profile text and Universe accessible labels before/after exiting the candidate; compare unchanged main application sources/keys and independent store tests. Smoke-test normal Home, M+, Profile and Universe after deployment. Storage denial/failed clearing use injected storage tests; browser tab restoration and physical mobile keyboard/VoiceOver behavior are not certified. Keep seven current viewport captures in /review/, not permanent diagnostic matrices. No private original references enter source/assets/builds.

V2.5C.1a adds nine focused tests: 35-interest bilingual catalog with unchanged original twelve roles, normalized search/duplicates across both locales and retained custom text, Unicode/code-point validation, stable temporary IDs, delete/re-add, explicit nonmutating version-1 compatibility, version-2 corruption/denied storage/isolation, and 0–60 combined collision-safe slots at all target widths. The normal app catalog still has its original twelve fixtures.

Browser review for this slice: 320/375/390/428/768/1440px; selection/search/theme/selected-only/empty feedback; multiple custom interests; duplicate selection, explicit removal/re-add, Escape/focus return, history/reload; 37-item expanded canvas with one profile and no collisions/overflow. Check EN/ES, Light/Dark and 200% text, including a 320×600 scrollable editor. Use only seven current public captures of catalog/search/editor/selected customs/Universe. Larger expanded collections intentionally require vertical scrolling and are not virtualized; physical keyboard, browser session restoration and spoken-screen-reader certification remain outside this Web check. V2.5C.2 is not implemented.
