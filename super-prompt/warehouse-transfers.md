# Implement warehouse transfers

Implement a complete workflow for moving stock between warehouses. This prompt is standalone and does not depend on another super-prompt for missing requirements.

Inspect existing Warehouse, Inventory, Stock Movement, and authorization models first. Define transfer lifecycle and invariants before coding: draft, submitted, dispatched, received, partially received, cancelled, and any exception states needed. A dispatch must reduce source available stock and record in-transit quantities; receipt must increase destination stock only for quantities actually received. Prevent negative or duplicate movements and retain an auditable link to the transfer. Support partial receipt and damage/shortage recording.

Keep warehouse identity and stock ownership consistent across contexts. Place the transfer aggregate and rules in the context that best owns this lifecycle; do not turn Inventory into a catch-all. Update `inventory-data-structure.md` and translate the model with the Cellix Rosetta workflow. Implement application services, persistence, GraphQL operations, staff portal screens, and authorization using existing patterns. Add tests for state transitions, partial receipt, quantities, duplicate requests, and unauthorized actions. Verify build, architecture checks, and a working local API/UI flow.

## Required data-structure changes

Add a transfer aggregate and line items that preserve quantities and movement history:
- `WarehouseTransfer`: `organizationId`, `sourceWarehouseId`, `destinationWarehouseId`, `status` (`DRAFT`, `SUBMITTED`, `DISPATCHED`, `PARTIALLY_RECEIVED`, `RECEIVED`, `CANCELLED`, `EXCEPTION`), `createdByUserId`, optional `dispatchedByUserId` and `receivedByUserId`, `createdAt`, optional `submittedAt`, `dispatchedAt`, `receivedAt`, `updatedAt`.
- Embedded `WarehouseTransferItem[]`: `productId`, optional `sourceLocationId` and `destinationLocationId`, `quantityRequested`, `quantityDispatched`, `quantityReceived`, `quantityDamaged`, optional reason, and references to outbound/inbound `stockMovementId` values.
- Define how in-transit quantities are represented and reconciled with `Inventory`; prevent double posting by making each dispatch and receipt movement attributable to its transfer line.

## Project context and implementation requirements

This is Inventra (`invt`), built using CellixJS patterns. Treat this feature request as a standalone prompt; do not depend on another super-prompt for missing context. Inspect the existing repository and relevant packages before changing architecture.

Before changing data structures, read `.agents/skills/cellix-rosetta/SKILL.md` and follow its translation conventions using the plain-text `inventory-data-structure.md` source; do not require a spreadsheet. Treat that file as the source of truth for business data. Update it for durable business changes, and keep the translated models, aggregates, operations, GraphQL, and persistence synchronized with it.

Keep ownership in the established bounded contexts: Organization, User, Catalog, Inventory, Partner, Procurement, and Sale. Add a separate context when the feature has distinct language, rules, or lifecycle; do not make Inventory a catch-all. Follow patterns in the CellixJS repository (`https://github.com/CellixJs/cellixjs`, checked out next to this repository) for API composition, GraphQL, persistence, frontends, and local development. Keep application services as the entry point for API operations, keep architecture-test packages synchronized using the existing per-package consumption pattern, and keep customer and staff portal responsibilities distinct.

Adapt local-development consumers to the Pathways branch `jason/worktree-port`: `@cellix/local-dev` remains policy-free and owns shared worktree port/hostname mechanics and generic runners; each app keeps a thin wrapper for its own environment keys, hostname tokens, and app-specific settings. Do not duplicate process startup, port math, or worktree hostname mechanics in apps.

## Vercel Board task planning

When the user selects this prompt for execution or asks to queue it, consult `.agents/skills/board/SKILL.md` and use the `zenvium` team scope and `inventra/dev` channel. Break the full feature into as many Board tasks as needed; there is no fixed task count. Create self-contained task briefs with owned paths or scope, completion criteria, and proof. Use task dependencies for required sequencing, let independent tasks run in parallel, and avoid overlapping file ownership for concurrent tasks. Keep task-specific updates and results in task threads; subagents should use `inventra/dev` for coordination outside their individual task work. Follow the Board skill for command details and agent identity. Include data-structure and Cellix Rosetta work in the task graph, sequencing it before dependent implementation tasks or combining it with tightly coupled work.
