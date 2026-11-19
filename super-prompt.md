Consider the following things:

The project data structure is detailed in inventory-data-structure.md. Follow the import many sheets workflow for this document from the cellix-rosetta skill.

The identifier for this project is invt.

We should keep the same technology below for the detailed cellixjs application.

Ensure that the arch unit test package is properly synced up to this repo, following the individual package cosumption pattern. 

For API setup, and extrneous details, look at the https://github.com/CellixJs/cellixjs repository, which is also available locally at the same level as this repo. Follow the general setup beyond the details done in the above text by the cellix-rosetta skill workflow.

Ensure that the worktree pattern is adapted properly from local-dev: Adapt this project's local-dev consumption to match branch `jason/worktree-port` in Pathways. `@cellix/local-dev` stays policy-free. Each app keeps a thin wrapper and stops owning process, port, and worktree mechanics.

## What the shared package owns

Worktree port offset, Mongo port, Azurite ports and storage directories, `.localhost` suffixing, complete `http(s)://` and `mongodb://` rewriting, `PORT` offset, dotenv and JSON reads, child exit forwarding, workspace-root discovery, and the runners: Vite, Docusaurus, Node, Azure Functions, Azurite.

It does not own app env-key names, product hostnames, auth routes, or the shape of `local.settings.json`. Do not add a helper there that only one app needs.

## What an app wrapper owns

A `start-dev.ts` that reads that app's env or settings, applies only that app's hostname token, and starts one runner. Import file helpers from `@cellix/local-dev/files` when that is all you need.

Vite:

```ts
import { isE2E, ViteDevRunner } from '@cellix/local-dev';
import { readDotEnv } from '@cellix/local-dev/files';

const settings = {
  ...readDotEnv('.env'),
  ...(isE2E() ? readDotEnv('.env.e2e') : {}),
};
new ViteDevRunner({ settings }).start();


For serenityjs, follow the pattern in cellixjs repo, while minimal - dont actually make tests yet, just make the basic infrasetup for it. follow the minimal approach detailed above for the local-dev integration for worktree logic: Adapt local-dev consumption to match Pathways branch `jason/worktree-port`. `@cellix/local-dev` stays policy-free. Apps and end-to-end tests keep thin wrappers. They do not own process startup, port math, or worktree hostname suffixing.

## What the shared package owns

Worktree port offset, Mongo port (`50000` plus the offset), Azurite blob/queue/table ports (`10000`/`10001`/`10002` plus the offset), `.localhost` suffixing, rewriting a value only when the whole string is an `http(s)://` or `mongodb://` URL, offsetting `PORT`, dotenv and JSON reads, `isE2E`, child exit forwarding, workspace-root discovery, and the runners: Vite, Docusaurus, Node, Azure Functions, Azurite.

A named worktree hashes to one of 49 buckets, offsets `100` through `4900`. No `WORKTREE_NAME` means offset `0`.

The package does not own app env-key names, product hostnames, auth routes, or the shape of `local.settings.json`. Do not add a helper there that only one app needs.

## What an app wrapper owns

`start-dev.ts` reads that app's env, applies only that app's hostname token, and starts one runner. Import file helpers from `@cellix/local-dev/files`.

Vite and the OAuth mock merge `.env.e2e` over `.env` when `isE2E()` is true (`E2E` is `1`, `true`, or `yes`), then:

```ts
new ViteDevRunner({ settings }).start();
```

For the frontend - following cellixjs patterns from the above repo, design and implement a basic frontend for a single portal for customer login, but design your own front end look based on what you think would fit this product - however follow the front end patterns from cellixjs. We only want two portals for now, customer portal and staff portal.


Once this process is complete we should have a basic setup for this project, following the desired architectural design. 
