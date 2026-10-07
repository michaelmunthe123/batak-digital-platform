# Architecture

## Runtime

```text
Browser
  │
  ▼
Next.js 16 App Router
  ├─ public Server Components
  ├─ editorial Server Actions
  ├─ local pilot fallback
  │
  ▼
Supabase
  ├─ PostgreSQL
  ├─ Auth
  └─ Storage (schema-ready; media UI deferred)
```

## Public data strategy

The repository has a pilot-data fallback so the application can render before a Supabase project
exists. Once environment variables are configured, repository functions can query published rows.

This fallback is intentionally small and clearly labeled as pilot content.

## Domain separation

Do not collapse:
- CulturalGroup
- LanguageVariety
- Region
- Clan
- ClassificationScheme

Relationships are data, not hard-coded ontology assumptions.

## Provenance

`entities` contain identity and editorial state.
`claims` contain statements.
`claim_sources` records evidence.
`relationships` represent structured connections.
`relationship_sources` records evidence for the connection.

This allows conflicting or regional variants to coexist.

## Phase 3 extension — three relationship domains

Phase 3 separates three graph-like domains rather than collapsing them:

- **Knowledge graph:** `relationships` between cultural entities.
- **Genealogy graph:** `genealogy_datasets`, `genealogy_nodes`, `genealogy_edges` for a particular lineage dataset.
- **Kinship rules:** `kinship_rules` that map explicit culturally contextual relationships/roles to documented terms.

This separation prevents a cultural association from being accidentally interpreted as blood descent.
