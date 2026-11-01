# Accepted Home UX baseline

The owner accepted this Home UX and the anchored Miles Insight popover. Preview publication is authorized under the workflow in README.md; publication does not accept future UX changes or authorize production work.

## Presentation

- Home is centered in the available workspace, excluding the 72/224 px desktop sidebar, with a maximum content width of 1200 px.
- Hierarchy: compact heading, Today, optional desktop contextual insight, Your Life — Projects, then a separate Reminders section on desktop. No permanent Miles Brief. Mobile insight access is the separate notification bell.
- Today starts expanded; folding retains heading, date/subheading, count, Add and a distinct accessible chevron. Existing scheduling/completion/count rules remain unchanged. Its page-session folding resets on reload.
- Your Life has a global disclosure and category filtering for projects. At 901 px and above it shows Projects, followed by an independent compact chronological Reminders section with its own disclosure (expanded by default). At 900 px and below, retain Projects/Reminders tabs without a second permanent section. Disclosure states are page-session presentation state; one does not fold the other. Desktop projects use a responsive visual grid; mobile projects use one compact horizontal list. Cards open details directly. Reminders remain independent and chronological, with private titles masked in visible and accessible labels. The same saved reminder is used in Today and the collection; dates, optional times, pending/completed status and existing recurrence labels are displayed without generating occurrences.
- Desktop insight remains compact below Today. Mobile uses the approved compact bell-anchored popover with viewport bounds and internal scroll when necessary, no heavy backdrop and no Home layout shift. Its visual geometry and treatment are unchanged.
- M+ independently opens the existing creation overlay. Balanced78, explicit confirmation, protected discard, manual creation and the three scripted journeys are preserved.
- EN/ES, Light/Dark, original branding and provisional category colors remain. V2.2 Theme Playground stays isolated; no experimental backgrounds are activated globally.

## Pending suggestion behavior

Opening the bell only presents the suggestion. Bell toggle, outside click, Escape and close only dismiss the presentation; they do not consume it. The bell and pending dot remain available while pending, including after reload.

Only explicit Dismiss or contextual Review consumes an insight through the existing demo-local ledger. Review also opens its confirmed example Project. Back/Forward and reload do not revive consumed suggestions. Existing consumed entries, storage format and context-change fingerprints are retained without migration.

On Demand provides no proactive indicator. Balanced selects a grounded opportunity. Proactive may advance to another grounded opportunity only after explicit consumption or a relevant context change. At most one active insight is visible. This is a deterministic demo-local rule, not a production notification contract.

## Current boundaries

All data are synthetic and browser-local. No real AI, notifications, calendar APIs, authentication, backend, iOS, SQLite or production Sync changes. Physical-device and spoken-screen-reader certification remains outside the current Web evidence. Further background/theme changes remain separate owner decisions.
