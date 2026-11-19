import { describe, expect, it } from 'vitest';
import { formatViolations } from '../architecture-violation.ts';
import { type ApplicationServicesLayoutConfig, checkApplicationServicesContexts } from '../checks/application-services-layout.ts';

/**
 * Application service rules for a tree that already has `contexts/<context>`.
 */
export function describeApplicationServicesLayoutTests(config: ApplicationServicesLayoutConfig): void {
	describe('Application service layout', () => {
		it('each context factory lists its subdomains, and each subdomain has index.ts plus one const per action', async () => {
			expect(formatViolations(await checkApplicationServicesContexts(config))).toEqual([]);
		});
	});
}
