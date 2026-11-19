import { readdir, readFile } from 'node:fs/promises';
import path from 'node:path';
import { projectFiles } from 'archunit';
import { type ArchitectureViolation, violation } from '../architecture-violation.ts';
import { rule } from '../rule.ts';
import { directoryExists } from '../read-tree.ts';
import { importsSpecifier } from '../typescript-text.ts';

/**
 * Import boundaries taken from the layers the rosetta pages write into.
 * Domain files do not import persistence or mongoose.
 * Application services do not import mongoose. GraphQL, resolvers, and REST are not scanned.
 */
export interface LayerDependencyConfig {
	domainRoot: string;
	persistenceRoot: string;
	applicationServicesRoot: string;
	modelsRoot: string;
	/** Package scope from the domain package name, for example `@invt`. */
	scope: string;
}

const DOMAIN_FORBIDDEN = ['mongoose', 'mongodb'] as const;

export async function checkLayerDependencies(config: LayerDependencyConfig): Promise<ArchitectureViolation[]> {
	return [...(await rule('domain.imports', () => domainImports(config))), ...(await rule('application.imports', () => applicationImports(config)))];
}

/** Rule: domain.imports. */
async function domainImports(config: LayerDependencyConfig): Promise<ArchitectureViolation[]> {
	return [
		...(await forbiddenSpecifiers(config.domainRoot, 'domain.imports', [`${config.scope}/persistence`, `${config.scope}/application-services`, `${config.scope}/data-sources-mongoose-models`, ...DOMAIN_FORBIDDEN])),
		...(await archunitBoundary('domain.imports', config.domainRoot, config.persistenceRoot, 'persistence')),
		...(await archunitBoundary('domain.imports', config.domainRoot, config.applicationServicesRoot, 'application services')),
		...(await archunitBoundary('domain.imports', config.domainRoot, config.modelsRoot, 'mongoose models')),
	];
}

/** Rule: application.imports. */
async function applicationImports(config: LayerDependencyConfig): Promise<ArchitectureViolation[]> {
	return [
		...(await forbiddenSpecifiers(config.applicationServicesRoot, 'application.imports', ['mongoose', 'mongodb', `${config.scope}/data-sources-mongoose-models`])),
		...(await archunitBoundary('application.imports', config.applicationServicesRoot, config.modelsRoot, 'mongoose models')),
	];
}

async function forbiddenSpecifiers(root: string, rule: string, specifiers: readonly string[]): Promise<ArchitectureViolation[]> {
	if (!(await directoryExists(root))) return [];
	const violations: ArchitectureViolation[] = [];
	const files = await listTypeScriptFiles(root);
	for (const filePath of files) {
		const text = await readFile(filePath, 'utf8');
		for (const specifier of specifiers) {
			if (importsSpecifier(text, specifier)) {
				violations.push(violation(rule, path.relative(root, filePath).split(path.sep).join('/'), `Does not import '${specifier}'.`));
			}
		}
	}
	return violations;
}

async function archunitBoundary(rule: string, fromFolder: string, toFolder: string, toName: string): Promise<ArchitectureViolation[]> {
	if (!(await directoryExists(fromFolder)) || !(await directoryExists(toFolder))) return [];
	try {
		await projectFiles().inFolder(fromFolder).shouldNot().dependOnFiles().inFolder(toFolder).check();
		return [];
	} catch (error) {
		const message = error instanceof Error ? error.message : String(error);
		return [violation(rule, path.basename(fromFolder), `Does not depend on ${toName}. ${message}`)];
	}
}

async function listTypeScriptFiles(directory: string): Promise<string[]> {
	const entries = await readdir(directory, { withFileTypes: true });
	const files = await Promise.all(
		entries.map((entry) => {
			const entryPath = path.join(directory, entry.name);
			if (entry.isDirectory()) {
				if (entry.name === 'node_modules' || entry.name === 'dist') return Promise.resolve([]);
				return listTypeScriptFiles(entryPath);
			}
			if (!entry.name.endsWith('.ts') || entry.name.endsWith('.test.ts')) return Promise.resolve([]);
			return Promise.resolve([entryPath]);
		}),
	);
	return files.flat();
}
