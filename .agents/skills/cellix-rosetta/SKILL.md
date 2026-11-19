---
name: cellix-rosetta
description: >
  Translate a data structure supplied as plain text or a data-dictionary
  workbook into Cellix subdomain files, and translate code back into the same
  structure. Use when the user supplies a text schema, data dictionary, a
  Properties column, a local .xlsx path, <project>-system-design, or asks to
  add, remove, change, or validate fields on an aggregate, value object, or
  entity against the supplied structure, or to add a query, mutation,
  GraphQL field, queue handler, or timer. The workbook may belong to any
  product that uses this sheet layout. A Google Sheet or SharePoint URL is
  not an input. The agent writes the files.
---

# Cellix rosetta

One job, one workflow. Open that file and follow it. Do not open the other workflow files. Do not assume a product name. The source may be a workbook or plain text. Normalize either source to the same context, subdomain, collection, and property tree before translating. Tokens (`<context>`, `<subdomain>`, `<field>`) are filled from that normalized structure. Their definitions, and how to find the package folders, are the first section of [file-tree.md](file-tree.md). Do not read `factory.json`.

A workflow name is a verb, then `single` or `many`, then the noun. `single` is one object; `many` is more than one object, not the rest of the source. Import, update, compare, and export each have both. Import brings one dictionary object into code. Export writes code back into the requested source format. An add name is `add-<transport>-operation`.

- [import-single-sheet](workflows/import-single-sheet.md) — one object with no aggregate becomes the subdomain files
- [import-many-sheets](workflows/import-many-sheets.md) — more than one new object; translate each, then the shared files
- [update-single-sheet](workflows/update-single-sheet.md) — one existing aggregate changes to match its sheet
- [update-many-sheets](workflows/update-many-sheets.md) — more than one existing aggregate; one subagent per sheet, then any shared-file member
- [compare-single-sheet](workflows/compare-single-sheet.md) — one sheet; write `<workbook>-differences.md` beside the workbook, reply with that report, then stop
- [compare-many-sheets](workflows/compare-many-sheets.md) — more than one sheet; one subagent per sheet, then that same report
- [export-single-sheet](workflows/export-single-sheet.md) — one subdomain becomes one object in the requested format
- [export-many-sheets](workflows/export-many-sheets.md) — more than one subdomain becomes a workbook or plain-text outline
- [add-graphql-operation](workflows/add-graphql-operation.md) — add one query or mutation the user named
- [add-queue-operation](workflows/add-queue-operation.md) — add one command the user named, as a queue handler
- [add-timer-operation](workflows/add-timer-operation.md) — add one command the user named, as a timer

## Read the dictionary

Every import, update, and compare workflow starts here. If the caller supplies a local `.xlsx`, follow [excel/read.md](excel/read.md). If the caller supplies plain text, follow [text-format.md](text-format.md). Do not require a workbook when the user has supplied the structure in text. Normalize both inputs to the same shape before applying [field-types.md](field-types.md). A request that only asks what the source contains stops after reading it.

Follow [excel/read.md](excel/read.md) through the Excel MCP for workbook input. Do not read [setup.md](setup.md). That page is for the user.

Writing a workbook follows [excel/write.md](excel/write.md). Plain-text exports use the Markdown outline in [text-format.md](text-format.md). One subdomain writes from [workflows/export-single-sheet.md](workflows/export-single-sheet.md). More than one writes from [workflows/export-many-sheets.md](workflows/export-many-sheets.md).

## When a files/ sample and the repo disagree

The repo wins for a file that already exists. Add the member in the declaration style that file uses. The sample in a `files/` page is the body of a file that does not exist yet.

A subdomain named `role`, or whose name ends in `-role`, follows [files/domain/role.aggregate.md](files/domain/role.aggregate.md).
