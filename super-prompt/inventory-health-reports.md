# Implement inventory aging, turnover, and dead-stock reports

Build staff reports for stock age, inventory turnover, and potentially inactive or dead stock. This prompt is standalone and does not depend on another super-prompt for missing requirements.

Inspect available movement and receipt timestamps before defining metrics. Document formulas, time windows, treatment of transfers/returns/adjustments, and behavior when historical data is incomplete. Report by product and warehouse, provide filters and drill-down to the underlying movements, and distinguish estimated metrics from exact values. Use bounded pagination and stable sorting for larger datasets. Avoid mutating inventory while computing reports and do not introduce arbitrary statuses that conflict with domain rules.

Place cross-context aggregation in a reporting/read-model capability where appropriate, not as business logic in Inventory. Update `inventory-data-structure.md` only if durable reporting data is needed, and use the Cellix Rosetta workflow for any schema changes. Add application/query services, persistence/read models, GraphQL, and staff UI. Test formulas, boundary dates, transfers, missing history, and pagination. Run architecture checks/build and verify reports using known sample movements.

## Data-structure impact

Do not add a persisted report aggregate by default; compute these read-only reports from inventory and stock-movement history. The current `Inventory` aggregate has quantities, and `StockMovement` has `createdAt`; inspect whether these fields are sufficient before choosing formulas. Aggregate on-hand values alone cannot prove the age of individual remaining units.

If exact stock age is required and cannot be reconstructed, first propose an `InventoryReceiptLayer` with `organizationId`, `productId`, `warehouseId`, optional `locationId`, `sourceReceiptId`, `receivedAt`, `quantityReceived`, `quantityRemaining`, and optional `unitCost`. Define how sales, transfers, returns, and adjustments consume or move layers before adding it. Otherwise label age as an estimate and leave the persistent data structure unchanged.

## Project context and implementation requirements

This is Inventra (`invt`), built using CellixJS patterns. Treat this feature request as a standalone prompt; do not depend on another super-prompt for missing context. Inspect the existing repository and relevant packages before changing architecture.

Before changing data structures, read `.agents/skills/cellix-rosetta/SKILL.md` and follow its translation conventions using the plain-text `inventory-data-structure.md` source; do not require a spreadsheet. Treat that file as the source of truth for business data. Update it for durable business changes, and keep the translated models, aggregates, operations, GraphQL, and persistence synchronized with it.

Keep ownership in the established bounded contexts: Organization, User, Catalog, Inventory, Partner, Procurement, and Sale. Add a separate context when the feature has distinct language, rules, or lifecycle; do not make Inventory a catch-all. Follow patterns in the CellixJS repository (`https://github.com/CellixJs/cellixjs`, checked out next to this repository) for API composition, GraphQL, persistence, frontends, and local development. Keep application services as the entry point for API operations, keep architecture-test packages synchronized using the existing per-package consumption pattern, and keep customer and staff portal responsibilities distinct.

Adapt local-development consumers to the Pathways branch `jason/worktree-port`: `@cellix/local-dev` remains policy-free and owns shared worktree port/hostname mechanics and generic runners; each app keeps a thin wrapper for its own environment keys, hostname tokens, and app-specific settings. Do not duplicate process startup, port math, or worktree hostname mechanics in apps.

## Vercel Board task planning

When the user selects this prompt for execution or asks to queue it, consult `.agents/skills/board/SKILL.md` and use the `zenvium` team scope and `inventra/dev` channel. Break the full feature into as many Board tasks as needed; there is no fixed task count. Create self-contained task briefs with owned paths or scope, completion criteria, and proof. Use task dependencies for required sequencing, let independent tasks run in parallel, and avoid overlapping file ownership for concurrent tasks. Keep task-specific updates and results in task threads; subagents should use `inventra/dev` for coordination outside their individual task work. Follow the Board skill for command details and agent identity. Include data-structure and Cellix Rosetta work in the task graph, sequencing it before dependent implementation tasks or combining it with tightly coupled work.
