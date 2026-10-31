# Compact creation browser regression

Run against the production build with synthetic data only. Automated state invariants are covered separately by `draft-actions.test.js` and the existing creation/model tests. This checklist records browser interaction coverage, not an automated browser suite bundled with npm test.

| Case | Reproducible interaction and expected result | V2.3A.1 |
| --- | --- | --- |
| Contextual edit | Japan → skip unknowns → edit project name → Cancel. Original summary remains; focus returns to edit. Reopen, Save; only reviewed details change. | PASS |
| Draft preservation | Edit one activity; other activity, itinerary, budget and idea text remain unchanged. | PASS |
| Add/remove/date association | Date passport Nov 2; add a rail activity Oct 30; remove the middle row. Passport stays Nov 2, rail stays Oct 30. | PASS |
| Optional scheduling | Empty dates remain unscheduled; only an explicitly Oct 30 dated task enters the expanded demo Today list. Project date does not schedule tasks. | PASS |
| Skip details | Japan/French → Skip unknown details → proposal. No fabricated date/budget/reason. | PASS |
| Cancel without saving | Discard project or cancel dentist, reload. Composer returns; no creation confirmation or new saved content. | PASS |
| Confirmation/reload | Confirm project; reload its route. Summary and activity dates survive. | PASS |
| Revisit/edit | Edit confirmed name/activity; save, reload and reopen. Changes persist; prior IDs/status remain. | PASS |
| Itinerary/calendar | Expand each disclosure; edit/save. Summary changes, calendar ideas remain explicitly unscheduled. | PASS |
| B1 | Include → edit descriptive text → remove → include. No percentage/evaluator is created. Confirm/reload retains description. | PASS |
| Dentist | Cancel once, reopen and confirm with empty time. Only reminder is created. Edit/reload/reopen retains blank time. | PASS |
| Manual | Secondary manual entry → name/category editor → add activity → confirm. Existing manual creation remains available. | PASS |
| Keyboard/editor | Tab/Shift+Tab wrap; Escape closes and restores trigger. Save/Cancel controls remain keyboard reachable. | PASS |
| Navigation | Desktop expand/collapse reloads preference; main area adapts. All main routes render. Mobile Escape restores menu focus; selecting Miles closes drawer; direct header shortcut remains. | PASS |
| Responsive/language/appearance | Three scenario reviews at 390/1440 × EN/ES × Light/Dark; no horizontal overflow. Light uses local-only existing-token harness. | PASS |
| Isolation | Theme Playground still opens the French review pose without enabling a global theme or accessing the application store. | PASS |

Physical-device keyboard, VoiceOver and OS appearance-switching certification are not part of this browser pass. Reduced-motion/increased-contrast/forced-colors fallbacks were reviewed in CSS; the existing token contrast tests pass.
