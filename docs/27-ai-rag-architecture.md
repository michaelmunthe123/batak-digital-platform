# Phase 5 — AI/RAG Architecture

## High-level flow

```text
User question
    ↓
Input validation + rate limit + severe-risk moderation
    ↓
OpenAI embedding (512 dimensions)
    ↓
Supabase PostgreSQL
  ├─ full-text search (tsvector)
  └─ pgvector cosine similarity
    ↓
Reciprocal-rank fusion
    ↓
Published + source-backed context only
    ↓
OpenAI Responses API structured output
    ↓
Citation-key validation
    ↓
Answer + explicit source cards
```

## Why hybrid search
Keyword search is strong for exact cultural terms and spellings. Semantic retrieval helps when the user describes a concept without using the same terms stored in the database. Reciprocal-rank fusion combines both without making vector similarity the sole authority.

## `ai_documents`
The RAG index is deliberately separate from canonical knowledge tables. It is a derived cache and can always be rebuilt.

Allowed document types:
- entity summary
- content section with entity-level provenance
- sourced claim
- sourced cultural relationship
- sourced tradition timeline step
- sourced dictionary entry
- sourced kinship rule

Excluded by design:
- genealogy nodes
- genealogy edges
- private/restricted family data
- draft content
- unpublished sources
- raw community proposals

## Indexing
Run:

```bash
npm run ai:index
```

The script reads `public.ai_index_source_rows`, hashes normalized content, re-embeds only changed rows, upserts `ai_documents`, and archives stale index rows.

## Generation
`lib/openai-rest.ts` calls the Responses API directly over server-side `fetch`. It requests structured JSON output. The application validates source keys returned by the model before exposing citations.

## Models
Defaults are environment-configurable:
- response model: `gpt-5.6-terra`
- embedding model: `text-embedding-3-small`
- embedding dimensions: `512`

The database schema is currently `vector(512)`. Do not change dimensions without a matching migration and a complete re-index.

## Failure modes
- No OpenAI/Supabase configuration → AI surfaces return configuration-safe errors; non-AI site still works.
- No matching documents → assistant returns insufficient evidence instead of using general model knowledge.
- Invalid model citation key → key is dropped before rendering.
- AI request failure → request is logged as error when server logging is available.
