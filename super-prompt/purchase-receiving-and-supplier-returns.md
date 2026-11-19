# Implement purchase receiving and supplier returns

Complete the inbound purchasing workflow around existing purchase orders. This prompt is standalone and does not depend on another super-prompt for missing requirements.

Allow warehouse staff to receive all or part of a purchase order, record actual quantities and discrepancies, and keep ordered, received, outstanding, and closed quantities accurate. Handle duplicate delivery references and retries idempotently. A receipt should create stock only after it is accepted, link stock movements to the purchase order and receipt, and retain supplier and warehouse provenance. Support returning accepted goods to the supplier with reason, quantity, and outbound movement; returned quantities must not exceed eligible received stock. Define how cancelled or closed purchase orders behave.

Keep purchasing lifecycle in Procurement and stock changes in the context that owns stock control. Update `inventory-data-structure.md` using the Cellix Rosetta workflow. Add application services, persistence, GraphQL, and staff UI for receiving and returns. Test partial deliveries, over/short receipt, duplicate receipt, cancellation, return limits, and concurrent updates. Run architecture checks/build and verify a purchase order from creation through receipt and supplier return.

## Required data-structure changes

Add receipt and supplier-return records linked to purchase-order lines and stock movements:
- `PurchaseReceipt`: `organizationId`, `purchaseOrderId`, `supplierId`, `warehouseId`, optional `deliveryReference`, `status` (`DRAFT`, `ACCEPTED`, `PARTIALLY_ACCEPTED`, `CANCELLED`), `receivedByUserId`, `receivedAt`, optional `acceptedAt`, timestamps.
- Embedded `PurchaseReceiptItem[]`: `purchaseOrderItemId`, `productId`, `quantityDelivered`, `quantityAccepted`, `quantityRejected`, `unitCost`, optional discrepancy reason, and optional `stockMovementId`.
- `SupplierReturn`: `organizationId`, `purchaseOrderId`, `purchaseReceiptId`, `supplierId`, `warehouseId`, `status` (`DRAFT`, `DISPATCHED`, `CANCELLED`), `createdByUserId`, optional `dispatchedAt`, timestamps.
- Embedded `SupplierReturnItem[]`: `purchaseReceiptItemId`, `productId`, `quantity`, `reason`, and optional outbound `stockMovementId`. Preserve accepted/returned quantity totals and make receipt/return posting idempotent.

## Project context and implementation requirements

This is Inventra (`invt`), built using CellixJS patterns. Treat this feature request as a standalone prompt; do not depend on another super-prompt for missing context. Inspect the existing repository and relevant packages before changing architecture.

Before changing data structures, read `.agents/skills/cellix-rosetta/SKILL.md` and follow its translation conventions using the plain-text `inventory-data-structure.md` source; do not require a spreadsheet. Treat that file as the source of truth for business data. Update it for durable business changes, and keep the translated models, aggregates, operations, GraphQL, and persistence synchronized with it.

Keep ownership in the established bounded contexts: Organization, User, Catalog, Inventory, Partner, Procurement, and Sale. Add a separate context when the feature has distinct language, rules, or lifecycle; do not make Inventory a catch-all. Follow patterns in the CellixJS repository (`https://github.com/CellixJs/cellixjs`, checked out next to this repository) for API composition, GraphQL, persistence, frontends, and local development. Keep application services as the entry point for API operations, keep architecture-test packages synchronized using the existing per-package consumption pattern, and keep customer and staff portal responsibilities distinct.

Adapt local-development consumers to the Pathways branch `jason/worktree-port`: `@cellix/local-dev` remains policy-free and owns shared worktree port/hostname mechanics and generic runners; each app keeps a thin wrapper for its own environment keys, hostname tokens, and app-specific settings. Do not duplicate process startup, port math, or worktree hostname mechanics in apps.

## Vercel Board task planning

When the user selects this prompt for execution or asks to queue it, consult `.agents/skills/board/SKILL.md` and use the `zenvium` team scope and `inventra/dev` channel. Break the full feature into as many Board tasks as needed; there is no fixed task count. Create self-contained task briefs with owned paths or scope, completion criteria, and proof. Use task dependencies for required sequencing, let independent tasks run in parallel, and avoid overlapping file ownership for concurrent tasks. Keep task-specific updates and results in task threads; subagents should use `inventra/dev` for coordination outside their individual task work. Follow the Board skill for command details and agent identity. Include data-structure and Cellix Rosetta work in the task graph, sequencing it before dependent implementation tasks or combining it with tightly coupled work.
