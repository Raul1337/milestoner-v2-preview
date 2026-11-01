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

- Centered Home, collapsible Today and Your Life, compact desktop project grid and mobile project list, Projects/Reminders switch, category filter and chronological independent reminders.
- Desktop contextual Miles Insight; mobile bell and anchored popover. Opening or any passive close keeps the suggestion pending. Only explicit Dismiss or contextual Review consumes it.
- Separate M+ creation overlay: scripted Japan, French and dentist flows, editable proposals, manual creation, explicit confirmation and protected discard. Stable Balanced78 mobile geometry and centered desktop modal.
- Four example projects retain Overview/Insights/Settings and project-specific Progress. Reminders remain independent; unscheduled ideas do not appear in Today. Calendar choices are local simulations.
- EN/ES, system Light/Dark, original brand artwork, domain colors, expandable desktop sidebar and mobile drawer.

Stable review links: [`?lang=es&appearance=dark#home`](https://raul1337.github.io/milestoner-v2-preview/?lang=es&appearance=dark#home), [`?lang=en&appearance=light#home`](https://raul1337.github.io/milestoner-v2-preview/?lang=en&appearance=light#home), and [`?lang=es&type=reminders#home`](https://raul1337.github.io/milestoner-v2-preview/?lang=es&type=reminders#home). `appearance` is optional; without it the app follows the system. `collapsed=1` can initialize the Your Life disclosure for review; it does not persist a new preference.

The isolated [Theme Playground](https://raul1337.github.io/milestoner-v2-preview/theme-playground/) remains a separate visual exploration with temporary examples. It does not replace the active palette or use the app storage. The local `build:lab` contains display-test controls; the public build excludes those controls.

## Storage and privacy

Each browser/origin has its own state; there is no synchronization. Existing keys remain compatible: `milestoner-vision-v2-demo-v1`, `milestoner-vision-v2-sidebar-expanded-v1`, and `milestoner-demo-insight-review-v1`. No migration or automatic revival of previously consumed suggestions. If storage is blocked the demo falls back to page memory.

Only enter fictional data. The private example hides its title on screen and in relevant accessible labels; it is not encryption or authentication. Private reminders are excluded from Progress.

## Default development and publication workflow

Owner decision, effective 31 October 2026: implement the requested increment, run appropriate checks and a fresh full Web regression/build, fix blockers, review the public diff and generated bundle, commit, normal push to this preview repository, then verify GitHub Actions and the live HTTPS preview. Validated preview increments are authorized without a separate publication question. Publishing does not mean final UX acceptance or permission to change production systems. An explicit local-only request overrides this default.

CI runs the complete test suite and all three builds, then publishes only the application and isolated Theme Playground output. Git history and GitHub Actions are the technical audit trail. `AGENTS.md` gives the operational boundaries.

Diagnostics belong in ignored `.work/` or temporary directories. Do not commit screenshots, logs, validation JSON archives, generated debug artifacts or source copies. The live preview is the primary review artifact. When a comparison is necessary, keep only the current lightweight `/review/` content; prefer deterministic links. Do not create new permanent evidence packages by default. Existing historical files must not be deleted without inventory and authorization.

After publication report 3–5 concise change lines, preview URL, commit, test/build result and any remaining blocker/decision. Maintain this README, HOME_UX_BASELINE.md and VALIDATION.md as living documents. Existing version-specific design notes are historical context, not new requirements.
