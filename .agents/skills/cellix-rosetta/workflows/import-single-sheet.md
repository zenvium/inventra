# Import one structure

Turn one object from a workbook or plain-text structure into the full file tree: domain, model, persistence, readonly, and `query-by-id`. The aggregate file does not exist anywhere in the repo. GraphQL stays off this path until the user names that transport. More than one object is [Import many sheets](import-many-sheets.md). Stop and open that page.

1. [Read the dictionary](../SKILL.md#read-the-dictionary) from the supplied source. For workbook input, follow [excel/read.md](../excel/read.md); for plain text, follow [text-format.md](../text-format.md). Normalize context, subdomain, collection, and the field tree.
2. Read [field-types.md](../field-types.md). It decides value object, entity, and scalar for each node.
3. Read [file-tree.md](../file-tree.md). Write the Domain, Model, Seed, and Persistence files, plus `query-by-id.ts` and the application barrels. Do not write `<action>.ts`. The sample is the body only when the file does not exist. Skip the Transports section.
4. When the context already has other subdomains, add this one to the existing passport and indexes. Do not replace those files. A parent that is building several subdomains tells you to leave the shared files. Leave them. The parent adds this subdomain after you finish. A shared file is any file that is not inside this subdomain's own directory, plus `seed.ts` and the model, domain, persistence, and application indexes. The seed file `<subdomain>.ts` and `<subdomain>.model.ts` belong to this subdomain.
5. A subdomain named `role`, or whose name ends in `-role`, uses [files/domain/role.aggregate.md](../files/domain/role.aggregate.md) for the aggregate. Write its permission files from that page. The supplied structure is not the source of those flags yet.

Finding the aggregate under a different context folder means the subdomain already exists. Switch to [Update one sheet](update-single-sheet.md).
