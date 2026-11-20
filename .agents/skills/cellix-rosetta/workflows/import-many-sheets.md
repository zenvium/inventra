# Import many sheets

More than one object sheet, each with no aggregate. This is not the rest of the workbook. One sheet stays [Import one sheet](import-single-sheet.md). Do not follow that page in the parent.

1. [Read the dictionary](../SKILL.md#read-the-dictionary) through contexts only. Do not build a shape for every sheet here.
2. A sheet that already has an aggregate is not this job. Name it and leave it.
3. Dispatch one subagent per remaining object sheet. Start them together. Do not resume a subagent. Each subagent opens only [Import one sheet](import-single-sheet.md). Pass the workbook path, the context, and the sheet. Tell it to leave the shared files.
4. Wait until every subagent finishes. Then add each new subdomain to the shared files in [file-tree.md](../file-tree.md): the context passport, visa, and domain-permissions when that context is new; `contexts/index.ts`; `<domain>/index.ts`; `<models>/index.ts`; `seed.ts`; the persistence indexes; the application-service indexes. Add the member. Do not replace the file.
5. Tell the user which subdomains were written and which sheets were left because an aggregate already exists.

A shared file is any file outside `<domain>/domain/contexts/<context>/<subdomain>/`, `<models>/models/<subdomain>/`, `<persistence>/datasources/domain/<context>/<subdomain>/`, `<persistence>/datasources/readonly/<context>/<subdomain>/`, and `<application-services>/contexts/<context>/<subdomain>/`, except the seed file `<subdomain>.ts` and a model file named `<subdomain>.model.ts`.
