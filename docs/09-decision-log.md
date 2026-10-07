# Decision Log

## DEC-001
Primary product is a responsive web application.

## DEC-002
Knowledge base before AI.

## DEC-003
PostgreSQL is the source of truth.

## DEC-004
No single cultural classification is encoded as absolute truth.

## DEC-005
Cultural Group and Language Variety are separate entities.

## DEC-006
Important claims can carry independent provenance.

## DEC-007
Structured relationships are source-aware.

## DEC-008
Personal genealogy is out of MVP.

## DEC-009
Public accounts/community contribution are out of MVP.

## DEC-010
Tarombo and partuturan tools wait until data/model validation.

## DEC-011
Next.js 16 App Router + TypeScript.

## DEC-012
Supabase/PostgreSQL for data, auth, and future storage.

## DEC-013
Vercel is the initial app host.

## DEC-014
PostgreSQL search first; dedicated search engine only if proven necessary.

## DEC-015
Six pilot navigation groups are not the final ontology.

## DEC-016
Public pages have an explicit pilot fallback so frontend work is not blocked by credentials.

## DEC-017
Unsupported genealogical details remain blank instead of being filled from unsourced internet claims.

## DEC-018
Phase 2 cultural maps use representative, source-aware points. The project does not infer ethnic/cultural boundaries from those points.

## DEC-019
Adat/tradition timelines are source- and context-aware. A documented sequence must not be presented as a universal ritual instruction when regional/family variation may exist.

## DEC-020
Dictionary entries are modeled separately from Cultural Group entities and are attached to a Language Variety plus provenance.

## DEC-021
Media assets use a rights-first model. Metadata-only records are preferable to displaying media whose reuse permission is unclear.

## DEC-022
Public search remains PostgreSQL-first in Phase 2 and adds type/source filters before evaluating a dedicated external search engine.

## DEC-023
Content completeness is an editorial structure metric, not a quantitative confidence or cultural-truth score.

## DEC-024
Phase 2 does not introduce tarombo visualization, automated kinship/partuturan inference, public contribution, or AI. Those require later validation and ADRs.

## DEC-025
Phase 4 community access starts as an invitation-based pilot instead of open registration, because moderation capacity and evidence quality must be validated before scaling.

## DEC-026
Contributors create proposals only. Published knowledge tables remain writable only through editorial roles/workflows.

## DEC-027
Community membership is modeled separately from editorial roles; contributor access does not imply reviewer/editor privileges.

## DEC-028
Correction, relationship, genealogy, and language proposals require at least one evidence source before submission.

## DEC-029
Moderation workflow is draft → submitted → review with explicit needs-evidence, accepted, merged, rejected, disputed, and withdrawn states. Only editor/admin can mark merged.

## DEC-030
Accepted/merged community proposals create revision snapshots and every status change creates an audit event.

## DEC-031
Contributor profiles are opt-in public and must never expose email or internal moderation/access notes.

## DEC-032
Contributor editorial score is an activity metric only. It is not cultural authority and is not used to resolve disputes or rank truth claims.

## DEC-033
Anonymous content reports are deferred until production-grade abuse protection/rate limiting exists. Phase 4 reports require an active invited contributor account.

## DEC-034
Supabase Auth Admin invitations use a server-only secret key. The key is never exposed through `NEXT_PUBLIC_*` variables.

## DEC-035
Phase 4 does not add AI, LLM answers, or automatic genealogy inference. Those remain Phase 5 concerns.

## Phase 5 decisions

**DEC-041 — AI is retrieval-first, not knowledge-first.**  
Responses are generated only after source-backed database retrieval.

**DEC-042 — Use Responses API, not Assistants API.**  
Phase 5 uses the current Responses API for structured generation.

**DEC-043 — Hybrid search uses PostgreSQL FTS + pgvector.**  
Keyword precision and semantic similarity are combined using reciprocal-rank fusion.

**DEC-044 — Genealogy graph data is excluded from the public AI index.**  
Deterministic Phase 3 tools remain the preferred genealogy surface.

**DEC-045 — Raw prompt storage is off by default.**  
Operational logs store hashes/metadata unless an operator deliberately enables prompt retention.

**DEC-046 — AI cannot publish.**  
Editorial AI review is advisory; publication state remains controlled by human editorial workflows.

**DEC-047 — Embeddings use 512 dimensions for the current schema.**  
Changing embedding dimensions requires a schema migration and full re-index.
