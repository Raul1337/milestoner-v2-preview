# Milestoner Web preview workflow

This repository is the public, synthetic-data Web prototype. It does not authorize changes to iOS, backend, authentication, Supabase or production Sync.

- Read README.md, HOME_UX_BASELINE.md and VALIDATION.md before implementation. Inspect branch, status and diff; preserve unrelated work.
- Mandatory owner workflow: implement, validate, inspect source/bundle and public diff, commit and normally push to this preview repository, then verify the exact GitHub Actions run and live Pages deployment. Owner review must have a public navigable preview, plus current review screenshots when appropriate; localhost-only delivery is insufficient. Keep unaccepted candidates marked PENDING OWNER REVIEW. Publication is not UX acceptance or production authorization.
- Never publish broken/unvalidated code, secrets, real personal/medical data, private source, purchased documents, internal filesystem paths or debug artifacts.
- Run appropriate focused checks during development. Before every preview publication, run the full Web test suite and all builds described in VALIDATION.md on the final implementation. Resolve blockers first; never hide failures.
- Use literal staging paths or a reviewed path manifest. No broad staging, force pushes or unrelated changes.
- Public preview is the review artifact. Deliver 3–5 concise change lines, public URL, commit link, tests/build result and remaining blocker/decision.
- Diagnostics belong in ignored .work/ or temporary directories. No permanent screenshot matrices, duplicate reports, validation JSON archives or copies of source already in Git. CI and Git history provide the audit trail.
- If a visual comparison is needed, maintain only the current lightweight /review/ content. Prefer stable deterministic demo URLs. Extra evidence requires an explicit request.
- Maintain concise living documentation. Do not delete historical evidence, repositories, canonical documents or user files without inventory and explicit authorization.
