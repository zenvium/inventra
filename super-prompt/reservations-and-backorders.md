# Implement sales reservations and backorders

Implement allocation of available stock to sales orders, including partial allocation and backorders. This prompt is standalone and does not depend on another super-prompt for missing requirements.

Define available, on-hand, reserved, and backordered quantities and their invariants. Reservations must be attributable to an order and warehouse, prevent double allocation, and update consistently when an order changes, is cancelled, or is fulfilled. Choose and document an allocation policy, such as explicit warehouse selection or configurable FIFO across eligible warehouses. Handle insufficient stock without silently promising unavailable quantities. Ensure stock movements and reservations cannot drift during retries or concurrent order changes.

Keep sales-order intent in Sale and stock allocation rules in the appropriate bounded context; do not collapse both into Inventory. Update `inventory-data-structure.md` and use the Cellix Rosetta workflow. Wire application services through GraphQL and expose order availability/reservation state in the staff and customer experiences where appropriate. Test competing orders, partial allocation, cancellation release, backorder conversion, retries, and unavailable stock. Run architecture tests/build and verify an end-to-end order reservation locally.

## Required data-structure changes

Represent allocations as auditable records and expose outstanding line quantities:
- Add `InventoryReservation`: `organizationId`, `salesOrderId`, `salesOrderItemId`, `productId`, `warehouseId`, `quantity`, `status` (`ACTIVE`, `RELEASED`, `FULFILLED`, `EXPIRED`), `createdAt`, optional `expiresAt`, and timestamps. Keep active reservations attributable to a specific order line and warehouse.
- Extend `SalesOrderItem` with `quantityReserved`, `quantityBackordered`, and `quantityFulfilled` (or define these as derived values and document the calculation). Ensure these values reconcile with reservations and shipments rather than becoming independent, conflicting sources of truth.
- Add a `Backorder` aggregate only if it needs its own lifecycle; if needed, include `organizationId`, `salesOrderId`, `salesOrderItemId`, `quantityOutstanding`, `status` (`OPEN`, `PARTIALLY_ALLOCATED`, `FULFILLED`, `CANCELLED`), and timestamps.

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
