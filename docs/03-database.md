# Database Model v1

## Core tables

- `entities`
- `entity_aliases`
- subtype tables: `cultural_groups`, `clans`, `regions`, `traditions`,
  `kinship_systems`, `kinship_terms`, `language_varieties`
- `sources`
- `claims`
- `claim_sources`
- `relationships`
- `relationship_sources`
- `classification_schemes`
- `classification_memberships`
- `content_sections`
- `media_assets`
- `revisions`
- `profiles`

## Editorial statuses

Content:
`draft → in_review → published → archived`

Claims:
`draft | supported | verified | regional_variation | disputed | community_sourced`

## Source levels

- A — academic / primary
- B — institutional
- C — expert / oral history with metadata
- D — community source / discovery lead

## Search

Migration enables:
- PostgreSQL full-text index
- `pg_trgm`
- RPC `search_knowledge(search_query text)`

Only published entities are returned to public clients through RLS.

## Future-safe choices

Neo4j is intentionally not required. Relationship edges live in PostgreSQL until graph complexity
demonstrates a real need for a dedicated graph database.

---

# Phase 2 additions

Phase 2 keeps `entities` as the shared knowledge identity layer and adds structured presentation/evidence tables instead of overloading entity records.

## Direct entity provenance

- `entity_sources` — allows an entity/profile itself to cite a source independently from individual claims.

## Cultural map

- `map_locations` — representative location records linked to an entity.
- `map_location_sources` — evidence/provenance for a map point.

A map point may describe a place associated with an entity. It must not be interpreted as a cultural boundary polygon.

## Tradition timelines

- `tradition_timeline_steps` — ordered steps/segments documented for a tradition.
- `timeline_step_sources` — source links for each timeline step.

Steps carry context/variation text so a documented sequence is not silently generalized to every family, region, or community.

## Language/dictionary

- `dictionary_entries` — headword, meaning, usage/context and language-variety relation.
- `dictionary_entry_sources` — source links at entry level.

Dictionary records are intentionally source-level records; the platform does not infer that similarly spelled terms have the same meaning across varieties.

## Media rights

`media_assets` is extended with metadata including title, media type, external URL, creator, license URL, attribution text, rights status, usage note, and sort order. `storage_path` may be null so a record can remain metadata-only when reuse rights are unclear.

## Search v2

RPC `search_knowledge_v2` supports public filtering by:
- query text
- entity type(s)
- source-backed-only status

The public fallback search implements equivalent high-level behavior against pilot data.

## Completeness

`content_completeness` exposes structural editorial coverage for admin review. The score is a workflow signal based on items such as summary, sections, sources, relationships, media, and relevant interactive data. It is **not** a truth/confidence score for cultural claims.

## Phase 3 tables

- `genealogy_datasets`
- `genealogy_dataset_sources`
- `genealogy_nodes`
- `genealogy_node_sources`
- `genealogy_edges`
- `genealogy_edge_sources`
- `kinship_rules`
- `kinship_rule_sources`

Important database invariants:

- living genealogy nodes cannot have `privacy_level='public'`;
- a genealogy edge cannot connect nodes from another dataset;
- public recursive path search only traverses published/public nodes and non-draft/non-disputed edges.
