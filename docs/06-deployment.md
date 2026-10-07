# Deployment

## Recommended topology

- Application: Vercel
- Database/Auth/Storage: Supabase
- Source control: GitHub

## Vercel environment variables

- `NEXT_PUBLIC_SITE_URL`
- `NEXT_PUBLIC_SUPABASE_URL`
- `NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY`

`SUPABASE_SERVICE_ROLE_KEY` is not needed by the public application in Phase 1.

## Database deployment

All remote schema changes must go through migration files:

```bash
npx supabase link
npx supabase db push
```

Do not edit production tables ad hoc and forget to capture the migration.

## Pre-production gate

- lint passes
- TypeScript passes
- unit tests pass
- production build passes
- E2E smoke test passes
- RLS policies manually tested with anon and authenticated users
- public content reviewed for source/provenance

## Phase 5 deployment requirements

Production requires server-only environment variables:

```text
SUPABASE_SECRET_KEY
OPENAI_API_KEY
AI_SAFETY_HASH_SALT
```

Do not expose them with `NEXT_PUBLIC_`.

After deploying a database migration or publishing new source-backed cultural content, rebuild the AI index from a trusted environment:

```bash
npm run ai:index
```

The assistant does not automatically crawl the web or automatically embed community drafts. The RAG index is a derived cache of approved source-backed content only.

Keep `AI_STORE_PROMPTS=false` unless a documented retention policy and privacy purpose have been approved.
