import path from 'node:path';
import { type ArchitectureViolation, violation } from '../architecture-violation.ts';
import { findRoleName, isKebabName, pascalFromKebab, singularFolder } from '../names.ts';
import { rule } from '../rule.ts';
import { directoryExists, listDirectories, listFiles, readText } from '../read-tree.ts';
import { classShapes, identifierPresent } from '../skill-members.ts';
import { exportedConstNames, exportedInterfaceNames, importsFragment, mentionsWord } from '../typescript-text.ts';

/**
 * Application service tree from cellix-rosetta `file-tree.md`,
 * `files/action.md` and the two index pages. `query-by-id.ts` is a skill convenience, not a required file.
 *
 * Checked only when `contexts/<context>` or `contexts/<context>/<subdomain>` exists.
 */
export interface ApplicationServicesLayoutConfig {
	/** Application-services package `src` directory, the one that contains `contexts/`. */
	applicationServicesRoot: string;
}

/** Each context factory, then each subdomain index and its action files. query-by-id.ts is not required. */
export async function checkApplicationServicesContexts(config: ApplicationServicesLayoutConfig): Promise<ArchitectureViolation[]> {
	const contextsDir = path.join(config.applicationServicesRoot, 'contexts');
	if (!(await directoryExists(contextsDir))) return [];
	const contexts = await listDirectories(contextsDir);
	let rootIndex = '';
	let indexMissing = false;
	try {
		rootIndex = await readText(path.join(config.applicationServicesRoot, 'index.ts'));
	} catch {
		indexMissing = true;
	}
	const violations = [...(await rule('application.index', () => applicationIndex(rootIndex, indexMissing, contexts.map((context) => context.name))))];
	for (const context of contexts) {
		violations.push(...(await rule('application.context.name', () => applicationContextName(context.name))));
		violations.push(...(await checkContext(context.name, context.absolutePath)));
	}
	return violations;
}

/** Rule: application.index. */
function applicationIndex(rootIndex: string, indexMissing: boolean, contextNames: readonly string[]): ArchitectureViolation[] {
	const violations: ArchitectureViolation[] = [];
	if (indexMissing) violations.push(violation('application.index', 'index.ts', 'The package index adds each context. It does not replace forRequest.'));
	for (const name of contextNames) {
		if (rootIndex && !importsFragment(rootIndex, `./contexts/${name}/index.ts`)) {
			violations.push(violation('application.index', 'index.ts', `Imports ./contexts/${name}/index.ts and adds ${pascalFromKebab(name)} on ApplicationServices.`));
		}
	}
	return violations;
}

/** Rule: application.context.name. */
function applicationContextName(name: string): ArchitectureViolation[] {
	const violations: ArchitectureViolation[] = [];
	if (!isKebabName(name)) violations.push(violation('application.context.name', `contexts/${name}`, 'A context folder is kebab-case.'));
	const singular = singularFolder(name);
	if (singular) violations.push(violation('application.context.name', `contexts/${name}`, `A context folder is singular. ${name} is ${singular}.`));
	return violations;
}

async function checkContext(context: string, contextDir: string): Promise<ArchitectureViolation[]> {
	const relative = `contexts/${context}`;
	const pascal = pascalFromKebab(context);
	const files = await listFiles(contextDir);
	const subdomains = await listDirectories(contextDir);
	const index = files.includes('index.ts') ? await readText(path.join(contextDir, 'index.ts')) : '';
	const violations = [
		...(await rule('application.context.files', () => applicationContextFiles(relative, pascal, files))),
		...(await rule('application.context.factory', () => applicationContextFactory(relative, context, pascal, files, index, subdomains.map((subdomain) => subdomain.name)))),
	];
	for (const subdomain of subdomains) violations.push(...(await checkSubdomain(context, subdomain.name, subdomain.absolutePath)));
	return violations;
}

