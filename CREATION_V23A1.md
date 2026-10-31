# Vision V2.3A.1 — Compact conversational creation

V2.3A functional behavior is the owner-accepted baseline. This increment refines web presentation only. Visual acceptance of V2.3A.1 remains with the owner.

## Before and after

The entry previously placed a large conversation form beside an empty proposal panel. It now presents one inviting composer, a concise scripted-demo disclosure, secondary example prompts and manual alternatives. After an idea is identified, a short intent recap replaces the composer. Optional clarification remains contextual: Japan has date/budget/preferences; French has a reason. Unknown details can be skipped directly, without a new wizard.

Proposals previously repeated all project, activity, schedule and calendar fields. They now show a project summary, compact informational chips and activity rows. At the same review pose, Japan has eleven fewer visible editing fields. Editors open only for the selected project section or activity, and Save/Cancel preserves the rest of the draft. Add/remove and optional scheduling remain available. Native modal dialogs provide Escape, focus containment, visible keyboard focus and restoration to their trigger. On mobile these editors use a compact bottom sheet.

Confirmed project details reuse the same summary and activity components, with explicit editing. Unknown dates/budgets are concise chips; empty optional fields are not stacked. Reminder details open in read mode, with an explicit edit action.

## Three journeys

- Japan: optional clarification → project summary with two preparation suggestions → editable/collapsible itinerary and unscheduled calendar ideas → explicit confirmation → editable confirmed plan. A project date never schedules all its activities.
- French: optional reason → learning suggestions → optional B1 description, which can be edited or removed → optional unscheduled calendar ideas → explicit confirmation. B1 does not introduce evaluation, a measurable target or a progress engine.
- Dentist: minimal title/date/optional-time confirmation → standalone reminder. Tomorrow follows the existing fixed demo clock (31 October 2026). A blank time stays blank. Cancelling does not save anything.

No calendar ideas create events, alerts, enrollments or bookings. Unscheduled tasks stay outside Today. Included project activities remain pending until explicitly completed; completion does not invent progress records.

## Compatibility and boundaries

The existing storage key/version, project/reminder arrays, legacy projects, actual logs and domain calculations are unchanged. Draft-only identity/status arrays keep activities and dates aligned through edits/removal. Confirmed edits preserve existing task IDs, status and extra fields. Confirmation also fixes the blank-row filtering case so a surviving activity keeps its own date and ID.

Original brand assets, category tokens, Light/Dark identity, sidebar/drawer and mobile M+ shortcut are unchanged. No dependencies were added. The isolated V2.2 Theme Playground receives only a selector compatibility update so its existing Miles scene reaches the compact review; no theme becomes the application default. No iOS, backend, authentication, database, Sync, AI or external calendar service changes.

## Validation

- Automated: 33/33 tests pass (23 existing + 10 draft/edit/confirmation/persistence regressions). No skips or failures. Both production builds pass.
- Browser interaction regression: project/section editors, cancel/save, add/remove activities, optional scheduling/date association, skipping, discard/reload, confirm/reload, confirmed edits, reminder edit/reopen, B1 edit/remove/re-include, calendar ideas, manual creation and navigation. See the repeatable [interaction checklist](tests/creation-interactions.md).
- Visual matrix: composer plus all three scenario reviews at 390×844 and 1440×1000, EN/ES, Light/Dark (24 scenario review combinations). No horizontal overflow in these captures. Before/after captures use the same widths and baseline revision.
- Keyboard: native editor Tab/Shift+Tab containment, Escape, restored trigger focus; sidebar preference reload and drawer navigation/dismissal. Motion/contrast/forced-color CSS fallbacks remain in place.
- Light screenshots use a local-only review harness applying the existing Light token block after the bundle. Dark is observed in the browser's actual system appearance. The harness is excluded from publication; OS appearance switching, screen-reader certification and a physical mobile keyboard are not claimed.
- Public source/assets and built files are inspected for credentials, sensitive/real data, private endpoints and local filesystem paths before publication. The runtime contains only synthetic examples and no application service calls.

## Owner review

Review compactness, proposal hierarchy, secondary manual links and editor-sheet proportions. Small mobile screens still scroll when disclosures are expanded or many activities are added. Native date/time widgets follow the browser/OS locale. These are presentation limits, not new product decisions. Stop for visual acceptance; no further increment is implied.

The public preview keeps per-browser localStorage; there is no account or cross-browser synchronization. Do not enter real personal data.
