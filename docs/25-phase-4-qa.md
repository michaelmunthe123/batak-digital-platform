# Phase 4 QA

## Final source-level verification

Verified in the delivery environment:

- Phase 1 verifier: PASS.
- Phase 2 verifier: PASS.
- Phase 3 verifier: PASS.
- Phase 4 verifier: PASS (30 required deliverables).
- TypeScript/TSX syntax transpilation: PASS.
- Stub-assisted strict TypeScript check: PASS.
- Internal `@/` import resolution: PASS.
- JSON configuration parsing: PASS.
- TOML configuration parsing: PASS.
- YAML workflow parsing: PASS.
- Phase 4 RLS coverage: PASS.
- `security_invoker` moderation view guard: PASS.
- `security definer` + explicit `search_path` guard: PASS.
- Secret-value hygiene scan: PASS.
- Community workflow assertions: PASS.

## Commands to run with installed dependencies

The delivery environment could not reach the npm registry, so dependency-backed runtime gates must still be executed in a networked development environment:

```bash
npm install
npm run verify:phase1
npm run verify:phase2
npm run verify:phase3
npm run verify:phase4
npm run lint
npm run typecheck
npm run test
npm run build
npm run test:e2e
```

Do not mark a deployment production-ready until the dependency-backed commands above pass against the actual package versions in `package.json`.

## Required database integration tests

With a local/remote Supabase project:

1. Contributor A cannot read or edit Contributor B's proposals.
2. Contributor cannot update contribution status directly.
3. Contributor can submit through the transition RPC.
4. Sensitive proposals without evidence are rejected on submit.
5. Reviewer cannot mark a contribution merged.
6. Editor/admin can mark an accepted/in-review contribution merged.
7. Suspension removes contributor mutation access.
8. Public contributor profile never leaks email or admin notes.
9. Contributor cannot read another user's notifications.
10. Report update is editorial-only.
11. Re-inviting an already-active contributor does not downgrade the membership to `invited`.
12. A suspended contributor cannot regain write access merely by re-authenticating.

## Invite test

- Admin invitation runs only with `SUPABASE_SECRET_KEY` (or legacy server-role fallback).
- Invite email uses the SSR TokenHash confirmation route.
- Invite confirmation creates a cookie session.
- `/account/welcome` sets password and activates membership.
- Repeated invitation preserves an already-active membership.

## Cultural / governance QA

- No proposal is portrayed as verified before moderation.
- Community popularity is never converted into claim truth.
- Genealogy proposals keep evidence requirements and disputed-state support.
- Public contributor score includes a disclaimer that it is not cultural authority.
- Contribution guidelines explicitly cover evidence, source variation, living-person privacy, copyright, and respectful community conduct.
