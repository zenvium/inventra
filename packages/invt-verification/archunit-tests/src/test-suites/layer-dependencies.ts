import { describe, expect, it } from 'vitest';
import { formatViolations } from '../architecture-violation.ts';
import { checkLayerDependencies, type LayerDependencyConfig } from '../checks/layer-dependencies.ts';

/** The rosetta pages keep mongoose behind the model and persistence layers. */
export function describeLayerDependencyTests(config: LayerDependencyConfig): void {
	describe('Layer imports', () => {
		it('domain does not import persistence or mongoose, and application services do not import mongoose models', async () => {
			expect(formatViolations(await checkLayerDependencies(config))).toEqual([]);
		});
	});
}
