import { describe, expect, it } from 'vitest';
import { formatViolations } from '../architecture-violation.ts';
import { checkDomainContextFolders, checkDomainContextsBarrel, checkDomainSystemPassports, type DomainLayoutConfig } from '../checks/domain-layout.ts';

/**
 * Domain rules for a tree that already has `domain/contexts`.
 * Each example is the file the cellix-rosetta skill writes.
 */
export function describeDomainLayoutTests(config: DomainLayoutConfig): void {
	describe('Domain layout', () => {
		it('contexts/index.ts exports every context folder, and passport.ts is the shared passport', async () => {
			expect(formatViolations(await checkDomainContextsBarrel(config))).toEqual([]);
		});

		it('a context folder keeps its permissions, visa, and passport, and each subdomain keeps the skill class members', async () => {
			expect(formatViolations(await checkDomainContextFolders(config))).toEqual([]);
		});

		it('a system passport folder has system.<context>.passport.ts for every context', async () => {
			expect(formatViolations(await checkDomainSystemPassports(config))).toEqual([]);
		});
	});
}
