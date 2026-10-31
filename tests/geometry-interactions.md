# Stable Miles geometry regression

Use synthetic local demo data. Record border-box width/height, header/footer bounds, viewport, expansion state, active dialog count, overflow and visible footer buttons at each stage.

| Case | Expected / observed | Result |
| --- | --- | --- |
| Seven ordinary stages | Composer → clarification → Japan → editor → French → dentist → discard. Same height and width within one session. | PASS |
| Mobile standard | 390×844, all seven: 390×658.3125; footer 104; primary button bottom y831. | PASS |
| Desktop standard | 1440×1000, all seven: 660×680; footer 104. | PASS |
| EN/ES and Light/Dark | Eight standard runs, seven stages each. Height delta 0. | PASS |
| Explicit expansion | Tap Expand once; all seven stay 844. Restore returns 658.3125. A new session starts at 78%. | PASS |
| Short mobile | 390×430, all seven stay 335.3984 with internal scrolling. | PASS |
| Short desktop | 1440×520, all seven stay 488. | PASS |
| Keyboard/orientation | Focused draft remains intact; expanded 430 on short viewport, 358 in 844×390 desktop layout, back to 844 portrait. Standard restores 658.3125. | PASS (simulation) |
| Very short discard | 390×300: 280 px; title starts inside the scroll area and actions remain visible. | PASS |
| Reduced motion | Existing fallback declarations forced in local replay; animation none; seven heights unchanged. | PASS (harness) |
| Footer forms | Composer and clarification submit correctly; editors save/cancel, Enter submits associated form, dentist retains blank optional time. | PASS |
| Creation/persistence | Japan dates stay Nov 2 / Oct 30 after add/remove; confirm/reload/reopen; French B1 remains descriptive, ideas unscheduled; reminder creates no project. | PASS |
| Protected editing | Keep retains pending text; discard/cancel creates no record; editor return focus preserved. | PASS |
| History/focus | Dirty Back/Keep preserves text and input focus; Forward reopens a fresh 78% session; Tab/Shift+Tab wrap with a visible outline. | PASS |
| Theme Playground | Sources/config unchanged; French 760.5/editor 574 before and after; no stable geometry or expansion control. | PASS |
| Physical device | Real mobile IME/notch/browser chrome and native dirty-reload prompt. | NOT VERIFIED |

47 automated tests and both builds pass. Static/token checks remain distinct from browser and physical-device checks. No data or persistence contract changes.
