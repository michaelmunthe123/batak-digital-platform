# Local Setup

## Requirements

- Node.js >= 20.9
- npm
- Docker if running Supabase locally
- Supabase CLI (recommended)

## Public-only start

```bash
cp .env.example .env.local
npm install
npm run dev
```

No Supabase variables are required to preview the public pilot site.

## Full local Supabase

```bash
npx supabase init
npx supabase start
npx supabase db reset
```

The repository already contains cumulative migrations:
- `supabase/migrations/20261006090000_initial_schema.sql`
- `supabase/migrations/20261006093000_editorial_workflow.sql`
- `supabase/migrations/20261007130000_phase2_interactive_culture.sql`
- `supabase/migrations/20261007170000_phase3_genealogy_kinship.sql`
- `supabase/migrations/20261007193000_phase4_community_contribution.sql`
- `supabase/seed.sql`

Copy the local Project URL and publishable/anon key into `.env.local`. For Phase 4 invitations also set `SUPABASE_SECRET_KEY` on the server. Local email invitations use `supabase/templates/invite.html`.

## Remote Supabase

1. Create a Supabase project.
2. Install/login to the Supabase CLI.
3. Link this repository to the project.
4. Run:

```bash
npx supabase db push --include-seed
```

5. Put Project URL and Publishable Key in `.env.local`.

## Create first editorial account

1. Create the user through Supabase Auth.
2. Copy the user's UUID.
3. Add a role:

```sql
insert into public.profiles (id, display_name, role)
values ('USER_UUID', 'Your Name', 'admin')
on conflict (id) do update set role = excluded.role;
```

4. Sign in at `/admin/login`.

Never expose `SUPABASE_SECRET_KEY` or legacy `SUPABASE_SERVICE_ROLE_KEY` to the browser.

## Phase 4 contributor pilot

1. Apply the Phase 4 migration.
2. Add the server-only `SUPABASE_SECRET_KEY`.
3. For hosted Supabase, customize the Invite email template so it routes `TokenHash` to `/auth/confirm?token_hash={{ .TokenHash }}&type=invite&next=/account/welcome`.
4. Log in as an admin at `/admin`.
5. Open `/admin/community` and invite a contributor.
6. Contributor accepts the email, sets password/profile at `/account/welcome`, and then uses `/account`.

## Phase 5 AI setup

Phase 5 adds:

- `supabase/migrations/20261007223000_phase5_ai_mature_platform.sql`
- pgvector-backed AI documents
- OpenAI Responses/Embeddings integration

Add these server variables to `.env.local`:

```env
AI_ENABLED=true
OPENAI_API_KEY=
OPENAI_MODEL=gpt-5.6-terra
OPENAI_EMBEDDING_MODEL=text-embedding-3-small
OPENAI_EMBEDDING_DIMENSIONS=512
AI_MAX_CONTEXT_DOCS=8
AI_RATE_LIMIT_PER_10_MIN=20
AI_STORE_PROMPTS=false
AI_SAFETY_HASH_SALT=
```

Then build the derived AI index:

```bash
npm run ai:index
```

For Windows + VS Code, follow `RUN_IN_VSCODE_WINDOWS.md` instead of piecing together setup steps from multiple documents.
