import { readFileSync } from 'node:fs';
import type { ArchitectureViolation } from './architecture-violation.ts';

let disabledIds: ReadonlySet<string> | undefined;

function disabled(): ReadonlySet<string> {
	if (disabledIds) return disabledIds;
	const off = new Set<string>();
	try {
		const parsed = JSON.parse(readFileSync(new URL('../rules.json', import.meta.url), 'utf8')) as Record<string, Record<string, boolean>>;
		for (const [group, rules] of Object.entries(parsed)) {
			for (const [name, enabled] of Object.entries(rules)) {
				if (enabled === false) off.add(`${group}.${name}`);
			}
		}
	} catch {
		// No switch file means every rule runs.
	}
	disabledIds = off;
	return off;
}

/**
 * One call is one rule. `rules.json` groups ids by package.
 * A package key plus the rule name is the id, and false skips that function.
 * A missing id still runs.
 */
export async function rule(id: string, check: () => ArchitectureViolation[] | Promise<ArchitectureViolation[]>): Promise<ArchitectureViolation[]> {
	if (disabled().has(id)) return [];
	return await check();
}