/** Rule: application.context.files. */
function applicationContextFiles(relative: string, pascal: string, files: readonly string[]): ArchitectureViolation[] {
	const violations: ArchitectureViolation[] = [];
	if (!files.includes('index.ts')) violations.push(violation('application.context.files', `${relative}/index.ts`, `Exports interface ${pascal}ContextApplicationService and const ${pascal}.`));
	for (const fileName of files) {
		if (fileName === 'index.ts' || fileName.endsWith('.test.ts')) continue;
		violations.push(violation('application.context.files', `${relative}/${fileName}`, 'A context folder holds index.ts and one directory per subdomain.'));
	}
	return violations;
}

/** Rule: application.context.factory. */
function applicationContextFactory(relative: string, context: string, pascal: string, files: readonly string[], index: string, subdomainNames: readonly string[]): ArchitectureViolation[] {
	if (!files.includes('index.ts')) return [];
	const violations: ArchitectureViolation[] = [];
	if (!findRoleName(exportedInterfaceNames(index), context, 'ContextApplicationService')) {
		violations.push(violation('application.context.factory', `${relative}/index.ts`, `Exports interface ${pascal}ContextApplicationService with one property per subdomain.`));
	}
	if (!findRoleName(exportedConstNames(index), context, '')) {
		violations.push(violation('application.context.factory', `${relative}/index.ts`, `Exports const ${pascal}, the factory that takes DataSources.`));
	}
	for (const name of subdomainNames) {
		if (!importsFragment(index, `./${name}/index.ts`)) violations.push(violation('application.context.factory', `${relative}/index.ts`, `References ./${name}/index.ts.`));
	}
	return violations;
}

async function checkSubdomain(_context: string, subdomain: string, subdomainDir: string): Promise<ArchitectureViolation[]> {
	const relative = `contexts/${_context}/${subdomain}`;
	const pascal = pascalFromKebab(subdomain);
	const files = await listFiles(subdomainDir);
	const directories = await listDirectories(subdomainDir);
	const violations = [
		...(await rule('application.subdomain.name', () => applicationSubdomainName(relative, subdomain))),
		...(await rule('application.subdomain.files', () => applicationSubdomainFiles(relative, files, directories.map((directory) => directory.name)))),
	];
	for (const fileName of files) {
		if (fileName === 'index.ts' || fileName === 'query-by-id.ts' || fileName.endsWith('.test.ts')) continue;
		const stem = fileName.replace(/\.ts$/, '');
		if (!fileName.endsWith('.ts') || !isKebabName(stem)) {
			violations.push(...(await rule('application.action.name', () => actionFileName(`${relative}/${fileName}`))));
			continue;
		}
		violations.push(...(await checkAction(path.join(subdomainDir, fileName), `${relative}/${fileName}`, stem)));
	}
	if (files.includes('index.ts')) {
		violations.push(...(await rule('application.subdomain.factory', async () => applicationSubdomainFactory(relative, subdomain, pascal, files, await readText(path.join(subdomainDir, 'index.ts'))))));
	}
	return violations;
}

/** Rule: application.subdomain.name. */
function applicationSubdomainName(relative: string, subdomain: string): ArchitectureViolation[] {
	const violations: ArchitectureViolation[] = [];
	if (!isKebabName(subdomain)) violations.push(violation('application.subdomain.name', relative, 'A subdomain folder is kebab-case.'));
	const singular = singularFolder(subdomain);
	if (singular) violations.push(violation('application.subdomain.name', relative, `A subdomain folder is singular. ${subdomain} is ${singular}.`));
	return violations;
}

/** Rule: application.subdomain.files. */
function applicationSubdomainFiles(relative: string, files: readonly string[], directories: readonly string[]): ArchitectureViolation[] {
	const violations: ArchitectureViolation[] = [];
	if (!files.includes('index.ts')) violations.push(violation('application.subdomain.files', `${relative}/index.ts`, 'Every subdomain writes index.ts. Named operations are extra <action>.ts files.'));
	for (const name of directories) {
		if (name !== 'features') violations.push(violation('application.subdomain.files', `${relative}/${name}`, 'The only nested directory in a subdomain is features/, for acceptance scenarios.'));
	}
	return violations;
}

