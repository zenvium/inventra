import { describe, expect, it } from 'vitest';
import { formatViolations } from '../architecture-violation.ts';
import { type ApiCompositionConfig, checkApiComposition } from '../checks/api-composition.ts';

/** The caller passes the composition file. In this repo that file is apps/api. */
export function describeApiCompositionTests(config: ApiCompositionConfig): void {
	describe('API composition', () => {
		it('the composition file is apps/api', async () => {
			expect(formatViolations(await checkApiComposition(config))).toEqual([]);
		});
	});
}
