import { describe, expect, it } from 'vitest';
import { formatViolations } from '../architecture-violation.ts';
import { type TimerOperationsLayoutConfig, checkTimerOperationsLayout } from '../checks/timer-operations-layout.ts';

/** The handler paths the caller passes. An empty `files` list passes. */
export function describeTimerOperationsLayoutTests(config: TimerOperationsLayoutConfig): void {
	describe('Timer operation layout', () => {
		it('each enrolled timer reads its schedule from the environment and calls the application service', async () => {
			expect(formatViolations(await checkTimerOperationsLayout(config))).toEqual([]);
		});
	});
}
