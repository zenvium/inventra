import { describe, expect, it } from 'vitest';
import { formatViolations } from '../architecture-violation.ts';
import { checkModelsLayout, type ModelsLayoutConfig } from '../checks/models-layout.ts';

/**
 * Model rules start when `models/<subdomain>/` exists.
 * Files written directly under `models/` are outside this folder rule.
 */
export function describeModelsLayoutTests(config: ModelsLayoutConfig): void {
	describe('Mongoose model layout', () => {
		it('a model folder owns <subdomain>.model.ts, and the package index registers the factory', async () => {
			expect(formatViolations(await checkModelsLayout(config))).toEqual([]);
		});
	});
}
