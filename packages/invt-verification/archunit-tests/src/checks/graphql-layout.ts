import path from 'node:path';
import { type ArchitectureViolation, violation } from '../architecture-violation.ts';
import { rule } from '../rule.ts';
import { fileExists, readText } from '../read-tree.ts';
import { hasExportDefault, identifierPresent } from '../skill-members.ts';

/**
 * GraphQL files the caller names. An empty `files` list checks nothing.
 * A `.graphql` path and its `.resolvers.ts` sibling are one pair.
 */
export interface GraphqlLayoutConfig {
	files: readonly string[];
}

export async function checkGraphqlLayout(config: GraphqlLayoutConfig): Promise<ArchitectureViolation[]> {
	if (config.files.length === 0) return [];
	const violations: ArchitectureViolation[] = [];
	for (const pair of graphqlPairs(config.files)) {
		const sdl = (await fileExists(pair.graphqlPath)) ? await readText(pair.graphqlPath) : undefined;
		const resolvers = (await fileExists(pair.resolversPath)) ? await readText(pair.resolversPath) : undefined;
		violations.push(
			...(await rule('graphql.files', () => graphqlFiles(pair.graphqlFile, pair.resolversFile, sdl !== undefined, resolvers !== undefined))),
			...(await rule('graphql.sdl', () => graphqlSdl(pair.graphqlFile, sdl))),
			...(await rule('graphql.resolvers', () => graphqlResolvers(pair.resolversFile, resolvers))),
		);
	}
	return violations;
}

function graphqlPairs(files: readonly string[]): { graphqlFile: string; resolversFile: string; graphqlPath: string; resolversPath: string }[] {
	const seen = new Set<string>();
	const pairs: { graphqlFile: string; resolversFile: string; graphqlPath: string; resolversPath: string }[] = [];
	for (const filePath of files) {
		const base = path.basename(filePath);
		const stem = base.endsWith('.resolvers.ts') ? base.slice(0, -'.resolvers.ts'.length) : base.endsWith('.graphql') ? base.slice(0, -'.graphql'.length) : undefined;
		if (!stem) continue;
		const dir = path.dirname(filePath);
		const key = path.join(dir, stem);
		if (seen.has(key)) continue;
		seen.add(key);
		pairs.push({
			graphqlFile: `${stem}.graphql`,
			resolversFile: `${stem}.resolvers.ts`,
			graphqlPath: path.join(dir, `${stem}.graphql`),
			resolversPath: path.join(dir, `${stem}.resolvers.ts`),
		});
	}
	return pairs;
}

/** Rule: graphql.files. */
function graphqlFiles(graphqlFile: string, resolversFile: string, hasSdl: boolean, hasResolvers: boolean): ArchitectureViolation[] {
	const violations: ArchitectureViolation[] = [];
	if (!hasSdl) violations.push(violation('graphql.files', graphqlFile, 'An enrolled subdomain has <subdomain>.graphql beside <subdomain>.resolvers.ts.'));
	if (!hasResolvers) violations.push(violation('graphql.files', resolversFile, 'An enrolled subdomain has <subdomain>.resolvers.ts.'));
	return violations;
}

/** Rule: graphql.sdl. */
function graphqlSdl(graphqlFile: string, sdl: string | undefined): ArchitectureViolation[] {
	if (sdl === undefined) return [];
	const violations: ArchitectureViolation[] = [];
	if (!/\bextend\s+type\s+(Query|Mutation)\b/.test(sdl)) violations.push(violation('graphql.sdl', graphqlFile, 'Adds one field on extend type Query or extend type Mutation. It does not duplicate a field already there.'));
	if (!/\bid\s*:\s*(?:ID|ObjectID)!/.test(sdl)) violations.push(violation('graphql.sdl', graphqlFile, 'The subdomain type includes id: ID! or ObjectID!.'));
	return violations;
}

/** Rule: graphql.resolvers. */
function graphqlResolvers(resolversFile: string, text: string | undefined): ArchitectureViolation[] {
	if (text === undefined) return [];
	const violations: ArchitectureViolation[] = [];
	if (!identifierPresent(text, 'applicationServices')) violations.push(violation('graphql.resolvers', resolversFile, 'A resolver calls context.applicationServices.<Context>.<Subdomain>.'));
	if (identifierPresent(text, 'withScopedTransaction') || identifierPresent(text, 'UnitOfWork')) violations.push(violation('graphql.resolvers', resolversFile, 'The resolver calls the application service. It does not open a unit of work.'));
	if (!hasExportDefault(text)) violations.push(violation('graphql.resolvers', resolversFile, 'Exports the resolvers object as default.'));
	return violations;
}
