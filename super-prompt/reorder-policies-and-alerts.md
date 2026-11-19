# Implement reorder policies and low-stock alerts

Implement per-product or per-warehouse replenishment policies and low-stock alerts. This prompt is standalone and does not depend on another super-prompt for missing requirements.

Support reorder point, target/max stock, safety stock, and optional preferred supplier/warehouse settings. Calculate eligible stock using the agreed availability definition, including reservations and in-transit quantities without double counting. Generate actionable alerts and suggested reorder quantities, avoid duplicate open alerts, and close or update alerts as stock changes. Let staff acknowledge or snooze alerts without hiding unresolved shortages. Keep policy evaluation deterministic and explain the quantities behind each recommendation.

Place policy and alert ownership in an appropriate Planning or Inventory-adjacent context; purchasing remains in Procurement and products in Catalog. Do not make Inventory a catch-all. Update the data structure using Cellix Rosetta, implement services, persistence, GraphQL, and staff UI. Test thresholds, reservations, in-transit stock, duplicate alert suppression, policy changes, and resolution. Run architecture checks/build and verify an alert through purchase-order creation.

## Required data-structure changes

Add configurable replenishment policy and lifecycle-managed alerts:
- `ReorderPolicy`: `organizationId`, `productId`, optional `warehouseId`, `reorderPoint`, optional `targetStock`, `safetyStock`, optional `preferredSupplierId`, `isActive`, `createdByUserId`, timestamps. Define uniqueness for product-wide versus warehouse-specific policies.
- `ReorderAlert`: `organizationId`, `productId`, `warehouseId`, `status` (`OPEN`, `ACKNOWLEDGED`, `SNOOZED`, `RESOLVED`), `onHandAtTrigger`, `reservedAtTrigger`, `inboundAtTrigger`, `suggestedOrderQuantity`, optional `snoozedUntil`, optional `purchaseOrderId`, timestamps.
- Keep a stable alert identity so policy evaluations update or resolve an existing alert instead of creating duplicates. Preserve the input quantities used to calculate its suggestion.

## Project context and implementation requirements

This is Inventra (`invt`), built using CellixJS patterns. Treat this feature request as a standalone prompt; do not depend on another super-prompt for missing context. Inspect the existing repository and relevant packages before changing architecture.

Before changing data structures, read `.agents/skills/cellix-rosetta/SKILL.md` and follow its translation conventions using the plain-text `inventory-data-structure.md` source; do not require a spreadsheet. Treat that file as the source of truth for business data. Update it for durable business changes, and keep the translated models, aggregates, operations, GraphQL, and persistence synchronized with it.

Keep ownership in the established bounded contexts: Organization, User, Catalog, Inventory, Partner, Procurement, and Sale. Add a separate context when the feature has distinct language, rules, or lifecycle; do not make Inventory a catch-all. Follow patterns in the CellixJS repository (`https://github.com/CellixJs/cellixjs`, checked out next to this repository) for API composition, GraphQL, persistence, frontends, and local development. Keep application services as the entry point for API operations, keep architecture-test packages synchronized using the existing per-package consumption pattern, and keep customer and staff portal responsibilities distinct.

Adapt local-development consumers to the Pathways branch `jason/worktree-port`: `@cellix/local-dev` remains policy-free and owns shared worktree port/hostname mechanics and generic runners; each app keeps a thin wrapper for its own environment keys, hostname tokens, and app-specific settings. Do not duplicate process startup, port math, or worktree hostname mechanics in apps.

## Vercel Board task planning

When the user selects this prompt for execution or asks to queue it, consult `.agents/skills/board/SKILL.md` and use the `zenvium` team scope and `inventra/dev` channel. Break the full feature into as many Board tasks as needed; there is no fixed task count. Create self-contained task briefs with owned paths or scope, completion criteria, and proof. Use task dependencies for required sequencing, let independent tasks run in parallel, and avoid overlapping file ownership for concurrent tasks. Keep task-specific updates and results in task threads; subagents should use `inventra/dev` for coordination outside their individual task work. Follow the Board skill for command details and agent identity. Include data-structure and Cellix Rosetta work in the task graph, sequencing it before dependent implementation tasks or combining it with tightly coupled work.
