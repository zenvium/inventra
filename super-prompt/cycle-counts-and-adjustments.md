# Implement cycle counts and stock adjustments

Implement cycle counting for one warehouse and for selected products or locations. This prompt is standalone and does not depend on another super-prompt for missing requirements.

Support creating a count session, capturing counted quantities while preserving the system snapshot, reviewing variances, submitting the count, and posting approved adjustments. Define how concurrent stock changes are reconciled so a count does not overwrite legitimate receipts, sales, or transfers. Require an explanation for material variances, preserve before/after quantities and actor/time details, and make posting idempotent. Add configurable approval thresholds if they fit existing authorization patterns.

Place ownership with the context responsible for stock control and audit rules; keep unrelated workflows out of Inventory. Update the data structure and implement the domain, application service, persistence, GraphQL, and staff UI flow. Use the Cellix Rosetta workflow for schema changes. Cover zero variance, over/short counts, stale snapshots, approval, cancellation, duplicate posting, and permission failures. Run architecture checks and build, then verify a local count from creation through posted adjustment.

## Required data-structure changes

Add a count session with immutable system-quantity snapshots and auditable line results:
- `CycleCount`: `organizationId`, `warehouseId`, optional `locationId`, `status` (`DRAFT`, `IN_PROGRESS`, `SUBMITTED`, `APPROVED`, `POSTED`, `CANCELLED`), `createdByUserId`, `snapshotAt`, timestamps, optional `submittedAt` and `postedAt`.
- Embedded `CycleCountLine[]`: `productId`, optional `locationId`, `systemQuantityAtSnapshot`, optional `countedQuantity`, optional `variance`, optional `reason`, `countedByUserId`, optional `countedAt`, and optional resulting `stockMovementId`.
- Preserve the snapshot and posted result; do not overwrite the original system quantity when inventory changes during counting. Keep approval decisions in the approval structure if that feature is present rather than duplicating them here.

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
