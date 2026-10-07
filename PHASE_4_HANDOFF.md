# Phase 4 Handoff — Community & Contribution

Phase 4 adds a controlled community layer to the cumulative Batak Digital Platform.

## Main flows

### Contributor
`Invite → confirm session → set password/profile → draft proposal → attach evidence → submit → reviewer feedback → accepted/merged/rejected/disputed → notification + audit`

### Editorial
`Community queue → inspect proposal/evidence → request evidence / review → accept / reject / dispute → editor/admin merge`

### Reports
`Contributor report → moderation triage → resolved/dismissed`

## Routes

Public/community:
- `/contribute`
- `/contribute/guidelines`
- `/account/login`
- `/account/welcome`
- `/account`
- `/account/profile`
- `/account/contributions`
- `/account/notifications`
- `/contribute/new`
- `/contribute/[id]`
- `/contributors/[slug]`
- `/report`

Editorial:
- `/admin/community`
- `/admin/community/[id]`

Auth callback:
- `/auth/confirm`

## Database

Apply `supabase/migrations/20261007193000_phase4_community_contribution.sql` after Phase 3.

## Production auth setup

1. Set `NEXT_PUBLIC_SUPABASE_URL` and `NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY`.
2. Add `SUPABASE_SECRET_KEY` only to the server environment.
3. Configure Supabase Site URL / redirect allow list.
4. Customize the Invite email template to use TokenHash and `/auth/confirm`.
5. Never expose the secret key to browser bundles or `NEXT_PUBLIC_*` variables.

## Important boundaries

- Community cannot write published knowledge tables.
- Registration is invitation-only during pilot.
- No public voting/leaderboard for cultural truth.
- No personal family-tree self-service.
- No AI assistant or LLM inference in Phase 4.

## Next phase

Phase 5 may add a source-grounded AI interface only after retrieval/evaluation/safety prerequisites are met.
