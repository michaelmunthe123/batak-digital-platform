# Phase 2 Data Model

## New provenance layer

`entity_sources` links a general entity directly to source records without forcing every citation to become a formal claim.

## Cultural Map

- `map_locations`
- `map_location_sources`

Coordinates have a `precision` field. `representative` means a navigation point, **not** a cultural boundary.

## Adat Timeline

- `tradition_timeline_steps`
- `timeline_step_sources`

Timeline steps carry a type (`context`, `preparation`, `core`, `closing`, `variation`) and can document competing/region-specific versions.

## Language / Dictionary

- `dictionary_entries`
- `dictionary_entry_sources`

Dictionary entries are attached to `language_varieties`, not `cultural_groups`.

## Media rights

`media_assets` now supports title, type, external URL, creator, license URL, attribution, rights status, and usage notes. `storage_path` is optional so metadata-only records can be published without copying an asset.

## Completeness

`content_completeness` is an editorial view. Its percentage measures structural completeness, never historical truth or cultural authority.
