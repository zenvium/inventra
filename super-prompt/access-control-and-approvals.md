# Implement role-based access and approvals

Add role-based permissions and approval flows for high-impact inventory and order actions. This prompt is standalone and does not depend on another super-prompt for missing requirements.

Inventory current authentication, Organization, and User models before defining roles. Use organization-scoped authorization and deny by default. Define a small permission matrix for actions such as adjustments, count posting, transfer dispatch/receipt, purchase-order approval, and return disposition. Enforce permissions in application services, not only in the UI or GraphQL resolver. Support configurable approval thresholds where justified, pending/approved/rejected states, approver identity, reason, timestamps, and immutable decision history. Prevent self-approval when the policy requires separation of duties, and ensure retries cannot execute an approved action twice.

Keep identity and organization membership in their existing contexts; action-specific approval ownership may warrant a separate context. Update the data structure using Cellix Rosetta. Implement persistence, application services, GraphQL, and staff UI affordances. Test cross-organization access, denied actions, approval transitions, self-approval, revoked permissions, and duplicate execution. Run architecture checks/build and verify both allowed and denied flows locally.

## Required data-structure changes

Update the role/permission structure and add approval records:
- `Permission` accepted values for adjustment posting, count posting, transfer dispatch/receipt, purchase-order approval, and return disposition.
- If role permissions are organization-configurable, add `OrganizationRolePolicy`: `organizationId`, `role`, `permissions[]`, `createdAt`, `updatedAt`. If the permission matrix is fixed, keep it in code and do not persist a redundant policy model.
- Add `ApprovalPolicy`: `organizationId`, `actionType`, optional `thresholdAmount` and `thresholdQuantity`, `requiredApprovals`, `preventSelfApproval`, `isActive`, timestamps.
- Add `ApprovalRequest`: `organizationId`, `actionType`, `resourceType`, `resourceId`, `requestedByUserId`, `reason`, `status` (`PENDING`, `APPROVED`, `REJECTED`, `CANCELLED`), `requestedAt`, optional `resolvedAt`, and append-only `decisions[]`.
- Each embedded `ApprovalDecision` records `approverUserId`, `outcome` (`APPROVED` or `REJECTED`), optional `reason`, and `decidedAt`. Keep decisions immutable and make execution idempotent by approval request/resource identity.

## Project context and implementation requirements

This is Inventra (`invt`), built using CellixJS patterns. Treat this feature request as a standalone prompt; do not depend on another super-prompt for missing context. Inspect the existing repository and relevant packages before changing architecture.

Before changing data structures, read `.agents/skills/cellix-rosetta/SKILL.md` and follow its translation conventions using the plain-text `inventory-data-structure.md` source; do not require a spreadsheet. Treat that file as the source of truth for business data. Update it for durable business changes, and keep the translated models, aggregates, operations, GraphQL, and persistence synchronized with it.

Keep ownership in the established bounded contexts: Organization, User, Catalog, Inventory, Partner, Procurement, and Sale. Add a separate context when the feature has distinct language, rules, or lifecycle; do not make Inventory a catch-all. Follow patterns in the CellixJS repository (`https://github.com/CellixJs/cellixjs`, checked out next to this repository) for API composition, GraphQL, persistence, frontends, and local development. Keep application services as the entry point for API operations, keep architecture-test packages synchronized using the existing per-package consumption pattern, and keep customer and staff portal responsibilities distinct.

Adapt local-development consumers to the Pathways branch `jason/worktree-port`: `@cellix/local-dev` remains policy-free and owns shared worktree port/hostname mechanics and generic runners; each app keeps a thin wrapper for its own environment keys, hostname tokens, and app-specific settings. Do not duplicate process startup, port math, or worktree hostname mechanics in apps.

## Vercel Board task planning

When the user selects this prompt for execution or asks to queue it, consult `.agents/skills/board/SKILL.md` and use the `zenvium` team scope and `inventra/dev` channel. Break the full feature into as many Board tasks as needed; there is no fixed task count. Create self-contained task briefs with owned paths or scope, completion criteria, and proof. Use task dependencies for required sequencing, let independent tasks run in parallel, and avoid overlapping file ownership for concurrent tasks. Keep task-specific updates and results in task threads; subagents should use `inventra/dev` for coordination outside their individual task work. Follow the Board skill for command details and agent identity. Include data-structure and Cellix Rosetta work in the task graph, sequencing it before dependent implementation tasks or combining it with tightly coupled work.
