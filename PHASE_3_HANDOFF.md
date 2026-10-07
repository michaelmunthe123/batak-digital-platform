# Phase 3 Handoff

Phase 3 adds source-aware genealogy and kinship to the Phase 2 codebase.

## Public routes

- `/tarombo`
- `/tarombo/demo-metodologi`
- `/partuturan`
- `/relations`

## Editorial routes

- `/admin/genealogy/new`
- `/admin/genealogy/nodes/new`
- `/admin/genealogy/edges/new`
- `/admin/kinship-rules/new`

## Database migration

Apply migrations in order, including:

`supabase/migrations/20261007170000_phase3_genealogy_kinship.sql`

Then run `supabase/seed.sql`.

## Non-negotiable rules

- Real genealogy is not inferred from marga names.
- Living persons cannot be public.
- Real genealogy edges must carry evidence during editorial creation.
- The included public tarombo is fictional/demo-only.
- Calculator output is limited to published rules.

## Verification

```bash
npm install
npm run verify:phase1
npm run verify:phase2
npm run verify:phase3
npm run lint
npm run typecheck
npm run test
npm run build
npm run test:e2e
```
