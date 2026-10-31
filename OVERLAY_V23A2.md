# Vision V2.3A.2 — Miles Overlay Experience

V2.3A.1 is the owner-accepted functional baseline. This web-only presentation remains provisional, awaiting owner visual approval.

## Result

M+ now opens one native web dialog over the current Home, Discover, Project Details, Progress or You screen. Desktop uses a centered 660 px surface with content-driven height. Mobile uses a bottom sheet that grows with longer content. A dimmed, subtly blurred backdrop keeps the underlying screen recognizable. Solid surfaces, semantic text and reduced-transparency/contrast fallbacks provide readability independently of blur.

Composer, optional clarification, proposal, project/activity editors and quick reminder review share that surface. CompactDialog reuses its native presentation for confirmed Project Details, and renders an inline editor inside Miles. There are no nested dialogs. Proposal confirmation stays in a separate footer outside the internal scroller, so it remains visible without covering rows. The original category tokens, artwork, typography and palette remain authoritative.

Japan, French, dentist and manual creation retain their accepted rules. B1 stays descriptive. Calendar ideas stay unscheduled; no events, alerts, enrollment or bookings are inferred. Activity/date associations, task IDs/status and existing data remain intact.

After confirmation, Miles closes over the same context. A concise, dismissible status offers Open project or View reminder. Only that explicit action opens the dedicated detail experience. Repeated confirmation clicks are ignored while closing.

## Context, history and safety

Opening Miles preserves route, active project tab, Home filters/Today expansion, Discover search and background scroll. The body is locked while the native modal prevents background interaction. Closing restores scroll and the originating control; a bookmark falls back to main content focus.

The existing #miles URL is preserved as an overlay entry. History state records only its background route, separately from demo data. Direct bookmarks have a Home fallback; refresh reuses the entry. Back closes a clean overlay or asks before discarding a pending draft; keeping it restores the Miles entry. Forward can reopen Miles. A refresh does not persist an unconfirmed draft.

Dirty close, Escape, backdrop, Back and destructive in-overlay changes use an in-place discard view. The underlying form remains mounted, so Keep editing preserves pending text. Inline editor cancellation safeguards edited fields. Returning to the proposal preserves expanded disclosures and their focus/scroll. A beforeunload handler also requests the browser's standard protection during reload/tab closure when dirty.

Focus is contained inside the active surface with Tab/Shift+Tab, visible focus, an accessible name and explicit dismissal. Reduced motion removes the short entry animation. VisualViewport resize/scroll adjusts available height/keyboard offset and keeps focused fields within the internal scroller. Safe areas are included.

## Preservation

No new dependency, data schema, localStorage key/version, backend, AI, authentication, calendar API, iOS or Sync change. creation-model.js, draft-actions.js and model.js remain byte-identical to the accepted baseline. Brand assets, category tokens and dependencies are unchanged. The Theme Playground stays isolated and its existing Miles scene uses the shared overlay; no new default atmosphere is applied.

## Validation

- Full automated suite: 41/41 PASS, zero failed/skipped. Eight new history regressions cover context, bookmarks, dirty Back/keep/discard, refresh-compatible entries, Forward, legacy links and explicit follow-up navigation.
- Both static builds PASS, including the isolated Theme Playground.
- Browser interactions: Japan, French, dentist and manual confirmation; contextual editing; add/remove/date association; skipping; cancelling without persistence; keep/discard guards; confirmation/reload/reopen; confirmed editing; and double-click protection. Home filters/Today, Discover search and project tabs survive entry/close. Exact scroll restoration was observed at 166.5 px. Drawer closes before Miles opens.
- Visual review: composer, Japan proposal/editor, French and dentist at 390×844 / 1440×1000 × EN/ES × Light/Dark. No horizontal overflow or stacked dialogs in the 40 overlay poses. Desktop initial height is about 482 px; mobile initial about 473 px; a simple dentist sheet about 414 px. Longer proposals expand then scroll internally.
- A focused field and Save were exercised at 390×430 available height: one dialog, internal scrolling, no offscreen modal. This simulates keyboard-constrained space; it is not a physical phone keyboard test.
- Light uses a local-only harness applying existing Light tokens; Dark uses the browser's actual appearance. No OS appearance-switching, physical IME or spoken screen-reader certification is claimed. Motion/transparency/forced-color CSS fallbacks were reviewed; existing contrast tests pass.
- Dirty reload inspection timed out in the browser tool and returned no inspectable JavaScript dialog. The draft remained visible and was explicitly discarded afterwards. The beforeunload handler is implemented, but native dirty-reload prompt behavior remains NOT VERIFIED in this environment. Clean #miles bookmark refresh and saved-record reload/reopen passed.
- Source/assets/bundles are inspected before publishing; native preservation is checked separately. See the delivery evidence for deployment/HTTPS results.

See [repeatable interaction cases](tests/overlay-interactions.md). These are web prototype checks, not iOS/backend regression or production certification.

## Owner review

Approve the modal/sheet proportions, integrated background treatment and continuous editing presentation. Confirm the native reload prompt and virtual keyboard on the intended browser/device. The discard view intentionally remains within Miles; no extra modal is introduced. No further increment or global theme selection is implied.

Public preview, synthetic data only. Each browser retains its own existing localStorage state; there is no synchronization.
