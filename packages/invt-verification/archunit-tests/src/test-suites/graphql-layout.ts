import { describe, expect, it } from 'vitest';
import { formatViolations } from '../architecture-violation.ts';
import { type GraphqlLayoutConfig, checkGraphqlLayout } from '../checks/graphql-layout.ts';

/** The file paths the caller passes. An empty `files` list passes. */
export function describeGraphqlLayoutTests(config: GraphqlLayoutConfig): void {
	describe('GraphQL layout', () => {
		it('each enrolled subdomain keeps its schema and resolvers on the application service', async () => {
			expect(formatViolations(await checkGraphqlLayout(config))).toEqual([]);
		});
	});
}
