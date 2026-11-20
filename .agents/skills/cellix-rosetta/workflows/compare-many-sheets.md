# Compare many sheets

More than one object sheet. This is not the rest of the workbook. Use the sheets the user named. When the user asked for the workbook, that set is every object sheet. One sheet stays [Compare one sheet](compare-single-sheet.md). Do not follow that page in the parent. Do not write or edit product files. The markdown report is the only file this workflow writes.

1. [Read the dictionary](../SKILL.md#read-the-dictionary) through contexts only. Do not build a shape for each sheet here.
2. Dispatch one subagent per object sheet in that set. Start them together. Do not resume a subagent. Each subagent opens only [Compare one sheet](compare-single-sheet.md). Pass the workbook path, the context, and the sheet. Tell it to return its section and not write the report.
3. Wait until every subagent finishes. Write one markdown file in the same directory as the workbook. The file name is the workbook file name with `.xlsx` replaced by `-differences.md`. Assemble it with the outline on [Compare one sheet](compare-single-sheet.md). The opening match sentence names every sheet whose section was empty. The reply to the user is that report. Do not add a second summary.
