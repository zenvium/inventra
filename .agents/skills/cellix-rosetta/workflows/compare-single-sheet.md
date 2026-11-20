# Compare one sheet

Compare the object sheet with the repo and write what differs. Stop. Do not write or edit product files. The markdown report is the only file this workflow writes. More than one object sheet is [Compare many sheets](compare-many-sheets.md). Stop and open that page.

1. [Read the dictionary](../SKILL.md#read-the-dictionary) by following [excel/read.md](../excel/read.md): contexts, then shape. Read [field-types.md](../field-types.md) so each node is a value object, an entity, or a scalar before you compare.
2. Open the code at the paths in [field-edits.md](../field-edits.md) under "Find the files". Read `<Subdomain>Props`, each nested props interface, and the mongoose schema. The folder context can differ from the Overview header. Use the aggregate that exists. Do not follow "Add", "Remove", or "Change a type".
3. A parent that is comparing several sheets tells you to return the section and not write the report. Return that section and stop. Otherwise write the mismatch list to a markdown file in the same directory as the workbook. The file name is the workbook file name with `.xlsx` replaced by `-differences.md`. The reply to the user is that same report. Do not add a second summary.

The report uses this outline.

```markdown
# Differences: <workbook file name>

Compared each object sheet with its mongoose schema, and with `<Subdomain>Props` where an aggregate exists. Root `_id`, `schemaVersion`, `createdAt`, and `updatedAt` are not fields in this comparison. <Name any sheet that has no Properties row, and say it is not an object sheet.>

These sheets match their mongoose schemas: **<sheet>**, **<sheet>**.

## <Sheet title>

<One or two sentences: what matches, which collection, and whether the props are a different shape.>

- type differs `<path>`: sheet `<sheet type>`, code `<code type>`
- missing in code `<path>` (`<sheet type>`)
- extra in code `<path>` (`<code type>`)
- nesting differs `<path>`: sheet `<{` or `[{` with or without `_id`>, code `<_id present or absent, or the props type>`
```

A sheet with no mismatches does not get a section. Name it in the opening match sentence. Bold those sheet names.

One `##` per sheet title from Overview. Two sheets that share the same mismatches may share one section. Say which collections the bullets cover.

Each bullet starts with `type differs`, `missing in code`, `extra in code`, or `nesting differs`. Quote the property path and both types. Paths that share one pair of types go on one bullet. A repeated path, such as every `providedBy`, is one bullet that names the pattern and both types.

When the mongoose schema matches and the props do not, say that in the lead sentence, then give the prop bullets. Write `props <Type>` instead of `code` on those bullets. When the props are a different shape, name the prop fields in that sentence. Do not list every document field as missing when the mongoose schema has it.

A field that is missing on the props and present on the mongoose schema is `missing in code` only in the props bullets, and the bullet says the schema still has it.

`## No aggregate` is the last section. Name the object sheets that have a mongoose model and no aggregate. Then name any object sheet that has neither. Say when a sheet is not linked from Overview.

No aggregate anywhere means say so in that section. Do not switch into [Import one sheet](import-single-sheet.md) unless the user then asks you to build it.
