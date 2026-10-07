# Community Moderation & Security

## Core rule

A contributor can propose; a contributor cannot publish.

Public knowledge tables continue to use the Phase 1–3 editorial permissions. Phase 4 contributor RLS applies only to community staging tables.

## Onboarding

The pilot is invitation-based. Admin invitation uses Supabase Auth Admin API from a trusted server environment. The server-only secret must never be available to browser code.

Hosted Supabase projects should customize the Invite email template to send the TokenHash to `/auth/confirm`. The repository includes a local template under `supabase/templates/invite.html`.

## Role separation

- Reader: public browsing only.
- Contributor: owns proposals, sources, reports, profile, and contributor-visible conversation.
- Reviewer: triage/review, request evidence, accept/reject/dispute.
- Editor: reviewer abilities plus final merge.
- Admin: editor abilities plus invitation and membership management.

## RLS rules

- Contributor can read only their own non-public staging data.
- Contributor can create a proposal only for their own `auth.uid()`.
- Contributor can edit proposal content only in `draft` or `needs_evidence`.
- Status changes use the `transition_contribution_status` RPC instead of direct column writes.
- Moderators can inspect the queue and reports.
- Public contributor profile exposes only explicitly public profile fields.
- Notifications are owner-only.

The migration also uses column-level grants so an authenticated contributor cannot directly update workflow status/moderator columns even if application code is bypassed.

## Evidence gate

Genealogy, relationship, language, and correction proposals cannot be submitted until at least one source is attached.

## Moderation states

`draft → submitted → in_review → accepted → merged`

Branches:
- `submitted/in_review → needs_evidence`
- `submitted/in_review → rejected`
- `submitted/in_review → disputed`
- author may withdraw before full review

Only editor/admin can mark a proposal `merged`.

## Audit and revisions

Every workflow transition generates an audit row. Accepted and merged proposals generate a `revisions` snapshot so the platform can trace what proposal led to an editorial decision.

## Reports

Content reports are available only to active invited contributors during the pilot. This is deliberate: the project does not pretend to have anonymous abuse protection before a production-grade rate-limiting/captcha layer exists.

## Reputation safety

The editorial score is a deterministic activity summary:
- accepted contribution = 2 points
- merged contribution = 3 points

It must not be used as a proxy for ethnicity, adat rank, family seniority, academic credentials, or truth.
