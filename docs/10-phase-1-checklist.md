# Phase 1 Completion Checklist

## Repository / environment
- [x] Next.js / TypeScript project structure
- [x] `.env.example`
- [x] `.gitignore`
- [x] GitHub CI
- [x] agent/project guardrails

## Database
- [x] migration-first schema
- [x] subtype model
- [x] claims + claim sources
- [x] relationships + relationship sources
- [x] classification schemes
- [x] source registry
- [x] editorial profiles
- [x] RLS baseline
- [x] full-text + trigram search RPC
- [x] pilot seed

## Public MVP
- [x] Home
- [x] Explore
- [x] Generic entity page
- [x] Marga directory
- [x] Marga profile
- [x] Adat directory
- [x] Source Library
- [x] Search
- [x] Related content
- [x] loading / error / not-found states
- [x] metadata / SEO baseline
- [x] responsive UI baseline
- [x] accessibility baseline

## Editorial MVP
- [x] Supabase SSR session plumbing
- [x] admin login
- [x] role check
- [x] draft entity creation for admin/editor
- [x] source registration draft
- [x] sourced claim draft + locator
- [x] reviewer/admin status transitions via restricted RPC
- [x] revision snapshot on publication transitions
- [x] no public account creation

## Quality
- [x] unit test source included
- [x] E2E smoke test source included
- [x] CI quality gates included
- [ ] dependency install executed in this sandbox (blocked: npm registry unavailable)
- [ ] local production build executed in this sandbox (depends on install)
- [ ] live Supabase migration executed (requires user's Supabase project or local Docker stack)
- [ ] live Vercel deployment (requires user's Vercel/GitHub environment)

## Phase status

**Source implementation: complete.**
External-account deployment tasks remain intentionally user-environment dependent.
