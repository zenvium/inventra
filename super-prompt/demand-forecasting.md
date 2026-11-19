# Implement demand forecasting and purchase suggestions

Add a demand forecast that produces explainable purchase-quantity suggestions. This prompt is standalone and does not depend on another super-prompt for missing requirements.

First inspect what dated sales, stock movement, and purchase history actually exists; do not invent historical data. Define the forecast horizon, aggregation level, handling of sparse or seasonal history, and confidence/limitations. Provide a simple, testable baseline method before adding complexity. Account for current available stock, reservations, open purchase orders, lead time, safety stock, and supplier pack/minimum quantities when deriving a suggested buy quantity. Show the inputs and reason behind each suggestion, and let an authorized user turn a suggestion into a draft purchase order without auto-committing spend.

Keep forecasting as a separate Planning capability if its lifecycle merits a context; Procurement owns purchase orders, Catalog owns product details, and stock ownership remains separate. Update the dictionary and use Cellix Rosetta for new models. Implement services, persistence, GraphQL, and staff reporting screens. Test no-history, sparse history, seasonality boundaries, lead time, pack rounding, and duplicate generation. Run architecture checks/build and verify a suggestion to draft-order flow.

## Required data-structure changes

Persist generated recommendations so they can be explained, reviewed, and converted without silently changing history:
- `ForecastRun`: `organizationId`, `method`, `horizonStart`, `horizonEnd`, `generatedAt`, `generatedByUserId`, and `status`.
- Embedded `ForecastSuggestion[]`: `productId`, `warehouseId`, `forecastDemandQuantity`, `availableQuantityAtGeneration`, `reservedQuantityAtGeneration`, `inboundQuantityAtGeneration`, `leadTimeDays`, `safetyStockQuantity`, `suggestedOrderQuantity`, optional `preferredSupplierId`, `status` (`OPEN`, `ACCEPTED`, `DISMISSED`, `CONVERTED`), optional `purchaseOrderId`, and an explanation/assumptions summary.
- Record the inputs needed to explain a suggestion at generation time. Treat forecast output as a recommendation, not an automatically committed purchase order.

## Project context and implementation requirements

This is Inventra (`invt`), built using CellixJS patterns. Treat this feature request as a standalone prompt; do not depend on another super-prompt for missing context. Inspect the existing repository and relevant packages before changing architecture.

Before changing data structures, read `.agents/skills/cellix-rosetta/SKILL.md` and follow its translation conventions using the plain-text `inventory-data-structure.md` source; do not require a spreadsheet. Treat that file as the source of truth for business data. Update it for durable business changes, and keep the translated models, aggregates, operations, GraphQL, and persistence synchronized with it.

Keep ownership in the established bounded contexts: Organization, User, Catalog, Inventory, Partner, Procurement, and Sale. Add a separate context when the feature has distinct language, rules, or lifecycle; do not make Inventory a catch-all. Follow patterns in the CellixJS repository (`https://github.com/CellixJs/cellixjs`, checked out next to this repository) for API composition, GraphQL, persistence, frontends, and local development. Keep application services as the entry point for API operations, keep architecture-test packages synchronized using the existing per-package consumption pattern, and keep customer and staff portal responsibilities distinct.

Adapt local-development consumers to the Pathways branch `jason/worktree-port`: `@cellix/local-dev` remains policy-free and owns shared worktree port/hostname mechanics and generic runners; each app keeps a thin wrapper for its own environment keys, hostname tokens, and app-specific settings. Do not duplicate process startup, port math, or worktree hostname mechanics in apps.

## Vercel Board task planning

When the user selects this prompt for execution or asks to queue it, consult `.agents/skills/board/SKILL.md` and use the `zenvium` team scope and `inventra/dev` channel. Break the full feature into as many Board tasks as needed; there is no fixed task count. Create self-contained task briefs with owned paths or scope, completion criteria, and proof. Use task dependencies for required sequencing, let independent tasks run in parallel, and avoid overlapping file ownership for concurrent tasks. Keep task-specific updates and results in task threads; subagents should use `inventra/dev` for coordination outside their individual task work. Follow the Board skill for command details and agent identity. Include data-structure and Cellix Rosetta work in the task graph, sequencing it before dependent implementation tasks or combining it with tightly coupled work.
