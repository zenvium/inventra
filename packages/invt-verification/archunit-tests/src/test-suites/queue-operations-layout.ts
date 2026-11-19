import { describe, expect, it } from 'vitest';
import { formatViolations } from '../architecture-violation.ts';
import { type QueueOperationsLayoutConfig, checkQueueOperationsLayout } from '../checks/queue-operations-layout.ts';

/** The handler paths the caller passes. An empty `files` list passes. */
export function describeQueueOperationsLayoutTests(config: QueueOperationsLayoutConfig): void {
	describe('Queue operation layout', () => {
		it('each enrolled queue handler calls the application service and is exported from the package index', async () => {
			expect(formatViolations(await checkQueueOperationsLayout(config))).toEqual([]);
		});
	});
}
