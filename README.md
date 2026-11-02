# Milestoner Vision V2 — Web preview

[Public preview](https://raul1337.github.io/milestoner-v2-preview/#home) · [Accepted Home UX](HOME_UX_BASELINE.md) · [Validation](VALIDATION.md)

React/Vite prototype with synthetic examples only. The demo day is 30 October 2026. It has no real AI, backend, authentication, payments, bookings, calendar access or notifications. This independent public repository does not modify the native iOS app or production services.

## Run and validate

Use Node 24 (same as CI), then:

```sh
npm ci
npm test
npm run build
npm run build:lab
npm run build:playground
npm run dev -- --port 4173
```

Open `/milestoner-v2-preview/#home`. `npm run preview` serves the production build locally. Pages uses the base `/milestoner-v2-preview/` and hash navigation.

## Current experience

- Centered Home, collapsible Today and Your Life, compact desktop project grid and mobile project list, mobile Projects/Reminders switch, category filter and chronological independent reminders. Desktop shows Projects and a separate independently collapsible Reminders section below Your Life.
- Desktop contextual Miles Insight; mobile bell and anchored popover. Opening or any passive close keeps the suggestion pending. Only explicit Dismiss or contextual Review consumes it.
- Separate M+ creation overlay: scripted Japan, French and dentist flows, editable proposals, manual creation, explicit confirmation and protected discard. Stable Balanced78 mobile geometry and centered desktop modal.
- Original and Miles-created projects share a centered Project Details shell with Overview/Insights/Settings, compact activity editors, contextual planning/scheduling and project-specific records. Reminders remain independent; unscheduled ideas do not appear in Today. Calendar choices are local simulations.
- EN/ES, system Light/Dark, original brand artwork, domain colors, expandable desktop sidebar and mobile drawer.

Stable review links: [`?lang=es&appearance=dark#home`](https://raul1337.github.io/milestoner-v2-preview/?lang=es&appearance=dark#home), [`?lang=en&appearance=light#home`](https://raul1337.github.io/milestoner-v2-preview/?lang=en&appearance=light#home), and [`?lang=es&type=reminders#home`](https://raul1337.github.io/milestoner-v2-preview/?lang=es&type=reminders#home). `appearance` is optional; without it the app follows the system. `collapsed=1` can initialize the Your Life disclosure for review; it does not persist a new preference.

The isolated [Theme Playground](https://raul1337.github.io/milestoner-v2-preview/theme-playground/) remains a separate visual exploration with temporary examples. It does not replace the active palette or use the app storage. The local `build:lab` contains display-test controls; the public build excludes those controls.

## Project Details V2.3B.1

Japan retains its illustrative itinerary, budget and preparatory activities; French separates learning activities, session records and optional descriptive B1; running shows best recorded distance; finance shows recorded contributions and its savings target. Task completion never adds progress. No universal completion percentage is used.

Legacy and Miles-created records keep their existing shapes and keys; there is no migration. Activity edits retain IDs, completion and date associations. Existing legacy Today behavior is preserved; dated Miles activities still follow their explicit dates. Calendar ideas remain suggestions until a separate event is explicitly reviewed and confirmed in the simulation. Quick editors use the existing accessible dialog; deeper review stays on the project screen. Creation PlanSummary and the Theme Playground remain isolated.

Metrics are shown only for compatible stored units. Generic Miles plans keep generic entries; no new numeric-goal contract is introduced. Legacy French shows B1 as an optional descriptive suggestion; Miles plans can edit their existing descriptive milestone field without relabeling legacy records.

V2.3B functionality is accepted. The V2.3B.1 hierarchy puts the next preparatory/learning action first for travel/language, and recorded distance/savings first for fitness/finance. The next-step button focuses its existing activity; Insights interprets the latest eligible record without repeating the action or metric card. Empty schedules use a small explicit scheduling action; unscheduled ideas remain separate disclosures. Project configuration is available in Settings; contextual activity/budget/idea editing remains in Overview. V2.3B.1 is the provisionally accepted Project Details baseline. Home UX remains provisionally accepted.

## Today and Reminders V2.3C

Today retains its existing counts, legacy tasks, explicitly dated Miles activities and confirmed events. The saved Reminders collection includes future dates, uses the existing chronological ordering, and opens the same detail/edit flow from either view. Optional hours remain empty; no duplicate entities or future recurring occurrences are created. Existing recurrence labels are preserved verbatim in storage and localized for display.

Recurrence remains a label, not a scheduler or history. A future recurrence design needs owner decisions on which occurrence completion affects, how subsequent dates are generated, and how edits apply to one occurrence versus the series. None is inferred in this increment. V2.3C is the provisionally accepted Today/Reminders baseline.

## Agenda V2.3D

[Agenda](https://raul1337.github.io/milestoner-v2-preview/#agenda/2026-10-30) opens contextually from Today and Project Details, with a compact week selector, date jump and optional project context. It adds no primary navigation destination. Date/context live in the hash so reload and Back/Forward retain the selection; M+ returns to that context.

Agenda is a projection of explicitly dated activities, saved reminders and confirmed demo events, using original IDs. Unscheduled ideas/itineraries stay out. Legacy Today still selects the first legacy task without assigning it a date: it can need attention in Today while remaining undated in Agenda. Completion never creates progress. Project-filtered Agenda excludes independent reminders; All includes them. Existing recurrence labels do not generate occurrences.

New events start without an assumed date, hour, location or destination. Title/date/project/simulated destination are explicitly reviewed; hour and location may remain blank. Review is not a save. Confirmation creates once or edits the existing ID; a duplicate project/title/date/hour produces an explicit explanation and keeps the draft available. Cancel/discard does not persist; returning from discard preserves typed fields. Existing saved event values and unknown metadata remain compatible. Apple/Google labels are unconnected simulations; nothing is delivered externally.

V2.3D Agenda is provisionally accepted, including its date selection and project context filter. Events retain the existing project association contract; standalone calendar events, real providers, recurrence, time zones and all-day event semantics require separate decisions. An empty time currently means only that no hour is stored.

## Progress V2.4

Overall Progress counts eligible records, projects with activity and days with entries; it never adds incompatible units. Distribution and frequency bars use record counts, with visible text equivalents. Project views show selected-period values/history separately from clearly labeled lifetime metrics through the fixed demo day. Week remains 24–30 October, month 1–30 October and year 1 January–30 October 2026. Filters retain their existing page-session behavior.

Finance sums recorded contributions and shows lifetime savings, valid stored target and remaining amount. Fitness uses the maximum session distance; first-to-last change is described only when two different record dates exist. Learning sums recorded sessions and counts days with records, without claiming streaks or B1 proficiency. Travel shows preparations/history and links to its saved planning; no trip percentage. Generic Miles units have history and counts without invented totals/targets. No global completion percentage is used.

Progress and Project Details share eligible project entries and specialized metric calculations. Invalid calendar dates, non-positive/non-finite values, future records, private records, unknown-project/reminder records are excluded; Progress also excludes private projects. No stored record is rewritten, generated or migrated. Completed tasks and calendar events do not become progress. Insights are deterministic descriptions of these same records; Home Miles Insight logic is unchanged. V2.4 is the provisionally accepted Progress functional and UX baseline.

## Discover V2.5A

Discover has an independent fictional editorial catalog: eight bilingual ideas across the four supported domains. It does not reuse Home fixtures, infer interests, read history for recommendations, or add categories. Search combines localized copy/curated keywords with the category filter; cards reveal details and two possible starting actions.

Explore with Miles opens a deterministic manual template in the existing overlay. Every proposal stays editable and unsaved until explicit confirmation. No dates, budgets, targets, B1 levels, itinerary, events or bookings are assigned. Confirmation uses the accepted manual project shape; there is no new discovery provenance field or storage migration.

A saved project with a matching normalized title and category is identified on the idea card, with access to the existing project. The two curated language titles are recognized after reload; proposal edits also compare stored and displayed project titles. Matches are conservative title comparisons, not semantic duplicate detection. An existing match is disclosed in Miles and the confirmation explicitly says it will create another independent project. Renamed or semantically related projects are not inferred. Discovery-specific checks do not change the three scripted creation flows.

Pending owner UX acceptance: the catalog, editorial card presentation and explicit duplicate-aware proposal wording. Future personalization and stronger idea/project association require separate decisions; neither is implied here.

## You — Interest Universe V2.5B.1

You opens directly into an authored orbital composition, including mobile. Eight confirmed interests are shown in saved order; Expand Universe reveals the complete collection in ONE continuous orbital surface with ONE central avatar and normal page scrolling. No records are deleted or reordered. The large central fictional Alex Rivera portrait is an original inline SVG; Profile and General Settings retain their existing routes. Edit opens explicit management; Add Interests opens the existing confirmation form.

V2.5B.1a follows the supplied luminous visual reference: pastel translucent circular surfaces, bold names and large icons, dashed orbital paths, restrained decorative dots and two lower actions. Affinity remains in accessible labels and Interest Detail. V2.5B.1c uses four bounded explicit affinity diameter tiers (Love it, Like it, Curious, Not really). Mobile normal mode uses eight staggered orbital slots around a smaller central profile and a bounded stage; long names use a two-line preview with the full original name in the accessible label, tooltip and Interest Detail. They never enlarge every tier. Geometry reserves the largest tier independently of saved affinities, so edits do not move nodes. Desktop uses a wide ellipse in the available workspace (up to 1280px) and a blended ambient background; mobile retains a compact staggered portrait orbit. Expanded desktop uses arc-length spacing on one adaptive ellipse; expanded mobile uses one vertically explorable composition with a single central profile. No chunks of eight or cyclic slot reuse remain. ResizeObserver updates presentation geometry only. Suggestions remain separate and require explicit Add or Not really. No grid breakpoint, physics, auto-insertion or continuous motion is used.

V2.5B.1e — **OWNER APPROVED FOR WEB PREVIEW PUBLICATION** on 1 November 2026; accepted source candidate `c3bae01`. Mobile proportions, profile size, explicit affinity tiers, staggered slots, typography, Light appearance and final Dark surface contrast are approved. Containers below 450px retain a 104–122px profile and a normal canvas around 408–477px tall at 320–428px viewports. Single-word labels do not break mid-word; full names remain accessible and available in Interest Detail. Route-heading focus is retained without a mobile title outline; interactive keyboard focus remains visible. Dark surfaces use the existing semantic colors with restrained borders and profile ring definition. Desktop geometry and the unified expanded Universe remain unchanged. This acceptance applies only to the Web UX, not native implementation or production contracts.

The additive key `milestoner-vision-v2-interest-universe-v1` holds only current demo interests and suggestion decisions. Existing application keys/records are unchanged. Storage denial falls back to page memory. The existing application reset retains this isolated Universe; interests remain explicitly managed through Edit Universe. This is not native inference/history/Sync architecture.

Profile remains private by default with fictional identity and a labeled fictional since date, no sharing or publishing flow. The V2.5B.2a Profile Overview candidate reuses the exact illustrated Universe avatar, a compact four-column unavailable-statistics strip, honest Top Domains/Featured Badges states, and three eligible saved activity records. Activity rows reuse the existing Project Details navigation; Progress, Settings and Universe remain available. A separate illustrative Badges catalog is available in V2.5B.2c; earned awards and numeric profile metrics remain unavailable. Edit Profile is the separate V2.5B.2b candidate described below. Mobile follows the private approved reference; desktop adapts into identity and content columns. Dark uses existing semantic tokens. Status: **PENDING OWNER REVIEW**, based on published `0d608e4`. General Settings and the approved Universe geometry/behavior are unchanged. The private reference is excluded from repository assets and build outputs.

Native references were inspected read-only; no private source, full documents or native implementation were copied. The V2.5B.1e Web visual candidate is owner-approved for preview publication. This does not accept native implementation. No physics, continuous motion, zoom/pan engine, authentication or new primary navigation was added.

## Edit Profile V2.5B.2b — public review candidate

Status: **PENDING OWNER VISUAL AND FUNCTIONAL REVIEW**. `#you/profile/edit` is a dedicated editor; `#you/edit` remains Edit Universe. Name, optional local alias, optional bio and the selected original illustrated avatar are shared by Profile, the editor and the Universe. The node uses a one-line name preview with the complete name in its accessible label/title, preserving the approved geometry. The three reversible appearance choices change only background/clothing; they are distinct from M+ and use no photos, camera, AI or external services.

Web-demo choices, not approved native limits: trimmed name 1–50 UTF-16 characters; optional alias up to 24 ASCII letters/digits/underscore/dot/hyphen, starting with a letter/digit/underscore (one leading @ is accepted and removed); optional trimmed bio up to 160 UTF-16 characters. Alias is only a local label, without uniqueness or account claims. The default is Alex Rivera / alex.demo, empty optional bio, original portrait.

Only explicit Save writes `milestoner-vision-v2-profile-v1` (version 1). The existing application, interests and records are not migrated. Invalid/corrupt/unsupported profile storage falls back to the fictional default without writing. Failed writes apply the confirmed choice only in current-page memory and explicitly warn that reload may lose it; Save can be retried. Successful writes survive reload in this browser/origin only. No synchronization, authentication or public profile is created.

Cancel, quick links and browser history departures from a dirty editor require discard confirmation; keeping editing preserves the draft. M+ opens over the intact draft and returns to it. Reload/tab close uses the browser's standard before-unload protection while dirty; drafts are not durably stored. Profile values change everywhere only after Save. Privacy and Featured Badges remain informational; no public toggle, badge management or Delete Profile is implemented.

Reset Demo retains its existing application reset (`initial()` including activity, assistance mode and context). Its scope is unchanged; separate interests and the new separate profile preferences remain intact, explicitly disclosed in Settings/reset confirmation. Clearing or deleting profile personalization is not implemented. Native profile/avatar constraints were consulted read-only; this Web candidate does not define native persistence, photo consent or production reset behavior. The original visual reference remains private and is not a public asset.

## Badges V2.5B.2c — public review candidate

Status: **PENDING OWNER VISUAL AND FUNCTIONAL REVIEW**. [`#you/badges`](https://raul1337.github.io/milestoner-v2-preview/#you/badges) opens an explicitly illustrative eight-card collection, linked from Profile. It shares the saved illustrated avatar, name, optional alias and the existing unavailable-statistics strip. Two readable columns on mobile adapt to three on tablet and four on desktop, using existing semantic tokens, EN/ES and Light/Dark. The private three-screen mockup guided composition only; no original reference or extracted fragment is published.

All shows catalog examples; Featured (`#you/badges/featured`) shows an honest empty state, retained by hash navigation, reload and Miles return. Examples have names and conceptual descriptions, with no award conditions, dates, earned status, XP, levels, streaks or eligibility calculations. Profile and Edit Profile retain their unavailable earned/featured state. There is no selection, management, storage key, migration or badge-awarding engine. Native product documentation was consulted read-only; no native changes or private source were included.

Open product decisions: the meaning/classification of the proposed Milestones filter, future award conditions/provenance and the eligibility/limit/order of Featured selection. The unapproved filter is explained in the catalog disclosure rather than presented as a nonfunctional control. Counts describe illustrations only. Existing records never award badges. Badge art is a Web vector adaptation of the existing icon system, not the original mockup artwork. Review the current [public captures](https://raul1337.github.io/milestoner-v2-preview/review/) before acceptance.

## First-use onboarding V2.5C.1 — isolated public candidate

Status: **PENDING OWNER VISUAL AND FUNCTIONAL REVIEW**. [Open the interactive candidate](https://raul1337.github.io/milestoner-v2-preview/review/onboarding/?lang=es&appearance=light#welcome): Welcome → optional preferred name → interest selection → Universe reveal. The normal Home entry and every existing application experience remain unchanged. No provider login, account association, AI, project or milestone creation is implemented here.

The separate review entry reuses existing public branding, M+, semantic tokens, the illustrated portrait and `universe-layout.js`/`you.css` geometry. No private artwork/source is added. A missing or whitespace-only name displays Tú/You, never the saved fictional default identity. The optional name has the existing Web-demo 50-character limit; it is not a new native rule. This slice omits activity discovery.

The twelve authored interests start unselected. Choices are explicit and reversible, with no minimum. Every selected item starts as canonical `curious`, regardless of category or click order: an owner-authorized **Web onboarding candidate rule**, not a native affinity/inference contract. Catalog order gives a deterministic reveal; colors remain tied to existing authored interest roles. Zero choices show one central profile and an honest empty state. Normal mode shows up to eight; expansion shows all selections on one canvas with one avatar. Detail dialogs expose complete names where compact previews shorten them.

Only `sessionStorage` key `milestoner-vision-v2-onboarding-review-v1` holds the draft name, selections and last step. It never reads or writes saved application/Profile/Universe state. Hash history supports Next/Back/Forward; reload retains an available session draft. Finish opens a review conclusion and keeps that temporary draft; it does not complete onboarding in the main app. Reset and explicit Exit offer discard confirmation for entered data. Exit discards only this draft and returns to the normal app. Closing a confirmation or pressing Escape keeps it. Leaving through browser history does not itself discard the session draft.

Session storage follows browser tab/session rules and may be copied or restored by browser tab restoration. It is not durable storage or Sync. Denied writes fall back to page memory with a reload-loss warning. Failed clearing is disclosed; Exit anyway remains explicit if the browser cannot delete its own draft. No other keys are cleared. Use fictional names only.

Language and appearance controls are URL-scoped. Isolated accessibility review controls support 100/150/200% text and reduced motion without changing app preferences. Example: [`?lang=en&appearance=dark&text=200&motion=reduce#interests`](https://raul1337.github.io/milestoner-v2-preview/review/onboarding/?lang=en&appearance=dark&text=200&motion=reduce#interests). Direct Universe links show only the current tab draft, including an empty state in a fresh session. [Current review captures](https://raul1337.github.io/milestoner-v2-preview/review/) show representative viewports; scroll the live candidate for all controls/content.

V2.5C.2 remains separate: first confirmed milestone semantics, account invitation and continued local use. Publication of this candidate does not accept its visual/functional design or authorize native implementation.

## Storage and privacy

Each browser/origin has its own state; there is no synchronization. Existing keys remain compatible: `milestoner-vision-v2-demo-v1`, `milestoner-vision-v2-sidebar-expanded-v1`, and `milestoner-demo-insight-review-v1`. No migration or automatic revival of previously consumed suggestions. If storage is blocked the demo falls back to page memory.

Only enter fictional data. The private example hides its title on screen and in relevant accessible labels; it is not encryption or authentication. Private reminders are excluded from Progress.

## Default development and publication workflow

Owner decision, effective 31 October 2026: implement the requested increment, run appropriate checks and a fresh full Web regression/build, fix blockers, review the public diff and generated bundle, commit, normal push to this preview repository, then verify GitHub Actions and the live HTTPS preview. Validated preview increments are authorized without a separate publication question. Publishing does not mean final UX acceptance or permission to change production systems. Owner review requires a public navigable preview, with current public review captures when appropriate; localhost-only delivery is insufficient. Keep unaccepted candidates marked PENDING OWNER REVIEW.

CI runs the complete test suite and all three builds, then publishes only the application and isolated Theme Playground output. Git history and GitHub Actions are the technical audit trail. `AGENTS.md` gives the operational boundaries.

Diagnostics belong in ignored `.work/` or temporary directories. Do not commit screenshots, logs, validation JSON archives, generated debug artifacts or source copies. The live preview is the primary review artifact. When a comparison is necessary, keep only the current lightweight `/review/` content; prefer deterministic links. Do not create new permanent evidence packages by default. Existing historical files must not be deleted without inventory and authorization.

After publication report 3–5 concise change lines, preview URL, commit, test/build result and any remaining blocker/decision. Maintain this README, HOME_UX_BASELINE.md and VALIDATION.md as living documents. Existing version-specific design notes are historical context, not new requirements.
