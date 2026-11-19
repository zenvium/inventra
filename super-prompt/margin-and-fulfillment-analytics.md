# Implement margin and fulfillment analytics

Add staff analytics for order margin and fulfillment performance. This prompt is standalone and does not depend on another super-prompt for missing requirements.

Inspect order line, supplier cost, shipment, cancellation, and return data. Define whether margin uses order-time cost, current cost, discounts, shipping, and refunds; historical reports must use stable order-time values where possible. Define fulfillment measures such as time to release, pick, dispatch, delivery, partial-fill rate, and cancellation rate. Expose time range, product, customer, and warehouse filters where the data supports them. Clearly show missing or estimated cost inputs and avoid presenting estimates as audited financial results.

Use a reporting/query capability for cross-context aggregation. Keep Sale, Procurement, and any Fulfillment lifecycle ownership separate. Update the data structure only for required snapshots/read models and use Cellix Rosetta. Implement application services, GraphQL, and staff dashboards with bounded queries and drill-down. Test formula semantics, returns/refunds, missing costs, partial orders, date boundaries, and pagination. Run architecture checks/build and verify results against seeded examples.

## Required data-structure changes

Keep analytics read-only, but preserve order-time and fulfillment facts needed for accurate historical metrics:
- Extend `SalesOrderItem` with optional `unitCostAtOrder` and any applied `discountAmount` needed for the agreed margin formula; capture these values when the order is confirmed so later catalog price changes do not rewrite history. Add currency at the order or line level if the existing application supports multiple currencies.
- Ensure a shipment aggregate exists, or define `SalesShipment` with `organizationId`, `salesOrderId`, `status` (`PICKING`, `PACKED`, `DISPATCHED`, `DELIVERED`, `CANCELLED`, `EXCEPTION`), optional `carrier` and `trackingNumber`, `pickedAt`, `packedAt`, `dispatchedAt`, `deliveredAt`, and timestamps.
- `SalesShipmentItem[]` records `salesOrderItemId`, `productId`, `quantityPicked`, `quantityPacked`, and `quantityShipped`. Reuse shipment/return data from the corresponding feature if already implemented; do not duplicate it.
- Add no persistent analytics model unless a measured query need requires a read-model snapshot. If added, define its source fields and refresh semantics explicitly.

## Project context and implementation requirements

This is Inventra (`invt`), built using CellixJS patterns. Treat this feature request as a standalone prompt; do not depend on another super-prompt for missing context. Inspect the existing repository and relevant packages before changing architecture.

Before changing data structures, read `.agents/skills/cellix-rosetta/SKILL.md` and follow its translation conventions using the plain-text `inventory-data-structure.md` source; do not require a spreadsheet. Treat that file as the source of truth for business data. Update it for durable business changes, and keep the translated models, aggregates, operations, GraphQL, and persistence synchronized with it.

Keep ownership in the established bounded contexts: Organization, User, Catalog, Inventory, Partner, Procurement, and Sale. Add a separate context when the feature has distinct language, rules, or lifecycle; do not make Inventory a catch-all. Follow patterns in the CellixJS repository (`https://github.com/CellixJs/cellixjs`, checked out next to this repository) for API composition, GraphQL, persistence, frontends, and local development. Keep application services as the entry point for API operations, keep architecture-test packages synchronized using the existing per-package consumption pattern, and keep customer and staff portal responsibilities distinct.

Adapt local-development consumers to the Pathways branch `jason/worktree-port`: `@cellix/local-dev` remains policy-free and owns shared worktree port/hostname mechanics and generic runners; each app keeps a thin wrapper for its own environment keys, hostname tokens, and app-specific settings. Do not duplicate process startup, port math, or worktree hostname mechanics in apps.

## Vercel Board task planning

When the user selects this prompt for execution or asks to queue it, consult `.agents/skills/board/SKILL.md` and use the `zenvium` team scope and `inventra/dev` channel. Break the full feature into as many Board tasks as needed; there is no fixed task count. Create self-contained task briefs with owned paths or scope, completion criteria, and proof. Use task dependencies for required sequencing, let independent tasks run in parallel, and avoid overlapping file ownership for concurrent tasks. Keep task-specific updates and results in task threads; subagents should use `inventra/dev` for coordination outside their individual task work. Follow the Board skill for command details and agent identity. Include data-structure and Cellix Rosetta work in the task graph, sequencing it before dependent implementation tasks or combining it with tightly coupled work.