/** Rule: application.subdomain.factory. */
function applicationSubdomainFactory(relative: string, subdomain: string, pascal: string, files: readonly string[], index: string): ArchitectureViolation[] {
	const violations: ArchitectureViolation[] = [];
	if (!findRoleName(exportedInterfaceNames(index), subdomain, 'ApplicationService')) {
		violations.push(violation('application.subdomain.factory', `${relative}/index.ts`, `Exports interface ${pascal}ApplicationService.`));
	}
	if (!findRoleName(exportedConstNames(index), subdomain, '')) {
		violations.push(violation('application.subdomain.factory', `${relative}/index.ts`, `Exports const ${pascal}, an arrow factory. It wires each named action.`));
	}
	for (const fileName of files) {
		if (fileName === 'index.ts' || fileName.endsWith('.test.ts')) continue;
		if (!importsFragment(index, `./${fileName}`)) violations.push(violation('application.subdomain.factory', `${relative}/index.ts`, `References ./${fileName}.`));
	}
	return violations;
}

/**
 * An action is one arrow const and at most one command interface.
 * A create or update saves inside withScopedTransaction. A query reads the readonly data source.
 * Rules: application.action.function, application.action.shape, application.action.name
 */
async function checkAction(filePath: string, relativeFile: string, stem: string): Promise<ArchitectureViolation[]> {
	const text = await readText(filePath);
	return [
		...(await rule('application.action.function', () => actionFunction(relativeFile, text))),
		...(await rule('application.action.name', () => actionName(relativeFile, stem, text))),
		...(await rule('application.action.shape', () => actionShape(relativeFile, stem, text))),
	];
}

/** Rule: application.action.name. An action file is kebab-case. */
function actionFileName(relativeFile: string): ArchitectureViolation[] {
	return [violation('application.action.name', relativeFile, 'An action file is kebab-case, the operation name.')];
}

/** Rule: application.action.function. */
function actionFunction(relativeFile: string, text: string): ArchitectureViolation[] {
	if (!mentionsWord(text, 'function')) return [];
	return [violation('application.action.function', relativeFile, 'One const, an arrow factory. The word function is not used.')];
}

/** Rule: application.action.name. */
function actionName(relativeFile: string, stem: string, text: string): ArchitectureViolation[] {
	const reads = identifierPresent(text, 'readonlyDataSource') && !identifierPresent(text, 'withScopedTransaction');
	const writes = identifierPresent(text, 'withScopedTransaction');
	const violations: ArchitectureViolation[] = [];
	if (reads && /^(create|update|delete)(-|$)/.test(stem)) violations.push(violation('application.action.name', relativeFile, 'A query name does not start with create, update, or delete.'));
	if (writes && /^(query|get|find)(-|$)/.test(stem)) violations.push(violation('application.action.name', relativeFile, 'An update name does not start with query, get, or find.'));
	return violations;
}

/** Rule: application.action.shape. */
function actionShape(relativeFile: string, stem: string, text: string): ArchitectureViolation[] {
	const violations: ArchitectureViolation[] = [];
	if (exportedConstNames(text).length !== 1) violations.push(violation('application.action.shape', relativeFile, 'Exports one const. A local helper is an unexported arrow.'));
	const interfaces = exportedInterfaceNames(text);
	if (interfaces.length > 1 || interfaces.some((name) => !name.endsWith('Command'))) {
		violations.push(violation('application.action.shape', relativeFile, 'Exports one command interface, named <Name>Command, or none when the operation takes no input.'));
	}
	if (/^(create|update|delete)(-|$)/.test(stem) && !identifierPresent(text, 'withScopedTransaction')) {
		violations.push(violation('application.action.shape', relativeFile, 'A create or update saves inside withScopedTransaction. A create calls getNewInstance. An update calls getById.'));
	}
	if (/^(query|get|find)(-|$)/.test(stem) && !identifierPresent(text, 'readonlyDataSource')) {
		violations.push(violation('application.action.shape', relativeFile, 'A query calls dataSources.readonlyDataSource.<Context>.<Subdomain>.<Subdomain>ReadRepo.'));
	}
	if (classShapes(text).length > 0) violations.push(violation('application.action.shape', relativeFile, 'An action file exports one command interface and one arrow const. It does not declare a class.'));
	return violations;
}
