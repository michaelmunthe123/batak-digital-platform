# Phase 4 Data Model

Phase 4 is intentionally additive. Published cultural knowledge remains in the existing entity/claim/source/relationship/genealogy tables.

## Community membership

`community_memberships`
- `user_id`
- `status`: invited / active / suspended
- invitation and activation timestamps
- internal admin note

Membership is separate from the editorial `profiles.role`. A contributor is not automatically an editor.

## Public contributor profile

`contributor_profiles`
- display name
- stable slug
- bio
- interests
- public/private profile switch

Email and internal access notes are never exposed in this table.

## Contribution proposal

`contributions`
- author
- proposal type
- optional target entity
- title / section key
- rationale
- proposed content
- moderation status
- moderator / moderation note
- timestamps for submit/review/merge

A contribution is staging data, not a public knowledge record.

## Evidence

`contribution_sources`
- link to an existing source, or
- metadata for a source proposed by the contributor
- locator and contextual note

Correction, relationship, genealogy, and language proposals require evidence before submission.

## Collaboration and audit

`contribution_messages` records contributor/reviewer discussion.
`contribution_audit_log` records workflow transitions.
`community_notifications` records contributor-facing status events.

## Reports

`content_reports` handles incorrect information, missing evidence, cultural sensitivity, privacy, copyright, and other actionable issues.

## Public reputation aggregate

`get_public_contributor_stats(slug)` returns aggregate counts and an editorial activity score. The score is deliberately not modeled as cultural authority and is not used to rank truth claims.
