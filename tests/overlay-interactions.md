# Miles overlay browser regression

Use synthetic local demo data. The automated history cases live in `miles-navigation.test.js`; existing creation/edit/persistence tests remain unchanged.

| Case | Expected / observed | Result |
| --- | --- | --- |
| Home entry | M+ opens over Home; Today expansion and Learning filter survive close; both sidebar and Home CTA restore their own trigger focus. | PASS |
| Discover entry | Search French → Explore with Miles; review opens over Discover. Discard restores query and trigger focus. | PASS |
| Project entry | Insights → Talk with Miles; close preserves Insights and trigger. | PASS |
| Scroll/background | Open at 166.5 px: fixed body top -166.5 px; close restores 166.5 px. Native modal makes background inert. | PASS |
| Mobile drawer | Select Miles; drawer closes before the overlay opens. Exactly one native dialog. | PASS |
| Keyboard | Tab/Shift+Tab wrap; Escape closes clean overlay; close returns to trigger. | PASS |
| Dirty exit/Back | Edited field → close/Back → in-place discard view. Keep retains text; discard closes or returns to summary as requested. | PASS |
| Editor return | Calendar disclosure remains expanded after Save; focus returns to Edit calendar ideas. No nested native dialog. | PASS |
| Japan | Edit task date Nov 2; add rail activity Oct 30; remove middle row; reviewed associations remain correct after confirm/reload. | PASS |
| French | Include B1 and edit calendar text. Confirm/reload: descriptive B1, no overall target, tasks remain unscheduled. | PASS |
| Dentist | Short review, Oct 31 from fixed demo clock, blank time. Confirm closes over Home with View reminder; no new project or auto-opened dialog. | PASS |
| Manual | Enter title; dirty close/Keep preserves it; discard adds no record. Recreate manually with activity; explicit confirmation adds one record. | PASS |
| Post-confirmation | Underlying route remains coherent; Open project/View reminder explicitly opens saved content. Existing editing/reload survives. | PASS |
| Double confirmation | Double-click French confirmation adds one project only. | PASS |
| Bookmark/refresh | Direct #miles opens over Home; clean refresh reuses history; close focuses main and returns #home. | PASS |
| Dirty native reload | Tool timed out; no inspectable native prompt. Draft remained and was explicitly discarded. Handler present; native browser UI not certified. | NOT VERIFIED |
| Mobile keyboard space | 390×430, focused preferences, scrollable editor and reachable Save; one dialog stays within available viewport. | PASS (simulation) |
| Physical virtual keyboard | Safari/Chrome on a phone, including IME/date widgets and keyboard dismissal. | NOT VERIFIED |
| Visual matrix | Five overlay poses × EN/ES × Light/Dark × 390/1440; no horizontal overflow or stacked dialogs. Light uses existing-token local harness. | PASS |
| Accessibility fallbacks | Reduced-motion, reduced-transparency, increased-contrast and forced-color CSS reviewed; semantic token contrast suite passes. | PASS (static/token) |

The source keeps all demo/domain/persistence contracts. No real notification, booking, enrollment, integration or AI is involved. Owner visual acceptance remains pending.
