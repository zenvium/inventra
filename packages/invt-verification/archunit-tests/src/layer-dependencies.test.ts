import { readdir, readFile, stat } from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { describeLayerDependencyTests } from './test-suites/layer-dependencies.ts';

/**
 * Cross-package import boundaries. Each layer suite is consumed by its own package.
 * The roots are the domain package that contains domain/contexts, and the sibling packages beside it.
 */
const domainRoot = await findDomainRoot(path.dirname(fileURLToPath(import.meta.url)));
const domainPackage = path.dirname(domainRoot);
const scope = await packageScope(domainPackage);

describeLayerDependencyTests({
	domainRoot,
	persistenceRoot: path.join(path.dirname(domainPackage), 'persistence', 'src'),
	applicationServicesRoot: path.join(path.dirname(domainPackage), 'application-services', 'src'),
	modelsRoot: path.join(path.dirname(domainPackage), 'data-sources-mongoose-models', 'src'),
	scope,
});

async function findDomainRoot(start: string): Promise<string> {
	const workspace = await findWorkspace(start);
	const found: string[] = [];
	await walk(path.join(workspace, 'packages'), found);
	if (found.length === 0) await walk(workspace, found);
	if (found.length !== 1) {
		throw new Error(found.length === 0 ? 'domain/contexts was not found above the archunit tests' : `More than one domain/contexts: ${found.join(', ')}`);
	}
	return found[0] as string;
}

async function walk(directory: string, found: string[]): Promise<void> {
	let entries;
	try {
		entries = await readdir(directory, { withFileTypes: true });
	} catch {
		return;
	}
	if (entries.some((entry) => entry.isDirectory() && entry.name === 'domain') && (await exists(path.join(directory, 'domain', 'contexts')))) {
		found.push(directory);
		return;
	}
	for (const entry of entries) {
		if (!entry.isDirectory() || entry.name === 'node_modules' || entry.name === 'dist' || entry.name === '.git') continue;
		await walk(path.join(directory, entry.name), found);
	}
}

async function findWorkspace(start: string): Promise<string> {
	let current = start;
	for (;;) {
		if (await exists(path.join(current, 'pnpm-workspace.yaml'))) return current;
		const parent = path.dirname(current);
		if (parent === current) throw new Error('pnpm-workspace.yaml was not found above the archunit tests');
		current = parent;
	}
}

async function packageScope(domainPackage: string): Promise<string> {
	const manifest = JSON.parse(await readFile(path.join(domainPackage, 'package.json'), 'utf8')) as { name?: string };
	const name = manifest.name ?? '';
	const parts = name.split('/');
	if (parts.length < 2 || !parts[0]) throw new Error(`The domain package name has no scope: ${name}`);
	return parts.slice(0, -1).join('/');
}

async function exists(filePath: string): Promise<boolean> {
	try {
		await stat(filePath);
		return true;
	} catch {
		return false;
	}
}
