# `<subdomain>.value-objects.ts`

Path: `<domain>/domain/contexts/<context>/<subdomain>/<subdomain>.value-objects.ts`

One class per root string that has a length or a pattern. The class body stays empty. A plain string assigns the argument in the setter and does not get a class. Omit this file when every root string is plain.

A required `<field>`:

```ts
import { VOString } from '@lucaspaganini/value-objects';

export class <Field> extends VOString({
	trim: <trim>,
	minLength: <minLength>,
	maxLength: <maxLength>,
}) {}
```

An optional `<field>`:

```ts
import { VOOptional, VOString } from '@lucaspaganini/value-objects';

class <Field>Base extends VOString({
	trim: <trim>,
	minLength: <minLength>,
	maxLength: <maxLength>,
}) {}
export class <Field> extends VOOptional(<Field>Base, [null]) {}
```

Include only the options Recommended Datatype names. Add `pattern` only when that cell already contains a regex. Do not fill in `trim: true`, `minLength: 1`, or `maxLength: 200` when the cell does not say them.
