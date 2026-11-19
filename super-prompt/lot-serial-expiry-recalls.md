# Implement lot, serial, expiry, and recall tracking

Add traceability for products that require lot or serial tracking, expiration dates, or recall handling. This prompt is standalone and does not depend on another super-prompt for missing requirements.

Inspect the current Product, Inventory, Warehouse, Purchase Order, and Sales Order models. Define tracking configuration per product and enforce it consistently during receiving, transfers, reservations, picking, adjustments, and returns. Track lot/serial identity and quantities by warehouse; prevent duplicate serial ownership and prevent expired or recalled stock from being allocated. Provide a recall workflow that identifies affected on-hand stock and orders/customers, supports quarantine, and records resolution. Avoid forcing tracking fields on products that do not need them.

Keep product configuration, stock traceability, and customer/supplier communication in suitable contexts. Update the data structure and use the Cellix Rosetta workflow for each new object. Add application services, persistence, GraphQL, and staff workflows; expose customer information only when appropriate. Test mixed tracking policies, duplicate serials, expiry boundaries, recall propagation, quarantine, transfers, and returns. Run architecture checks/build and verify a representative trace from receipt to shipment.

## Required data-structure changes

Add per-product tracking rules and traceable lot/serial identities:
- Extend `Product` with `trackingMode` (`NONE`, `LOT`, `SERIAL`, `LOT_AND_SERIAL`) and `trackExpiry` (boolean), with defaults that preserve existing products.
- Add `InventoryLot`: `organizationId`, `productId`, `lotNumber`, optional `supplierId` and `purchaseReceiptId`, optional `expirationDate`, `receivedAt`, and status (`ACTIVE`, `QUARANTINED`, `RECALLED`, `DEPLETED`). Extend inventory balances or receipt layers with `lotId` so lot quantities by warehouse/location are auditable.
- Add `SerializedUnit`: `organizationId`, `productId`, `serialNumber`, optional `lotId`, `warehouseId`, optional `locationId`, status (`AVAILABLE`, `RESERVED`, `SHIPPED`, `QUARANTINED`, `RECALLED`), and timestamps. Enforce serial uniqueness within the organization.
- Add `RecallCase`: `organizationId`, `reason`, `status` (`OPEN`, `INVESTIGATING`, `QUARANTINED`, `RESOLVED`), affected product and optional lot/serial identifiers, `createdByUserId`, timestamps, and resolution details. Derive affected orders/customers from traceable movements unless a durable notification record is required.

## Project context and implementation requirements

This is Inventra (`invt`), built using CellixJS patterns. Treat this feature request as a standalone prompt; do not depend on another super-prompt for missing context. Inspect the existing repository and relevant packages before changing architecture.

Before changing data structures, read `.agents/skills/cellix-rosetta/SKILL.md` and follow its translation conventions using the plain-text `inventory-data-structure.md` source; do not require a spreadsheet. Treat that file as the source of truth for business data. Update it for durable business changes, and keep the translated models, aggregates, operations, GraphQL, and persistence synchronized with it.

Keep ownership in the established bounded contexts: Organization, User, Catalog, Inventory, Partner, Procurement, and Sale. Add a separate context when the feature has distinct language, rules, or lifecycle; do not make Inventory a catch-all. Follow patterns in the CellixJS repository (`https://github.com/CellixJs/cellixjs`, checked out next to this repository) for API composition, GraphQL, persistence, frontends, and local development. Keep application services as the entry point for API operations, keep architecture-test packages synchronized using the existing per-package consumption pattern, and keep customer and staff portal responsibilities distinct.

Adapt local-development consumers to the Pathways branch `jason/worktree-port`: `@cellix/local-dev` remains policy-free and owns shared worktree port/hostname mechanics and generic runners; each app keeps a thin wrapper for its own environment keys, hostname tokens, and app-specific settings. Do not duplicate process startup, port math, or worktree hostname mechanics in apps.

## Vercel Board task planning

When the user selects this prompt for execution or asks to queue it, consult `.agents/skills/board/SKILL.md` and use the `zenvium` team scope and `inventra/dev` channel. Break the full feature into as many Board tasks as needed; there is no fixed task count. Create self-contained task briefs with owned paths or scope, completion criteria, and proof. Use task dependencies for required sequencing, let independent tasks run in parallel, and avoid overlapping file ownership for concurrent tasks. Keep task-specific updates and results in task threads; subagents should use `inventra/dev` for coordination outside their individual task work. Follow the Board skill for command details and agent identity. Include data-structure and Cellix Rosetta work in the task graph, sequencing it before dependent implementation tasks or combining it with tightly coupled work.
