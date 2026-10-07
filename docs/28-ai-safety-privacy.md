# Phase 5 — AI Safety, Privacy & Cultural Governance

## Cultural grounding
The model receives a strict instruction to use only retrieved context. Retrieved text is treated as data and cannot override system/developer rules.

## Genealogy
Public AI indexing deliberately excludes `genealogy_nodes` and `genealogy_edges`. Deterministic Phase 3 tools remain the correct surface for supported genealogy paths and partuturan rules.

## Living people
The Phase 3 database invariant preventing public living-person genealogy remains in force. Phase 5 does not bypass it and does not copy such records into the RAG index.

## Prompt privacy
`AI_STORE_PROMPTS=false` is the default. With that setting, `ai_request_log` stores:
- prompt hash
- anonymous rate-limit hash
- request kind
- model/retrieval metadata
- document IDs
- token/latency metadata
- grounding/error status

It does not store raw public question/answer text. Turn prompt storage on only after documenting a retention purpose and policy.

## Anonymous rate limiting
The application hashes network/user-agent hints with `AI_SAFETY_HASH_SALT`. Raw IP addresses are not written to Phase 5 tables. This is a pragmatic anti-abuse control, not a durable identity system.

## Moderation
The application calls the OpenAI moderation endpoint. It blocks a narrow set of severe categories to avoid unnecessarily suppressing educational discussion of history, conflict, or death.

## Editorial AI
AI review can:
- compare draft language against retrieved sources
- flag unsupported statements
- propose reviewer questions
- highlight risk areas

AI review cannot:
- publish an entity or claim
- merge a community contribution
- verify a genealogy edge
- change claim status
- change source status

## Source conflict
A `regional_variation` or `disputed` claim must stay qualified in AI output. The assistant is not allowed to collapse competing documented traditions into one universal rule.
