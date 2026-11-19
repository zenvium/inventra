# Compare many structures

More than one object from the supplied workbook or plain-text structure. Use the objects the user named. When the user asked to compare the complete source, that set is every object in it. One object stays [Compare one sheet](compare-single-sheet.md). Do not follow that page in the parent. Do not write or edit product files. The markdown report is the only file this workflow writes.

1. [Read the dictionary](../SKILL.md#read-the-dictionary) through the supplied source's context and object list. Do not build a shape for each object here.
2. Dispatch one subagent per object in that set. Start them together. Do not resume a subagent. Each subagent opens only [Compare one sheet](compare-single-sheet.md). Pass the source text or workbook path, context, and object identity. Tell it to return its section and not write the report.
3. Wait until every subagent finishes. Write one markdown report beside the input file when there is one, or `<source-name>-differences.md` at the repo root for pasted text. Assemble it with the outline on [Compare one sheet](compare-single-sheet.md). The opening match sentence names every object whose section was empty. The reply to the user is that same report. Do not add a second summary.
