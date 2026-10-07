# Phase 5 Handoff — AI & Mature Platform

## Status
Phase 5 implementation is complete at source level and closes the original six-phase roadmap (Phase 0 through Phase 5).

## New product surfaces
- `/assistant` — source-grounded Cultural Assistant
- `/semantic-search` — inspectable hybrid retrieval
- `/learn` — personalized, source-grounded learning path
- `/about/ai` — public transparency and limitations
- `/admin/ai` — human-in-the-loop editorial AI review

## New server routes
- `POST /api/assistant`
- `POST /api/assistant/feedback`
- `POST /api/semantic-search`
- `POST /api/learning-plan`
- `POST /api/admin/ai-review`

## New data layer
Migration:

```text
supabase/migrations/20261007223000_phase5_ai_mature_platform.sql
```

Adds:
- pgvector
- `ai_documents`
- source-backed AI export view
- hybrid search RPC
- AI request audit table
- feedback table
- editorial AI review records
- privacy-preserving rate-limit window
- admin AI system-status view

## AI indexing

```bash
npm run ai:index
```

Index is derived, rebuildable, and excludes genealogy nodes/edges.

## OpenAI architecture
The implementation uses:
- Responses API for structured answer/review/learning generation
- Embeddings API for retrieval vectors
- Moderation endpoint for severe-risk checks

No Assistants API code is used.

## Critical safety properties
1. retrieval happens before answer generation;
2. only published + source-backed rows are indexable;
3. model citation keys dan citation labels di jawaban divalidasi terhadap retrieved documents;
4. AI is told to fail closed on insufficient evidence;
5. public genealogy graph data is not copied into the AI index;
6. raw public prompt logging is off by default;
7. AI editorial review cannot mutate knowledge publication state;
8. OpenAI and Supabase secrets remain server-only;
9. `AI_SAFETY_HASH_SALT` wajib ada sebelum AI dianggap configured.

## Local run
Use:

```text
RUN_IN_VSCODE_WINDOWS.md
```

It contains the complete Windows + VS Code setup, Supabase setup, OpenAI setup, indexing, test commands, and troubleshooting.

## Quality gate

```bash
npm run verify:all
npm run lint
npm run typecheck
npm run test
npm run build
npm run test:e2e
```

## Product roadmap status

```text
Phase 0 — Discovery & Foundations      COMPLETE
Phase 1 — MVP Foundation               COMPLETE
Phase 2 — Interactive Culture          COMPLETE
Phase 3 — Genealogy & Kinship          COMPLETE
Phase 4 — Community & Contribution     COMPLETE
Phase 5 — AI & Mature Platform         COMPLETE
```

The project should now move from roadmap construction into normal product work: real content acquisition, expert review, usability testing, observability, deployment hardening, and iterative releases.


## Artifact-build QA result
The final source was checked cumulatively with `npm run verify:all`; all Phase 1–5 verifiers passed. 129 TS/TSX files passed syntax transpilation, Phase 5 passed strict stub-assisted TypeScript checking, project configs and internal imports were validated, and Phase 5 migration/security guards passed.

The artifact environment could not reach the npm registry, so dependency-backed `npm install`, real Next.js build, Vitest, ESLint, and Playwright execution could not be completed here. Run the commands in `RUN_IN_VSCODE_WINDOWS.md` on the target laptop before deployment.
