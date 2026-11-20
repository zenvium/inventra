# Update many sheets

More than one object sheet whose aggregate already exists. This is not the rest of the workbook. One sheet stays [Update one sheet](update-single-sheet.md). Do not follow that page in the parent. A request to list the differences and stop is [Compare many sheets](compare-many-sheets.md).

1. [Read the dictionary](../SKILL.md#read-the-dictionary) through contexts only. Do not build a shape for each sheet here.
2. A sheet with no aggregate is not this job. Name it and leave it.
3. Dispatch one subagent per remaining object sheet. Start them together. Do not resume a subagent. Each subagent opens only [Update one sheet](update-single-sheet.md). Pass the workbook path, the context, and the sheet. Tell it to leave the shared files.
4. Wait until every subagent finishes. Add any shared-file member a subagent left for you. Add the member. Do not replace the file. A shared file is the same set named in [Import many sheets](import-many-sheets.md).
5. Tell the user which subdomains changed and which sheets were left because they have no aggregate.
