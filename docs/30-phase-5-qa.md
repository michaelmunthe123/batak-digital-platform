# Phase 5 QA Record

This file describes the intended final quality gate. The handoff records which checks were actually executable in the artifact-building environment.

## Static/cumulative gates

```bash
npm run verify:phase1
npm run verify:phase2
npm run verify:phase3
npm run verify:phase4
npm run verify:phase5
```

Phase 5 verifier checks, among other things:
- required AI routes/components/libs exist
- pgvector and hybrid-search migration objects exist
- public AI index does not include genealogy nodes/edges
- Responses API is used instead of deprecated Assistants patterns
- no `NEXT_PUBLIC_OPENAI_*` secret exists
- assistant retrieves context before generation
- AI editorial route has no direct cultural-table update path

## Dependency-backed gates

```bash
npm run lint
npm run typecheck
npm run test
npm run build
npm run test:e2e
```

## Live integration gates
After configuring Supabase/OpenAI:

```bash
npm run ai:index
npm run dev
```

Manual checks:
1. Ask a question with indexed evidence → answer cites visible sources.
2. Ask an unsupported genealogy question → no invented lineage; answer says evidence is insufficient.
3. Run semantic search → results appear without generated answer.
4. Generate a learning plan → each step lists source keys.
5. Log in as editor/reviewer → `/admin/ai` works.
6. AI editorial review does not mutate publication state.
7. OpenAI key is absent from browser source/network payloads.


## Artifact build result

Checks actually executed before final packaging:

- `npm run verify:all` — PASS (Phase 1–5)
- TS/TSX syntax transpilation — PASS (129 files)
- stub-assisted strict TypeScript check for Phase 5 — PASS
- Node syntax check for verification/index scripts — PASS
- internal alias import resolution — PASS
- JSON/TOML/YAML configuration parsing — PASS
- server-secret/client-boundary scan — PASS
- credential-like value scan — PASS
- Phase 5 migration/RLS/security-invoker/security-definer guards — PASS
- genealogy node/edge exclusion from public AI index — PASS
- Responses/Embeddings/Moderation implementation check — PASS

The build environment could not reach the npm registry, therefore the following dependency-backed checks remain mandatory on the target laptop: `npm install`, `npm run lint`, `npm run typecheck`, `npm run test`, `npm run build`, and `npm run test:e2e`.
