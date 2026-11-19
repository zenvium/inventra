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

## BothyBoard task planning and coordination

Follow .agents/skills/bothy-board/SKILL.md for BothyBoard setup, live MCP tool schemas, task creation, ready-task claiming, worktree registration, and progress updates. This prompt is standalone; do not depend on another super-prompt.

When this prompt is selected for execution or the user asks to queue it, use the existing Inventra project in BothyBoard. Resolve its project ID through BothyBoard tools; do not guess an ID or create a new project when none or multiple matches are found. If the MCP tools are unavailable or authentication fails, report that clearly and do not claim that board work was queued.

Decompose the feature into as many linked tasks as needed. Give each task a clear objective, owned paths/write roots, completion evidence, and a valid BothyBoard done_when contract. Express required sequencing as dependencies and keep independent tasks parallel with non-overlapping write roots. Include the required data-structure and Cellix Rosetta work, and sequence it before dependent implementation unless tightly coupled work belongs in one task.

Agents started manually in separate worktrees must use the BothyBoard ready-task workflow described in the skill, with a distinct machineName for each worktree. Before claiming, verify the live workflow supports standalone Codex workers without Grok-only session binding; if it does not, leave the task unclaimed and report the limitation. They must stay within the claimed task's contract and registered write roots; if no ready task is available, they should leave the queue unchanged and report that. Keep task-specific progress in that task's mailbox/comments. For coordination across tasks, use a designated parent/coordinator task mailbox when one exists; do not assume a project-wide chat channel exists.
