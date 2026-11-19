# Implement sales picking, packing, shipping, and tracking

Implement the outbound fulfillment workflow for sales orders. This prompt is standalone and does not depend on another super-prompt for missing requirements.

Support order release, picking lists, scan or manual pick confirmation, packing, shipment creation, carrier/tracking details, dispatch, and delivery updates. Honor reservations and product traceability requirements. Picked quantities must not exceed allocated quantities; partial shipment must leave remaining quantities visible and correctly reserved or released. Record shipment contents and stock movements exactly once, support shipment retries safely, and distinguish shipped from delivered. Provide clear exception handling for short picks, substitutions if allowed, damaged items, and cancelled orders.

Keep commercial order state in Sale and create a distinct Fulfillment context if its shipment lifecycle warrants it. Do not place all behavior in Inventory. Update the data structure using the Cellix Rosetta workflow, and implement application services, persistence, GraphQL, and staff portal workflows. Add customer-visible shipment status where appropriate. Test partial shipments, retries, short picks, cancellation, and tracking updates. Run architecture checks/build and verify order-to-delivery locally.

## Required data-structure changes

Represent each partial or complete shipment as a durable fulfillment record:
- Add `SalesShipment`: `organizationId`, `salesOrderId`, `status` (`PICKING`, `PACKED`, `DISPATCHED`, `DELIVERED`, `CANCELLED`, `EXCEPTION`), optional `carrier`, `trackingNumber`, `createdByUserId`, `pickedAt`, `packedAt`, `dispatchedAt`, `deliveredAt`, and timestamps.
- Embedded `SalesShipmentItem[]`: `salesOrderItemId`, `productId`, `warehouseId`, `quantityAllocated`, `quantityPicked`, `quantityPacked`, `quantityShipped`, optional exception reason, and resulting `stockMovementId`.
- Add `PARTIALLY_FULFILLED` to `SalesOrderStatus` if order-level status must distinguish partially shipped orders. Derive remaining quantities from order lines and shipment items; do not duplicate them without a reconciliation rule.
- Preserve shipment history and make state-transition timestamps and movement references idempotent.

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
