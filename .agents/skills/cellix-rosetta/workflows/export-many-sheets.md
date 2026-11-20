# Export many sheets

More than one subdomain goes in one workbook. Use the subdomains the user named. When the user asked for the repo, that set is every aggregate that has a mongoose model. One subdomain stays [Export one sheet](export-single-sheet.md). Do not follow that page in the parent. Do not change the product files.

1. Find the aggregates that have a mongoose model. The user named several subdomains: those models. The user asked for the repo: every aggregate that has a mongoose model. A named subdomain with no model is left out. Say so.
2. Dispatch one subagent per model. Start them together. Do not resume a subagent. Each subagent opens only [Export one sheet](export-single-sheet.md). Pass the context and the subdomain. Tell it to return the document and not write the workbook.
3. Wait until every subagent finishes. Follow [excel/write.md](../excel/write.md) once. The file is `<identifier>-system-design-details-output.xlsx` at the repo root. `<identifier>` is `<scope>` from [file-tree.md](../file-tree.md) with the leading `@` removed. Send `{ "overviewTitle": "<dictionary title>", "documents": [ ...the documents the subagents returned ] }`. Copy `overviewTitle` from the existing dictionary when one exists. When it does not, omit the cover. Do not invent a product name. Do not save a JSON file. Models that share `contextTitle` share one Overview card.
4. Tell the user which subdomains are in the workbook and which named subdomains had no model.
