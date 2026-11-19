# Update many structures

More than one object from the supplied workbook or plain-text structure whose aggregate already exists. One object stays [Update one sheet](update-single-sheet.md). Do not follow that page in the parent. A request to list the differences and stop is [Compare many sheets](compare-many-sheets.md).

1. [Read the dictionary](../SKILL.md#read-the-dictionary) through the supplied source's context and object list. Do not build a shape for each object here.
2. An object with no aggregate is not this job. Name it and leave it.
3. Dispatch one subagent per remaining object. Start them together. Do not resume a subagent. Each subagent opens only [Update one sheet](update-single-sheet.md). Pass the source text or workbook path, context, and object identity. Tell it to leave the shared files.
4. Wait until every subagent finishes. Add any shared-file member a subagent left for you. Add the member. Do not replace the file. A shared file is the same set named in [Import many sheets](import-many-sheets.md).
5. Tell the user which subdomains changed and which objects were left because they have no aggregate.
