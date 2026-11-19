import { describe, expect, it } from 'vitest';
import { formatViolations } from '../architecture-violation.ts';
import { checkPersistenceDomainLayout, checkPersistenceReadonlyLayout, type PersistenceLayoutConfig } from '../checks/persistence-layout.ts';

/**
 * Persistence rules for datasources/domain and datasources/readonly.
 * A context is checked because its folder exists.
 */
export function describePersistenceLayoutTests(config: PersistenceLayoutConfig): void {
	describe('Persistence layout', () => {
		it('a domain context folder holds subdomain directories, and each subdomain has an adapter, repository, and unit of work', async () => {
			expect(formatViolations(await checkPersistenceDomainLayout(config))).toEqual([]);
		});

		it('a readonly context folder holds subdomain directories, and each subdomain has a data source and a read repository', async () => {
			expect(formatViolations(await checkPersistenceReadonlyLayout(config))).toEqual([]);
		});
	});
}
