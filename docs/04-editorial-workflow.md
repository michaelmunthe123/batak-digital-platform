# Editorial Workflow

## Roles

### Admin
Manages editorial access and can edit content.

### Editor
Creates and updates drafts.

### Reviewer
Can inspect editorial content. Phase 1 does not give reviewer write access to entity creation.

## Workflow

1. Researcher/editor creates or registers a source.
2. Editor creates an entity as `draft`.
3. Claims are written separately from entity identity.
4. Claims are linked to sources with a locator.
5. Reviewer checks context, source strength, and wording.
6. Content changes to `published`.
7. Public RLS policies expose only permitted rows.

## Sensitive genealogy rule

Do not publish a parent/descendant, clan-origin, or tarombo relation merely because it is common on
social media. Prefer two independent sources or one especially strong source with explicit context.

## Variants

If two credible sources differ:
- preserve both claims,
- give each its source,
- use `regional_variation` or `disputed` where appropriate,
- explain the scope instead of deciding by popularity.


## Phase 1 UI support

The editorial workspace now supports:
- create entity draft
- register source draft
- create a claim linked to a source + locator
- editor submission to `in_review`
- reviewer/admin entity/source publishing
- reviewer/admin claim classification
- revision snapshot before status transitions

Status transitions use security-definer RPC functions that validate `public.profiles.role`.
A reviewer does not receive broad table edit permission.
