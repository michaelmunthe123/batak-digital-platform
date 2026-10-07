# Phase 1 Handoff

## Status

**Implementation source: COMPLETE**

This handoff covers the exact Phase 1 items from the master Project Plan:
repository/CI/environments, schema+migrations, minimal editorial workflow, home/explore,
entity pages, marga directory/profile, source library, search, related content, responsive
and accessibility baseline, and pilot content.

## What works without external accounts

After dependencies are installed, the public app can run with pilot fallback content even when
Supabase environment variables are blank.

## What activates after Supabase is connected

- database-backed published content
- full-text/trigram RPC search
- editorial login
- entity/source/claim draft creation
- reviewer/admin status transitions
- RLS enforcement
- revision snapshots

## QA performed in the build environment

- TypeScript/TSX syntax transpilation across source files
- strict local type check using QA stubs for unavailable external packages
- internal `@/` import resolution check
- executable domain assertions for exact search, alias search, empty search, and related content
- JSON/YAML/TOML parse checks
- Phase 1 custom structural verification

## QA not executable in the build environment

The npm registry was unreachable, so third-party dependencies could not be installed here.
Therefore the real Next.js production build, ESLint with installed Next config, Vitest runner,
Playwright browser run, and live Supabase migration must be run after dependency/network access is
available.

Run locally:

```bash
npm install
npm run verify:phase1
npm run lint
npm run typecheck
npm run test
npm run build
npx playwright install chromium
npm run test:e2e
```

For Supabase:

```bash
npx supabase start
npx supabase db reset
```

See `docs/05-local-setup.md`.
