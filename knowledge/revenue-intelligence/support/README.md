# support/

This folder holds provenance and migration receipts for the revenue-intelligence
namespace. It is mechanical and historical, not interpretive.

## What goes here

- **HRIO repo ingestion receipts**: when content is pulled from the HRIO repo into
  this namespace, record the source file path, the date of ingestion, and the
  destination node or support file.
- **Pipeline change receipts**: when the HRIO pipeline architecture changes (new
  stage, removed stage, reorder), record the old shape, the new shape, and which
  namespace nodes were updated.
- **Source API version changes**: when the Reddit API or any other signal source
  changes its contract, record the old version, the new version, and the affected
  metric or pipeline nodes.
- **Reorganization maps**: when nodes are renamed, moved, or merged, record the old
  path, the new path, and the alias added to preserve wikilink resolution.

## What does not go here

Do not put derived intellectual work here. If you are interpreting what a pipeline
change means for revenue opportunity quality, that interpretation belongs in
`synthesis/`. The `support/` folder records facts about what changed; `synthesis/`
records what you make of those changes.

## Relationship to validate.sh

When a node is renamed or moved, the old id must be added to the new file's
`aliases` field, and a record of the rename should be added here. This is the
migration compatibility rule from `_system/migration-compatibility-rules.md`.

## Navigational note

This README is navigational and carries no node frontmatter.
