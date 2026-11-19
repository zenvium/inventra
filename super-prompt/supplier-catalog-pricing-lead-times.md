# Implement supplier product catalogs, pricing, and lead times

Allow each supplier to provide its own product identifiers, purchase cost, minimum order quantity, pack size, and expected lead time. This prompt is standalone and does not depend on another super-prompt for missing requirements.

Support mapping supplier SKUs to canonical Inventra products, validating uniqueness within a supplier, recording effective dates and currency, and selecting a supplier offer for a purchase order. Preserve the historical price and supplier terms on each order line so catalog updates do not rewrite past orders. Handle discontinued mappings and changed pack sizes without corrupting on-hand units. Define safe defaults and validation for missing or stale lead-time data.

Keep canonical product identity in Catalog, supplier relationships in Partner, and purchase-order decisions in Procurement. Update `inventory-data-structure.md` with the Cellix Rosetta workflow. Implement domain rules, application services, persistence, GraphQL, and staff portal editing/selection flows. Test duplicate supplier SKUs, effective-price changes, historical order stability, pack-size conversions, and discontinued products. Run architecture checks/build and verify creating an offer and using it on a purchase order.

## Required data-structure changes

Add a supplier-specific offer model without replacing canonical product identity:
- `SupplierProductOffer`: `organizationId`, `supplierId`, `productId`, `supplierSku`, `unitCost`, `currency`, `minimumOrderQuantity`, `packSize`, `leadTimeDays`, optional `validFrom` and `validTo`, `status` (`ACTIVE`, `DISCONTINUED`), timestamps.
- Enforce supplier SKU uniqueness per supplier and define how effective dates select one valid offer. Preserve an order-time snapshot of selected supplier SKU, unit cost, currency, pack size, and lead time on `PurchaseOrderItem` so historical orders remain stable.

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
