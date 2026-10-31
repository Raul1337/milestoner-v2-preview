# Vision V2.3A.3 — Stable modal and sheet geometry

The owner standardizes the accepted V2.3A.2 Miles experience using the Balanced78 interaction principle. This is a Web presentation change only; native iOS remains unchanged. Visual approval is pending.

## Geometry

The main app uses one fixed surface through composer, clarification, proposal, inline editing, reminder review and discard protection. Content never participates in its height calculation.

- Mobile: 78% of the usable visual viewport, bottom anchored. The header expansion button explicitly switches to full available height and can restore 78%. The choice lasts only for the current open session. Stages do not expand it automatically.
- Desktop: 660 px target width and 680 px height, capped by the visual viewport with 16 px vertical margins. Narrow windows retain the existing responsive width limit.
- Viewport/orientation/keyboard changes can recalculate geometry. Mobile usable height excludes the top safe inset; the footer includes the bottom safe inset. Very short mobile viewports may use up to a 280 px minimum target, capped by available space, to preserve usable header/actions.
- Header and footer remain fixed. Every Miles form uses its native form association to submit from the same footer. The 104 px footer (plus mobile bottom safe inset) reserves space across stages. Central content scrolls independently. The initial composer uses the available writing area without filler content.
- Only the existing short opacity/translation entry animation remains. There is no height transition between stages. Motion/transparency/contrast fallbacks and the backdrop are preserved.

## Actual rendered measurements

Border-box CSS pixels, EN/Dark. Every row is measured in the same open session for its run. Browser subpixel quantization explains 658.3125 vs the policy value 658.32.

| Stage | Before mobile 390×844 | After mobile 390×844 | Before desktop 1440×1000 | After desktop 1440×1000 |
| --- | ---: | ---: | ---: | ---: |
| Composer | 473.27 | 658.31 | 481.74 | 680.00 |
| Clarification | 489.00 | 658.31 | 482.00 | 680.00 |
| Japan proposal | 740.50 | 658.31 | 745.80 | 680.00 |
| Inline editor | 618.00 | 658.31 | 628.00 | 680.00 |
| French proposal | 760.50 | 658.31 | 765.80 | 680.00 |
| Dentist confirmation | 414.20 | 658.31 | 424.20 | 680.00 |
| Discard protection | 258.83 | 658.31 | 246.43 | 680.00 |

After: mobile width 390 px, desktop width 660 px; ordinary-stage height delta **0 px**. The same results hold across EN/ES and Light/Dark. Footer height is 104 px in every pose; mobile primary button bottoms stay at y=831 px in the standard run.

Explicitly expanded mobile stays at 844 px across all seven stages. At 390×430, all seven stages stay at 335.3984 px. At 1440×520, all seven stay at 488 px. Reduced-motion replay uses 658.3125/680 px with animation `none`. Expansion survives a focused-field keyboard-size reduction and landscape/portrait changes; returning from the viewport exception restores the selected geometry. A very short 390×300 discard view uses 280 px with scrollable text and visible actions.

## Functional preservation

All 41 existing tests remain unchanged. Six viewport-policy tests are added: standard/expanded mobile, desktop cap, keyboard-size restoration, short viewports and invalid measurements. Full suite: **47/47 PASS**, zero failed/skipped. Both builds pass.

Browser regression covers natural-language submission, optional clarification, inline footer Save/Cancel, task add/remove/date association, explicit confirmation/reload/reopen, descriptive B1, unscheduled ideas, manual creation, Enter submit, confirmed editing, protected discard, Back/Forward, session reset, Tab containment and visible focus. Existing demo records, key/version and domain calculations are unchanged.

## Theme Playground and native preservation

No Theme Playground source/configuration is edited. The stable geometry is opt-in only for the main app base URL. Shared form actions keep their existing inline presentation in the isolated build. Its French scene measures 760.5 px before/after, and its editor 574 px before/after at 390×844; no expansion control or stable-geometry attribute appears there. Existing category tokens, brand assets and dependencies are unchanged.

No iOS, database, authentication, backend, Sync, AI or external actions are involved. Source/assets/bundles are inspected before publication, and native preservation is checked separately.

## Validation limits and review

Light and reduced-motion results use local-only harnesses replaying existing token/fallback declarations. Dark is observed in the browser. A reduced available viewport with a focused field simulates the keyboard; real iOS/Android IME, notched safe areas and browser chrome movement still require device review. The pre-existing native dirty-reload prompt remains unverified in this browser environment; its handler is unchanged. No new device, OS preference-switching or spoken screen-reader certification is claimed.

See [interaction cases](tests/geometry-interactions.md) and the delivered raw measurements/screenshots. Stop for owner visual approval. Synthetic public preview only; existing per-browser localStorage remains unsynchronized.
