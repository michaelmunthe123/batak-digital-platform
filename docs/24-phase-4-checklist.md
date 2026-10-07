# Phase 4 Completion Checklist

## Account & access
- [x] Invitation-based contributor model.
- [x] Server-only Supabase admin client.
- [x] Invite confirmation route.
- [x] Welcome/password/profile activation flow.
- [x] Contributor login/logout.
- [x] Active/invited/suspended membership states.

## Contributor experience
- [x] Contributor workspace.
- [x] Public/private profile setting.
- [x] Proposal draft creation.
- [x] Draft editing.
- [x] Evidence attachment.
- [x] Sensitive-type evidence gate.
- [x] Submit/withdraw flow.
- [x] Reviewer conversation.
- [x] Status notifications.
- [x] Public contributor profile + activity aggregates.

## Moderation
- [x] Community moderation queue.
- [x] Reviewer/editor/admin transition rules.
- [x] Request-evidence state.
- [x] Accept / reject / dispute.
- [x] Merge restricted to editor/admin.
- [x] Moderation messages and internal notes.
- [x] Audit trail.
- [x] Revision snapshot on accepted/merged proposal.

## Feedback & governance
- [x] Public contribution guidelines covering evidence, privacy, copyright, and cultural sensitivity.
- [x] Content report form.
- [x] Report moderation.
- [x] Admin invitation.
- [x] Membership suspension/reactivation.
- [x] No voting on cultural truth.
- [x] No direct contributor publication.
- [x] No AI / Phase 5 feature.

## Database & security
- [x] Migration-first implementation.
- [x] RLS enabled on all Phase 4 tables.
- [x] Per-user ownership policies.
- [x] Column-level mutation grants.
- [x] Server secret placeholder only; no secret value committed.
- [x] Security-invoker moderation view.
