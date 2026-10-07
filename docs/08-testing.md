# Testing Strategy

## Unit

Vitest currently covers:
- search ranking
- alias search
- empty query behavior
- related-content resolution

Run:

```bash
npm run test
```

## Type / lint

```bash
npm run typecheck
npm run lint
```

## End-to-end

Playwright covers:
- home → marga → profile navigation
- alias search
- methodology route
- desktop Chrome and mobile Chrome projects

Install browser once:

```bash
npx playwright install chromium
npm run test:e2e
```

## Database validation

When Supabase CLI is available:

```bash
npx supabase db reset
```

Then manually validate:
- anon cannot read drafts
- anon cannot write
- reviewer cannot create entity
- editor/admin can create drafts
- search RPC returns published content only


## Phase 4 community tests

Vitest covers author/reviewer/editor transition boundaries and evidence requirements. Playwright covers the public contribution landing and contributor login route.

When Supabase CLI is available, additionally test RLS ownership, status-column protection, invite activation, suspension, evidence gating, moderation, notification ownership, and report permissions using the cases in `docs/25-phase-4-qa.md`.

## Phase 5 tests

```bash
npm run verify:phase5
npm run test
npm run test:e2e
```

Phase 5 unit coverage includes citation-key filtering so a model cannot attach an unknown source key to a rendered answer. E2E smoke tests verify the public AI, semantic search, learning, and transparency surfaces.

Live OpenAI/Supabase calls are intentionally not part of deterministic unit tests. Validate live integration after `npm run ai:index` on a development database.
