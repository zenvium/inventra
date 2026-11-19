---
name: bothy-board
description: Coordinate Inventra work through the hosted BothyBoard MCP server. Use for task planning, dependency DAGs, claiming ready work from Codex agents, registering worktrees, task mailbox communication, and reporting progress.
---

# BothyBoard for Inventra

This is an Inventra adapter for Codex workers. The upstream BothyBoard skill and API may change; use the live MCP tool schemas as the authority. Upstream references: https://bothyboard.com/skills/bothy-board/SKILL.md and https://bothyboard.com/api/mcp.

## Prerequisites and safety

- Connect the remote Streamable HTTP MCP server at https://bothyboard.com/api/mcp.
- Authenticate with a project-scoped PAT in the Authorization header as Bearer followed by the token. Never put the token in this repository, prompts, task bodies, logs, or messages.
- Before doing live board work, confirm that BothyBoard tools are available in this Codex session. If they are missing or return 401/403, stop board actions and report the exact problem without claiming success. Do not silently switch to another board integration.
- Use projects_list to find the existing Inventra project. If there is no unique match, ask the user which project to use. Never invent a project ID.
- Use live tool schemas for arguments and result shapes. Do not guess fields or identifiers.
- Only act on tasks whose projectId matches the selected Inventra project.

## Planning a prompt into tasks

When a user asks to queue or execute one of the standalone Inventra prompts:

1. Read the selected prompt and this skill. Inspect the project board and project fields first.
2. Decompose the work into the minimum useful number of tasks, as many as the prompt needs. Create a dependency DAG that captures prerequisites; leave independent tasks parallel.
3. Give each task a concise title and self-contained objective. Specify owned paths/write roots, concrete completion proof, and dependencies. Use the project's required fields.
4. Use the live BothyBoard contract for task planting. A planted task needs a valid TREE done_when contract. The contract is frozen after planting; do not invent unsupported contract fields.
5. For durable business data changes, include the plain-text inventory-data-structure.md update and follow .agents/skills/cellix-rosetta/SKILL.md. Put that work before dependent implementation tasks unless it is tightly coupled and shares ownership.
6. Avoid overlapping write roots among tasks intended to run at the same time. Do not create duplicate tasks for work already represented on the board.
7. Read back created tasks and dependencies. Report their IDs, dependency order, and any work that could not be queued.

Do not create or plant tasks merely because a prompt file is being edited or discussed. Queue work only when the user selects the prompt for execution or asks to queue it.

## Starting a manually launched Codex worker

Each Codex process is started by the user in a specific Git worktree. Keep agents isolated by giving each worktree a distinct machineName, such as inventra-main, inventra-a, or inventra-b.

1. Sync the selected project and retain the returned cacheToken. Pass it to subsequent sync/dequeue calls when required.
2. Inspect the live ready-task dequeue/claim and session-binding schemas before claiming anything. Confirm a standalone Codex worker can complete the flow without a mandatory Grok-only session bind. If the server requires a Grok session ID or Grok spawn step, do not dequeue or claim; report the incompatibility to the user.
3. Use the live BothyBoard ready-task dequeue/claim tool with the project ID and this worktree's unique machineName. This operation claims eligible planted work; it is not a monitor. Do not select arbitrary queued work from a stale snapshot.
4. If no task is returned, do not claim or invent work. Report that the queue has no ready task and stop.
5. Read the claimed task with the task retrieval tool. Its body, done_when, dependencies, and write roots are the work contract. Do not broaden the scope or edit outside the allowed roots.
6. Register this checkout with the worktree registration tool using the actual path, branch, machineName, and task ID. Do not register a path or branch that was not observed locally.
7. Continue in the already-running Codex process. Never execute a Grok spawn command. Heartbeat and check the task mailbox as directed by the live schemas while work is active. Use mailbox messages for steering and coordination, and comments for durable task updates. Do not assume a global chat channel exists.
8. If blocked, report the specific blocker through the task's supported status or mailbox tools. If the task cannot be finished, release it using the supported tool rather than letting a lease expire.
9. When implementation is ready, move it to review with evidence according to the live schema. Workers do not mark their own work landed or set owner-only proofs.

Do not invoke Grok or mint Grok session IDs from Codex. If a task flow requires either, stop before claiming work and report the limitation.

## Coordination across tasks and worktrees

- Use the mailbox attached to the relevant task for task-specific coordination.
- For a decision that affects several tasks, use a parent/coordinator task mailbox if one exists and link the decision back to affected task threads.
- BothyBoard has task mailboxes rather than a project-wide chat channel. Use a parent/coordinator task mailbox for cross-task coordination when available; otherwise route the issue through a task thread or ask the user where to coordinate.
- Keep task updates concise: what changed, what remains, evidence, and who acts next.
- In different worktrees, verify the current path and branch before editing. Never assume another worker's checkout is the same one.
