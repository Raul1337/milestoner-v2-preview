# Vision V2.3A — Miles-first creation

Historical V2.3A validation below. The owner has since accepted its functional baseline, including descriptive B1 and unscheduled calendar suggestions. Presentation is refined in [V2.3A.1](CREATION_V23A1.md), pending visual acceptance. Existing web prototype only; no native/backend/domain contract changes.

## Reuse and resulting behavior

The increment reuses the existing M+ entries, sidebar/drawer, language context, modal conventions, fixture clock, project/task/reminder arrays, project navigation and localStorage adapter. Existing saved projects and original calculation tests remain intact. No new dependencies, AI or integrations.

Before, every arbitrary prompt became Travel with target 8 and an invented April date. Now the entry discloses three deterministic local scripts, accepts EN/ES intentions and declines unrelated text. Manual project/reminder creation remains visible and bypasses the scripts.

- Japan: optional date/budget/preferences; unknown values remain empty. Editable suggested preparation and itinerary, plus unscheduled calendar ideas. No bookings or events are created.
- French: broader project, optional descriptive milestone (B1), editable/removable learning suggestions and optional dates. No school/enrollment/routine assumed.
- Dentist: native short confirmation dialog, tomorrow based on the fixed demo clock (31 October 2026), empty optional time. Only a standalone reminder is created. Escape/cancel persists nothing.

Only explicit confirmation adds records. Project cards and the focused details view for these planning projects omit a universal percentage. The four existing example projects keep their original details and numeric tracking. New tasks enter Today only if dated for the demo day; reminder dates also control Today inclusion. All standalone reminders can be reopened from their Home list and edited. Project details allow editing name, unknown/confirmed details, activities and dates. Miles reopens the stored confirmed project context directly after reload.

## Web-only compatibility

The existing key `milestoner-vision-v2-demo-v1` and version 1 remain unchanged. `src/model.js` is unchanged. New records retain the existing project shape and add optional `vision` presentation metadata; zero target is a compatibility sentinel for “no global target,” never rendered as a goal/percentage. Old records without metadata follow the existing code path. Actual logs are unchanged by creation or task completion. Production domain/SQLite/Sync contracts are untouched.

The optional milestone is descriptive review content, not a new B1 evaluator/tracking engine. Calendar ideas stay text until a future authorized scheduling flow; no events, alerts, enrollment or bookings are inferred. These representation/interaction choices remain subject to owner UX acceptance.

Theme Playground token files and controls remain isolated and unchanged. Its deterministic creation scene now skips the new optional clarification to reach the same review pose; no global theme is activated.

## Validation

23 automated tests pass: 19 previous tests plus scripts/fallback, scheduling, standalone reminder/no-time, and mixed legacy/new persistence round-trip. Both builds pass. Browser validation covers three journeys × EN/ES × 390/1440 × Light/Dark (24 combinations), proposal edits/removal, explicit confirmation, refresh/reopen. Focused checks cover cancellation/unmatched text with unchanged record counts, manual creation, post-creation edits and Today inclusion/removal after date changes.

The browser inspector timed out during one long batch. Work resumed from its visible preserved state; screenshots cover all combinations. Desktop Light initially remained Dark despite the requested container scheme; that pass was rejected. Desktop Light was repeated using the existing Light tokens forced in a local review harness (never published). Mobile Light and Dark were observed directly; system-wide media behavior is not certified. These are web UX checks, not production/accessibility certification or device tests.

No secrets, real data, private endpoints or local paths are included in source/bundles. Native preservation is verified separately. Final publication/HTTPS verification is recorded in the delivery report. Stop for owner UX acceptance.
