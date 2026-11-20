---
name: cellix-rosetta
description: >
  Translate a data-dictionary workbook into Cellix subdomain files, and those
  files back into the workbook. Use when the user mentions a data dictionary,
  a Properties column, a local .xlsx path, <project>-system-design, or asks
  to add, remove, change, or validate fields on an aggregate, value object,
  or entity against the sheet, or to add a query, mutation, GraphQL field,
  queue handler, or timer. The workbook may belong to any product that uses
  this sheet layout. A Google Sheet or SharePoint URL is not an input.
  The agent writes the files.
---

# Cellix rosetta

One job, one workflow. Open that file and follow it. Do not open the other workflow files. Do not assume a product name. Tokens (`<context>`, `<subdomain>`, `<field>`) are filled from the sheet. Their definitions, and how to find the package folders, are the first section of [file-tree.md](file-tree.md). Do not read `factory.json`.

A workflow name is a verb, then `single` or `many`, then the noun. `single` is one sheet. `many` is more than one sheet, not the rest of the workbook. Import, update, compare, and export each have both. Import brings a dictionary sheet into code. Export writes code back into the dictionary. An add name is `add-<transport>-operation`.

- [import-single-sheet](workflows/import-single-sheet.md) — one object sheet with no aggregate becomes the subdomain files
- [import-many-sheets](workflows/import-many-sheets.md) — more than one new object sheet; one subagent per sheet, then the shared files
- [update-single-sheet](workflows/update-single-sheet.md) — one existing aggregate changes to match its sheet
- [update-many-sheets](workflows/update-many-sheets.md) — more than one existing aggregate; one subagent per sheet, then any shared-file member
- [compare-single-sheet](workflows/compare-single-sheet.md) — one sheet; write `<workbook>-differences.md` beside the workbook, reply with that report, then stop
- [compare-many-sheets](workflows/compare-many-sheets.md) — more than one sheet; one subagent per sheet, then that same report
- [export-single-sheet](workflows/export-single-sheet.md) — one subdomain becomes one object sheet
- [export-many-sheets](workflows/export-many-sheets.md) — more than one subdomain; one subagent per subdomain, then one workbook that holds those sheets
- [add-graphql-operation](workflows/add-graphql-operation.md) — add one query or mutation the user named
- [add-queue-operation](workflows/add-queue-operation.md) — add one command the user named, as a queue handler
- [add-timer-operation](workflows/add-timer-operation.md) — add one command the user named, as a timer

## Read the dictionary

Every workflow that uses the workbook starts here. The caller passes a local `.xlsx` path. A request that only asks what the sheet contains stops after this section.

Follow [excel/read.md](excel/read.md) through the Excel MCP. Do not read [setup.md](setup.md). That page is for the user.

Writing the workbook follows [excel/write.md](excel/write.md). One subdomain writes from [workflows/export-single-sheet.md](workflows/export-single-sheet.md). More than one writes from [workflows/export-many-sheets.md](workflows/export-many-sheets.md).

## When a files/ sample and the repo disagree

The repo wins for a file that already exists. Add the member in the declaration style that file uses. The sample in a `files/` page is the body of a file that does not exist yet.

A subdomain named `role`, or whose name ends in `-role`, follows [files/domain/role.aggregate.md](files/domain/role.aggregate.md).
