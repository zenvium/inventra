# Implement CSV import/export and external integrations

Add reliable data exchange for products, stock, purchase orders, and sales, then establish an integration boundary for accounting, ecommerce, and shipping providers. This prompt is standalone and does not depend on another super-prompt for missing requirements.

Start with explicit CSV templates, validation-only preview, row-level errors, idempotent import, and an import summary. Export only authorized fields and use stable identifiers. Define versioning and mapping rules rather than silently guessing columns. For provider integrations, use adapters and durable external identifiers, retries, idempotency keys, and observable failure states; do not couple domain models directly to a vendor SDK. Never expose credentials in logs or user-visible errors. Implement one real provider only when configuration and credentials are already available; otherwise create a tested adapter boundary and document the next setup requirement.

Keep integration concerns in an appropriate Integration context/package and preserve Catalog, Sale, Procurement, and Inventory ownership. Update the data structure and apply Cellix Rosetta as needed. Test malformed files, duplicate imports, partial failures, retry safety, mappings, and permissions. Run architecture checks/build and verify a full sample import/export locally.

## Required data-structure changes

Define durable import tracking and provider identity without storing credentials in business records:
- Add `ImportJob`: `organizationId`, `resourceType` (`PRODUCT`, `STOCK`, `PURCHASE_ORDER`, `SALES_ORDER`), `fileName`, `status` (`PREVIEWED`, `READY`, `PROCESSING`, `COMPLETED`, `FAILED`), `createdByUserId`, `rowCount`, `validRowCount`, `errorRowCount`, `createdAt`, optional `completedAt`.
- Include `rowResults[]` as embedded values with `rowNumber`, optional `externalId`, `status`, and `errors[]`; each error identifies a field and message. Do not retain raw file rows unless necessary and authorized.
- Add `ExternalResourceLink` for synchronized records: `organizationId`, `provider`, `resourceType`, `internalId`, `externalId`, `syncStatus`, optional `lastSyncedAt`, timestamps. Store any credential only in a secret store and keep a non-secret `credentialReference` if required.
- Keep export history optional; add an export record only if the product needs durable audit/history, with requester, resource type, status, and timestamps.

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
