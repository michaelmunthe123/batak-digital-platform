# Phase 3 Data Model

## Three graphs, three meanings

Phase 3 deliberately does **not** collapse all relationships into a single graph.

1. `genealogy_datasets / genealogy_nodes / genealogy_edges` represent a particular family/tarombo dataset.
2. `kinship_rules` represent cultural terms and role rules such as a documented partuturan mapping.
3. `relationships` remains the knowledge graph between cultural entities such as a cultural group and a kinship system.

## Genealogy provenance

A genealogy edge can carry zero or more records in `genealogy_edge_sources`. Real published genealogical claims should normally have evidence; the only unsourced public seed graph is explicitly marked `is_demo=true` and fictional.

## Disagreement

Conflicting claims are not overwritten. Separate edges/assertions may coexist with statuses such as `supported`, `regional_variation`, or `disputed` and separate sources/context.

## Privacy

- Dataset visibility: public / restricted / private.
- Node privacy: public / restricted / private.
- Node living status: unknown / living / deceased.
- Database constraint forbids `living + public`.
- Public genealogy path SQL reads only public/published nodes and excludes draft/disputed edges.
