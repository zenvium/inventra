# Plain-text data structure

Use this page when the user provides the data structure in prose, Markdown, a pasted outline, or another plain-text form instead of an `.xlsx` workbook. The text is the source of truth for the requested translation. Do not ask for a spreadsheet just because the workbook workflows mention sheets.

## Normalize the input

Extract one or more records with a context, subdomain, collection, and ordered property tree. Accept equivalent labels and ordinary prose; the example below is a helpful format, not a required template. Preserve names and stated constraints exactly. Infer only conventional forms explicitly covered here, such as converting a displayed context `Item Detail` to `item-detail` and a camelCase subdomain `itemDetail` to `item-detail`.

```markdown
# Inventory

## Product
Collection: products

### Properties
- `_id` — `ObjectId; required; unique; system-generated`
- `schemaVersion` — `string; default: 1.0.0; system-populated`
- `sku` — `string; required` | Recommended: `trim; minLength: 1`
- `tags []` — `string; optional`
- `shippingAddress {`
  - `street` — `string; required`
  - `coordinates [{`
    - `latitude` — `number; required`
  - `}]`
- `}`
```

The headings identify context and subdomain; the collection line is optional when it can be read from the existing model, and is required when creating a model. If context or subdomain is omitted, use an explicit name supplied by the user or infer it from the named code location. If neither is available, ask for the missing name. Do not invent a collection name.

Each property line carries the property name and its DataType clauses. Use the same clauses and interpretation as [sheet-layout.md](sheet-layout.md). `[]`, `{`, `[{`, `}`, and `}]` preserve the sheet's scalar-array, value-object, collection, and nesting semantics. `Recommended`, `Rules / Notes`, `Legal Review Classification`, and `Legal Review Reason` may be supplied inline or as indented attributes; keep them attached to that property. They do not change its TypeScript type except for the recommendations already defined in [field-types.md](field-types.md).

Text may instead state the same facts in prose, for example “Product has a required string sku and an optional list of string tags.” Convert only unambiguous statements into the normalized structure. Keep unsupported or unclear requirements as notes and ask only when the ambiguity changes the code shape, type, or required behavior. Never silently turn examples into constraints or make up accepted values, defaults, references, permissions, or collection names.

## Preserve the translation

After normalization, use the exact same import, update, compare, and field-type rules as workbook input. Plain text changes the source format, not the Cellix mapping. In particular, preserve path order, optionality, nested value/entity distinctions, `ObjectId` handling, accepted values, and constrained-string recommendations. Fields such as root `_id`, `schemaVersion`, and timestamps retain the special handling in [field-types.md](field-types.md).

If the user asks to export code to plain text, emit this Markdown outline with the same DataType clauses. Include context, subdomain, collection, and every schema path in order. Add nested `_id` only for entity collections. Do not add a role matrix or invent legal review values. If the user asks for a workbook export, keep using the existing Excel writer.
