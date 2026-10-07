# Phase 2 Handoff

## Status

**Phase 2 — Content Expansion & Interactive Culture implemented in source.**

The implementation extends the Phase 1 source-aware knowledge platform without crossing into Phase 3 genealogy/community/AI features.

## Required Phase 2 deliverables

1. **Cultural Map** — `/map`
   - representative points, not cultural-boundary polygons
   - cultural-group filtering and accessible point selection
   - repository + database provenance support

2. **Adat Timeline**
   - knowledge pages can render ordered, source-aware tradition steps
   - context/variation notes prevent a documented sequence from being presented as universal
   - pilot data includes the documented seven-day Merdang-Merdem/Kerja Tahun sequence from an institutional cultural source

3. **Dictionary / Language Foundation** — `/language`
   - language-variety browsing
   - word/meaning search
   - usage/context notes
   - source-aware entries with selected institutional dictionary examples

4. **Media Gallery** — `/gallery`
   - creator/license/attribution/rights metadata
   - supports cleared/licensed/public-domain/metadata-only/unknown states
   - unclear assets can remain metadata-only

5. **Improved Search / Filter** — `/search`
   - query + entity-type filtering
   - source-backed-only filtering
   - browse/filter behavior even with an empty query

6. **Content Completeness Dashboard** — `/admin/completeness`
   - editorial structural score and missing-field indicators
   - does not claim to measure historical/cultural truth

## Database work

Migration `20261007130000_phase2_interactive_culture.sql` adds:

- `entity_sources`
- `map_locations` + `map_location_sources`
- `tradition_timeline_steps` + `timeline_step_sources`
- `dictionary_entries` + `dictionary_entry_sources`
- rights metadata on `media_assets`
- `search_knowledge_v2`
- `content_completeness`
- RLS/policies needed for the new data

`supabase/seed.sql` contains Phase 2 pilot records for validating the workflow. Sensitive genealogy is intentionally not invented.

## Verification

```bash
npm install
npm run verify:phase1
npm run verify:phase2
npm run lint
npm run typecheck
npm run test
npm run build
npm run test:e2e
```

Apply the Supabase migrations and seed before checking live database-backed behavior.

## Environment limitation during generation

The build environment used to assemble this handoff could not complete `npm install` from the external registry. Structural verifiers and an internal TypeScript QA pass with temporary external-module stubs were therefore used, but a real dependency-aware `next build`, ESLint, Vitest, Playwright run, and live Supabase migration still need to be executed in a networked development environment.

## Next phase boundary

Phase 3 may evaluate source/version-aware genealogy, relationship exploration, validated partuturan logic, and carefully governed contributor workflows. None are implemented here.
