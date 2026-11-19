# Implement customer returns and restocking

Implement customer returns for shipped sales orders. This prompt is standalone and does not depend on another super-prompt for missing requirements.

Support return initiation against an eligible order and line, requested versus received quantities, reason codes, inspection outcome, refund or replacement disposition, and final resolution. Prevent returning more than was shipped or returning the same quantity twice. Stock must enter sellable inventory only after inspection marks it as resellable; damaged, recalled, or quarantined goods must remain unavailable. Link each return to the original order and shipment, preserve history, and make stock and financial effects idempotent. Avoid implementing accounting settlement beyond the current system's capabilities; represent its status clearly if external handling is required.

Keep the customer/order relationship in Partner and Sale as appropriate, with a distinct Returns or Fulfillment context if lifecycle complexity warrants it. Update the data structure using Cellix Rosetta. Implement application services, persistence, GraphQL, and staff/customer portal flows with proper authorization. Test eligibility, partial returns, duplicate processing, inspection outcomes, and restocking. Run architecture checks/build and verify a return locally.

## Required data-structure changes

Add an auditable return aggregate linked to the originating sale and shipment:
- `CustomerReturn`: `organizationId`, `salesOrderId`, `customerId`, optional `shipmentId`, `status` (`REQUESTED`, `AUTHORIZED`, `RECEIVED`, `INSPECTED`, `RESOLVED`, `CANCELLED`), `requestedByUserId`, timestamps, optional resolution time.
- Embedded `CustomerReturnItem[]`: `salesOrderItemId`, `productId`, `quantityRequested`, `quantityReceived`, `reasonCode`, optional `inspectionOutcome` (`RESELLABLE`, `DAMAGED`, `QUARANTINED`), `disposition` (`RESTOCK`, `SCRAP`, `REPLACE`, `REFUND`), `quantityRestocked`, optional `refundAmount`, and optional resolution note.
- Track refund/replacement processing state separately from inventory disposition if the system does not execute payment settlement. Preserve links to resulting stock movements; do not create sellable stock before inspection approves restocking.

## Project context and implementation requirements

This is Inventra (`invt`), built using CellixJS patterns. Treat this feature request as a standalone prompt; do not depend on another super-prompt for missing context. Inspect the existing repository and relevant packages before changing architecture.

Before changing data structures, read `.agents/skills/cellix-rosetta/SKILL.md` and follow its translation conventions using the plain-text `inventory-data-structure.md` source; do not require a spreadsheet. Treat that file as the source of truth for business data. Update it for durable business changes, and keep the translated models, aggregates, operations, GraphQL, and persistence synchronized with it.

Keep ownership in the established bounded contexts: Organization, User, Catalog, Inventory, Partner, Procurement, and Sale. Add a separate context when the feature has distinct language, rules, or lifecycle; do not make Inventory a catch-all. Follow patterns in the CellixJS repository (`https://github.com/CellixJs/cellixjs`, checked out next to this repository) for API composition, GraphQL, persistence, frontends, and local development. Keep application services as the entry point for API operations, keep architecture-test packages synchronized using the existing per-package consumption pattern, and keep customer and staff portal responsibilities distinct.

Adapt local-development consumers to the Pathways branch `jason/worktree-port`: `@cellix/local-dev` remains policy-free and owns shared worktree port/hostname mechanics and generic runners; each app keeps a thin wrapper for its own environment keys, hostname tokens, and app-specific settings. Do not duplicate process startup, port math, or worktree hostname mechanics in apps.

## Vercel Board task planning

When the user selects this prompt for execution or asks to queue it, consult `.agents/skills/board/SKILL.md` and use the `zenvium` team scope and `inventra/dev` channel. Break the full feature into as many Board tasks as needed; there is no fixed task count. Create self-contained task briefs with owned paths or scope, completion criteria, and proof. Use task dependencies for required sequencing, let independent tasks run in parallel, and avoid overlapping file ownership for concurrent tasks. Keep task-specific updates and results in task threads; subagents should use `inventra/dev` for coordination outside their individual task work. Follow the Board skill for command details and agent identity. Include data-structure and Cellix Rosetta work in the task graph, sequencing it before dependent implementation tasks or combining it with tightly coupled work.
