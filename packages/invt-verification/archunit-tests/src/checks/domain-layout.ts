import path from 'node:path';
import { type ArchitectureViolation, violation } from '../architecture-violation.ts';
import { camelFromKebab, findRoleName, isKebabName, isRoleSubdomain, matchesFolder, pascalFromKebab, singularFolder } from '../names.ts';
import { rule } from '../rule.ts';
import { directoryExists, fileExists, listDirectories, listFiles, readText } from '../read-tree.ts';
import { type ClassMember, type ClassShape, classShapes, constructions, constructorParameters, forNames, functionForms, identifierPresent, interfaceHeritage, interfaceNames, interfaceProperties, interfaceShape, interfacesNamed, namespaceExports } from '../skill-members.ts';
import { classBodyIsEmpty, exportedClasses, exportedInterfaceNames, hasParameterProperty, importsFragment, mentionsWord } from '../typescript-text.ts';

/**
 * Domain file tree from cellix-rosetta `file-tree.md` and the domain pages
 * under `.agents/skills/cellix-rosetta/files/`.
 *
 * A missing `domain/contexts` directory is not a failure. A context or
 * subdomain directory that exists is checked in full.
 */
export interface DomainLayoutConfig {
	/** Domain package `src` directory, the one that contains `domain/contexts`. */
	domainRoot: string;
}

const CONTEXTS = 'domain/contexts';

/** Passport, the contexts barrel, and the files allowed beside them. */
export async function checkDomainContextsBarrel(config: DomainLayoutConfig): Promise<ArchitectureViolation[]> {
	const contextsDir = path.join(config.domainRoot, 'domain', 'contexts');
	if (!(await directoryExists(contextsDir))) return [];
	const indexPath = path.join(contextsDir, 'index.ts');
	const contexts = await listDirectories(contextsDir);
	const files = await listFiles(contextsDir);
	const names = contexts.map((context) => context.name);
	const violations = [...(await rule('domain.contexts.passport', () => contextsPassport(path.join(contextsDir, 'passport.ts'))))];
	if (!(await fileExists(indexPath))) {
		violations.push(...(await rule('domain.contexts.barrel', () => contextsBarrelMissing())));
		return violations;
	}
	const index = await readText(indexPath);
	violations.push(...(await rule('domain.context.name', () => contextFolderName(names, true))));
	violations.push(...(await rule('domain.contexts.barrel', () => contextsBarrel(index, names))));
	violations.push(...(await rule('domain.contexts.files', () => contextsFiles(files))));
	return violations;
}

/**
 * contexts/passport.ts exists once any context exists and exports Passport.
 * Rule: domain.contexts.passport
 */
async function contextsPassport(passportPath: string): Promise<ArchitectureViolation[]> {
	if (!(await fileExists(passportPath))) {
		return [violation('domain.contexts.passport', `${CONTEXTS}/passport.ts`, 'contexts/passport.ts is required once any context exists. It exports Passport.')];
	}
	const passport = await readText(passportPath);
	const ownsPassport = interfaceNames(passport).includes('Passport') || classShapes(passport).some((item) => item.name.endsWith('Passport'));
	if (!ownsPassport) {
		return [violation('domain.contexts.passport', `${CONTEXTS}/passport.ts`, 'Passport is the type this file owns. Export interface Passport, or keep the existing Passport class.')];
	}
	return [];
}

/** Rule: domain.context.name. A context folder is singular kebab-case. The barrel pass adds the alias. */
function contextFolderName(names: readonly string[], withAlias: boolean, kebabMessage?: string): ArchitectureViolation[] {
	const violations: ArchitectureViolation[] = [];
	for (const name of names) {
		const relative = `${CONTEXTS}/${name}`;
		if (kebabMessage && !isKebabName(name)) violations.push(violation('domain.context.name', relative, kebabMessage));
		const singular = singularFolder(name);
		if (!singular) continue;
		const alias = withAlias ? ` The alias is ${pascalFromKebab(singular)}.` : '';
		violations.push(violation('domain.context.name', relative, `A context folder is singular. ${name} is ${singular}.${alias}`));
	}
	return violations;
}

/** Rule: domain.contexts.barrel. */
function contextsBarrelMissing(): ArchitectureViolation[] {
	return [violation('domain.contexts.barrel', `${CONTEXTS}/index.ts`, 'contexts/index.ts exports each context as `export * as <Context> from ./<context>/index.ts`.')];
}

function contextsBarrel(index: string, contextNames: readonly string[]): ArchitectureViolation[] {
	const violations: ArchitectureViolation[] = [];
	const exports = namespaceExports(index);
	for (const name of contextNames) {
		const singular = singularFolder(name);
		const match = exports.find((item) => item.from === `./${name}/index.ts`);
		if (!match) {
			const folder = singular ?? name;
			violations.push(violation('domain.contexts.barrel', `${CONTEXTS}/index.ts`, `Missing \`export * as ${pascalFromKebab(folder)} from './${folder}/index.ts'\`.`));
			continue;
		}
		if (!singular && !matchesFolder(match.alias, name)) {
			violations.push(violation('domain.contexts.barrel', `${CONTEXTS}/index.ts`, `\`${match.alias}\` does not match the folder ${name}. The alias letters must spell that folder.`));
		}
	}
	for (const item of exports) {
		const folder = item.from.replace(/^\.\//, '').replace(/\/index\.ts$/, '');
		if (!contextNames.includes(folder)) {
			violations.push(violation('domain.contexts.barrel', `${CONTEXTS}/index.ts`, `Exports './${folder}/index.ts', and that context folder is not there.`));
		}
	}
	return violations;
}

/**
 * The contexts folder holds passport.ts, index.ts, and one directory per context.
 * Rule: domain.contexts.files
 */
function contextsFiles(files: readonly string[]): ArchitectureViolation[] {
	return files
		.filter((fileName) => fileName !== 'index.ts' && fileName !== 'passport.ts')
		.map((fileName) => violation('domain.contexts.files', `${CONTEXTS}/${fileName}`, 'The contexts folder holds passport.ts, index.ts, and one directory per context.'));
}

/** Each context folder, then each subdomain under it. */
export async function checkDomainContextFolders(config: DomainLayoutConfig): Promise<ArchitectureViolation[]> {
	const contextsDir = path.join(config.domainRoot, 'domain', 'contexts');
	if (!(await directoryExists(contextsDir))) return [];
	const violations: ArchitectureViolation[] = [];
	for (const context of await listDirectories(contextsDir)) {
		violations.push(...(await rule('domain.context.name', () => contextFolderName([context.name], false, 'A context folder is kebab-case, the Overview header.'))));
		violations.push(...(await checkOneContext(config.domainRoot, context.name, context.absolutePath)));
	}
	return violations;
}

/**
 * When the system passport folder exists, every context has system.<context>.passport.ts,
 * and every file there names a context that exists. Rule: domain.system-passport
 */
export async function checkDomainSystemPassports(config: DomainLayoutConfig): Promise<ArchitectureViolation[]> {
	const systemDir = path.join(config.domainRoot, 'domain', 'iam', 'system', 'contexts');
	const contextsDir = path.join(config.domainRoot, 'domain', 'contexts');
	if (!(await directoryExists(systemDir)) || !(await directoryExists(contextsDir))) return [];
	const contexts = await listDirectories(contextsDir);
	const files = await listFiles(systemDir);
	return rule('domain.system-passport', () => systemPassports(contexts.map((context) => context.name), files));
}

/** Rule: domain.system-passport. */
function systemPassports(contextNames: readonly string[], files: readonly string[]): ArchitectureViolation[] {
	const violations: ArchitectureViolation[] = [];
	for (const name of contextNames) {
		const fileName = `system.${name}.passport.ts`;
		if (!files.includes(fileName)) {
			violations.push(violation('domain.system-passport', `domain/iam/system/contexts/${fileName}`, `The system passport folder exists, so ${name} needs system.${name}.passport.ts.`));
		}
	}
	const known = new Set(contextNames.map((name) => `system.${name}.passport.ts`));
	for (const fileName of files) {
		if (!known.has(fileName)) {
			violations.push(violation('domain.system-passport', `domain/iam/system/contexts/${fileName}`, 'A file here is system.<context>.passport.ts for a context that exists under domain/contexts.'));
		}
	}
	return violations;
}

/** Permissions, visa, passport, barrel, then each subdomain. */
async function checkOneContext(domainRoot: string, context: string, contextDir: string): Promise<ArchitectureViolation[]> {
	const pascal = pascalFromKebab(context);
	const relative = `${CONTEXTS}/${context}`;
	const permissionsFile = `${context}.domain-permissions.ts`;
	const visaFile = `${context}.visa.ts`;
	const passportFile = `${context}.passport.ts`;
	const files = await listFiles(contextDir);
	const subdomains = await listDirectories(contextDir);
	const subdomainNames = subdomains.map((subdomain) => subdomain.name);
	const violations = [
		...(await rule('domain.context.files', () => contextFiles(relative, pascal, files, permissionsFile, visaFile, passportFile))),
		...(files.includes(permissionsFile) ? await rule('domain.context.permissions', async () => contextPermissions(relative, context, pascal, permissionsFile, await readText(path.join(contextDir, permissionsFile)))) : []),
		...(files.includes(visaFile) ? await rule('domain.context.visa', async () => contextVisa(relative, context, pascal, visaFile, await readText(path.join(contextDir, visaFile)))) : []),
		...(files.includes(passportFile) ? await rule('domain.context.passport', async () => contextPassport(relative, passportFile, subdomainNames, await readText(path.join(contextDir, passportFile)))) : []),
		...(files.includes('index.ts') ? await rule('domain.context.barrel', async () => contextBarrel(relative, files, permissionsFile, visaFile, passportFile, subdomainNames, await readText(path.join(contextDir, 'index.ts')))) : []),
	];
	for (const subdomain of subdomains) {
		violations.push(...(await checkSubdomain(domainRoot, context, subdomain.name, subdomain.absolutePath)));
	}
	return violations;
}

/**
 * A context folder owns its permissions, visa, passport, and index.
 * Anything else is a subdomain directory. Rule: domain.context.files
 */
function contextFiles(relative: string, pascal: string, files: readonly string[], permissionsFile: string, visaFile: string, passportFile: string): ArchitectureViolation[] {
	const required = new Map<string, string>([
		[permissionsFile, `export interface ${pascal}DomainPermissions`],
		[visaFile, `export interface ${pascal}Visa extends Visa`],
		[passportFile, 'the context passport'],
		['index.ts', 'the context barrel'],
	]);
	const violations: ArchitectureViolation[] = [];
	for (const [fileName, owns] of required) {
		if (!files.includes(fileName)) violations.push(violation('domain.context.files', `${relative}/${fileName}`, `A context folder owns ${owns}.`));
	}
	for (const fileName of files) {
		if (required.has(fileName) || fileName.endsWith('.test.ts')) continue;
		violations.push(violation('domain.context.files', `${relative}/${fileName}`, `Not a context role file. Expected ${[...required.keys()].join(', ')}, or a subdomain directory.`));
	}
	return violations;
}

/** The permissions interface prefix spells the context folder. Rule: domain.context.permissions */
function contextPermissions(relative: string, context: string, pascal: string, permissionsFile: string, text: string): ArchitectureViolation[] {
	if (findRoleName(exportedInterfaceNames(text), context, 'DomainPermissions')) return [];
	return [violation('domain.context.permissions', `${relative}/${permissionsFile}`, `Exports interface ${pascal}DomainPermissions. The prefix letters spell the context folder.`)];
}

/** The visa interface spells the folder and extends Visa. Rule: domain.context.visa */
function contextVisa(relative: string, context: string, pascal: string, visaFile: string, text: string): ArchitectureViolation[] {
	const visaName = findRoleName(exportedInterfaceNames(text), context, 'Visa');
	if (!visaName) return [violation('domain.context.visa', `${relative}/${visaFile}`, `Exports interface ${pascal}Visa.`)];
	if (!interfaceHeritage(text, visaName)?.some((item) => item.name === 'Visa')) {
		return [violation('domain.context.visa', `${relative}/${visaFile}`, `${visaName} extends Visa from @cellix/domain-seedwork/visa.`)];
	}
	return [];
}

/** One for<Subdomain> method per subdomain. Rule: domain.context.passport */
function contextPassport(relative: string, passportFile: string, subdomainNames: readonly string[], passport: string): ArchitectureViolation[] {
	return subdomainNames.flatMap((name) => {
		const declared = forNames(passport).some((suffix) => matchesFolder(suffix, name));
		return declared ? [] : [violation('domain.context.passport', `${relative}/${passportFile}`, `Declares for${pascalFromKebab(name)}(root). One for-method per subdomain, and no other methods.`)];
	});
}

/** The context index references its role files and each subdomain index. Rule: domain.context.barrel */
function contextBarrel(relative: string, files: readonly string[], permissionsFile: string, visaFile: string, passportFile: string, subdomainNames: readonly string[], index: string): ArchitectureViolation[] {
	const violations: ArchitectureViolation[] = [];
	for (const fileName of [permissionsFile, visaFile, passportFile]) {
		if (files.includes(fileName) && !importsFragment(index, `./${fileName}`)) {
			violations.push(violation('domain.context.barrel', `${relative}/index.ts`, `References ./${fileName}. Add the export. Do not drop a role already in the folder.`));
		}
	}
	for (const name of subdomainNames) {
		if (!importsFragment(index, `./${name}/index.ts`)) {
			violations.push(violation('domain.context.barrel', `${relative}/index.ts`, `References ./${name}/index.ts for the subdomain that exists.`));
		}
	}
	return violations;
}

async function checkSubdomain(domainRoot: string, context: string, subdomain: string, subdomainDir: string): Promise<ArchitectureViolation[]> {
	const relative = `${CONTEXTS}/${context}/${subdomain}`;
	const roleSubdomain = isRoleSubdomain(subdomain);
	const files = await listFiles(subdomainDir);
	const aggregateFile = aggregateFileName(files, subdomain, roleSubdomain);
	const repositoryFile = `${subdomain}.repository.ts`;
	const uowFile = `${subdomain}.uow.ts`;
	const valueObjectsFile = `${subdomain}.value-objects.ts`;
	const violations: ArchitectureViolation[] = [
		...(await rule('domain.subdomain.name', () => subdomainName(relative, subdomain))),
		...(await rule('domain.subdomain.files', () => subdomainFiles(relative, files, aggregateFile, repositoryFile, uowFile, subdomain))),
	];
	if (files.includes(aggregateFile)) violations.push(...(await checkAggregate(domainRoot, `${relative}/${aggregateFile}`, subdomain)));
	if (files.includes(repositoryFile)) violations.push(...(await checkDomainRepository(domainRoot, `${relative}/${repositoryFile}`, subdomain)));
	if (files.includes(uowFile)) violations.push(...(await checkDomainUnitOfWork(domainRoot, `${relative}/${uowFile}`, subdomain)));
	if (files.includes(valueObjectsFile)) violations.push(...(await checkRootValueObjects(domainRoot, `${relative}/${valueObjectsFile}`, roleSubdomain)));
	for (const fileName of files) {
		if (fileName.endsWith('.value-object.ts')) violations.push(...(await checkNestedValueObject(domainRoot, `${relative}/${fileName}`)));
		if (fileName.endsWith('.entity.ts')) {
			violations.push(...(await rule('domain.entity.value-objects', async () => entityValueObjects(relative, subdomainDir, fileName, files))));
			violations.push(...(await checkNestedEntity(domainRoot, `${relative}/${fileName}`)));
		}
		if (fileName.endsWith('.value-objects.ts') && fileName !== valueObjectsFile) violations.push(...(await checkRootValueObjects(domainRoot, `${relative}/${fileName}`, roleSubdomain)));
	}
	if (files.includes('index.ts')) {
		violations.push(...(await rule('domain.subdomain.barrel', async () => subdomainBarrel(relative, files, await readText(path.join(subdomainDir, 'index.ts'))))));
	}
	if (roleSubdomain) {
		violations.push(...(await rule('domain.role.permissions', async () => rolePermissions(domainRoot, relative, subdomain, subdomainDir, files, aggregateFile))));
	}
	violations.push(...(await rule('domain.nested.root', () => checkRootWiring(subdomainDir, relative, aggregateFile))));
	violations.push(...(await rule('domain.is-new', () => checkIsNewOnlyOnAggregate(subdomainDir, relative, aggregateFile))));
	violations.push(...(await rule('domain.subdomain.names', () => checkDuplicateClassNames(subdomainDir, relative))));
	return violations;
}

/** Rule: domain.subdomain.name. */
function subdomainName(relative: string, subdomain: string): ArchitectureViolation[] {
	const violations: ArchitectureViolation[] = [];
	if (!isKebabName(subdomain)) violations.push(violation('domain.subdomain.name', relative, 'A subdomain folder is kebab-case, the sheet tab.'));
	const singular = singularFolder(subdomain);
	if (singular) violations.push(violation('domain.subdomain.name', relative, `A subdomain folder is singular. ${subdomain} is ${singular}.`));
	return violations;
}

/** Rule: domain.subdomain.files. */
function subdomainFiles(relative: string, files: readonly string[], aggregateFile: string, repositoryFile: string, uowFile: string, subdomain: string): ArchitectureViolation[] {
	const violations: ArchitectureViolation[] = [];
	for (const fileName of [aggregateFile, repositoryFile, uowFile, 'index.ts']) {
		if (!files.includes(fileName)) {
			violations.push(violation('domain.subdomain.files', `${relative}/${fileName}`, 'A subdomain folder owns the aggregate, the repository, the unit of work, and index.ts. A value-objects file is added only for a string with a length or a pattern.'));
		}
	}
	for (const fileName of files) {
		if (isAllowedSubdomainFile(fileName, subdomain)) continue;
		const allowed = isRoleSubdomain(subdomain)
			? 'Not a subdomain role. A role folder also allows <subdomain>.ts, <subdomain>-permissions.ts, and <subdomain>-<group>-permissions.ts.'
			: 'Not a subdomain role. Allowed names: <subdomain>.aggregate.ts, .repository.ts, .uow.ts, .value-objects.ts, index.ts, <nested>.value-object.ts, <nested>.entity.ts, <nested>.value-objects.ts, and *.test.ts.';
		violations.push(violation('domain.subdomain.files', `${relative}/${fileName}`, allowed));
	}
	return violations;
}

/** Rule: domain.subdomain.barrel. */
function subdomainBarrel(relative: string, files: readonly string[], index: string): ArchitectureViolation[] {
	const violations: ArchitectureViolation[] = [];
	for (const fileName of files) {
		if (fileName === 'index.ts' || fileName.endsWith('.test.ts')) continue;
		if (!importsFragment(index, `./${fileName}`)) {
			violations.push(violation('domain.subdomain.barrel', `${relative}/index.ts`, `References ./${fileName}. Nested classes are exported by name from this barrel.`));
		}
	}
	return violations;
}

/** Rule: domain.entity.value-objects. */
async function entityValueObjects(relative: string, subdomainDir: string, fileName: string, files: readonly string[]): Promise<ArchitectureViolation[]> {
	const entityText = await readText(path.join(subdomainDir, fileName));
	const companion = fileName.replace(/\.entity\.ts$/, '.value-objects.ts');
	if ((identifierPresent(entityText, 'VOString') || identifierPresent(entityText, 'ValueObjects')) && !files.includes(companion)) {
		return [violation('domain.entity.value-objects', `${relative}/${companion}`, `${fileName} keeps a constrained string in ${companion}. A plain string stays on the entity and gets no class.`)];
	}
	return [];
}

function aggregateFileName(files: readonly string[], subdomain: string, roleSubdomain: boolean): string {
	if (files.includes(`${subdomain}.aggregate.ts`)) return `${subdomain}.aggregate.ts`;
	if (roleSubdomain && files.includes(`${subdomain}.ts`)) return `${subdomain}.ts`;
	return `${subdomain}.aggregate.ts`;
}

function isAllowedSubdomainFile(fileName: string, subdomain: string): boolean {
	if (fileName === 'index.ts' || fileName.endsWith('.test.ts')) return true;
	if (fileName === `${subdomain}.aggregate.ts`) return true;
	if (isRoleSubdomain(subdomain) && (fileName === `${subdomain}.ts` || isRolePermissionFile(fileName, subdomain))) return true;
	if (fileName === `${subdomain}.repository.ts`) return true;
	if (fileName === `${subdomain}.uow.ts`) return true;
	if (fileName === `${subdomain}.value-objects.ts`) return true;
	if (fileName.endsWith('.value-object.ts')) return true;
	if (fileName.endsWith('.entity.ts')) return true;
	if (fileName.endsWith('.value-objects.ts')) return true;
	return false;
}

/** Shape, props, creation, members, and references of one aggregate. */
async function checkAggregate(domainRoot: string, relativeFile: string, subdomain: string): Promise<ArchitectureViolation[]> {
	const text = await readText(path.join(domainRoot, relativeFile));
	const roleSubdomain = isRoleSubdomain(subdomain);
	const propsName = findRoleName(exportedInterfaceNames(text), subdomain, 'Props');
	const aggregateClass = classShapes(text).find((item) => matchesFolder(item.name, subdomain));
	const members = aggregateClass?.members ?? [];
	return [
		...(await rule('domain.aggregate.shape', () => aggregateShape(relativeFile, text, subdomain))),
		...(await rule('domain.aggregate.props', () => aggregateProps(relativeFile, text, subdomain, propsName, roleSubdomain))),
		...(await rule('domain.aggregate.reference', () => aggregateReference(relativeFile, text, subdomain, propsName, aggregateClass !== undefined, members))),
		...(await rule('domain.aggregate.is-new', () => aggregateIsNew(relativeFile, text, roleSubdomain))),
		...(await rule('domain.aggregate.get-new-instance', () => aggregateGetNewInstance(relativeFile, text, members, roleSubdomain))),
		...(roleSubdomain ? await rule('domain.aggregate.default-instance', () => aggregateDefaultInstance(relativeFile, members)) : []),
		...(roleSubdomain && aggregateClass ? await rule('domain.aggregate.role-method', () => aggregateRoleMethod(relativeFile, members)) : []),
		...(await rule('domain.aggregate.member', () => aggregateMember(relativeFile, text, members, aggregateClass !== undefined, roleSubdomain))),
		...(await rule('domain.aggregate.setter', () => aggregateSetter(relativeFile, members))),
		...(await rule('domain.aggregate.collection', () => (propsName ? aggregateCollection(relativeFile, text, propsName, members) : []))),
		...(await rule('domain.aggregate.nested', () => (propsName ? aggregateNested(relativeFile, text, propsName, members) : []))),
	];
}

/** The class matches the folder and extends AggregateRoot. Rule: domain.aggregate.shape */
function aggregateShape(relativeFile: string, text: string, subdomain: string): ArchitectureViolation[] {
	const pascal = pascalFromKebab(subdomain);
	const aggregate = exportedClasses(text).find((item) => matchesFolder(item.name, subdomain));
	if (!aggregate) return [violation('domain.aggregate.shape', relativeFile, `Exports class ${pascal}. Acronym casing such as MiniCEX is accepted when the letters match the folder.`)];
	if (!/\bextends\s+AggregateRoot\b/.test(aggregate.extendsClause)) {
		return [violation('domain.aggregate.shape', relativeFile, `${aggregate.name} extends AggregateRoot from @cellix/domain-seedwork/aggregate-root.`)];
	}
	return [];
}

/** Props extend DomainEntityProps and include the timestamps. A role skips schemaVersion. Rule: domain.aggregate.props */
function aggregateProps(relativeFile: string, text: string, subdomain: string, propsName: string | undefined, roleSubdomain: boolean): ArchitectureViolation[] {
	const pascal = pascalFromKebab(subdomain);
	if (!propsName) return [violation('domain.aggregate.props', relativeFile, `Exports interface ${pascal}Props extends DomainEntityProps.`)];
	const violations: ArchitectureViolation[] = [];
	if (!interfaceHeritage(text, propsName)?.some((item) => item.name === 'DomainEntityProps')) {
		violations.push(violation('domain.aggregate.props', relativeFile, `${propsName} extends DomainEntityProps.`));
	}
	const propsInterface = interfaceShape(text, propsName);
	const timestamps = roleSubdomain ? ['createdAt', 'updatedAt'] : ['createdAt', 'updatedAt', 'schemaVersion'];
	for (const timestamp of timestamps) {
		if (propsInterface && !propsInterface.properties.includes(timestamp)) {
			violations.push(violation('domain.aggregate.props', relativeFile, `${propsName} includes readonly ${timestamp}. The three timestamps sit after the root fields.`));
		}
	}
	return violations;
}

/** Rule: domain.aggregate.reference. The exported interface, plus load* and the isNew setter on a foreign reference. */
function aggregateReference(relativeFile: string, text: string, subdomain: string, propsName: string | undefined, hasClass: boolean, members: readonly ClassMember[]): ArchitectureViolation[] {
	return [...aggregateEntityReference(relativeFile, text, subdomain), ...(hasClass && propsName ? aggregateReferenceFields(relativeFile, text, subdomain, propsName, members) : [])];
}

function aggregateEntityReference(relativeFile: string, text: string, subdomain: string): ArchitectureViolation[] {
	if (findRoleName(exportedInterfaceNames(text), subdomain, 'EntityReference')) return [];
	return [violation('domain.aggregate.reference', relativeFile, `Exports interface ${pascalFromKebab(subdomain)}EntityReference.`)];
}

/** isNew belongs on an ordinary aggregate. A role is exempt. Rule: domain.aggregate.is-new */
function aggregateIsNew(relativeFile: string, text: string, roleSubdomain: boolean): ArchitectureViolation[] {
	if (roleSubdomain || mentionsWord(text, 'isNew')) return [];
	return [violation('domain.aggregate.is-new', relativeFile, 'isNew belongs on the aggregate. getNewInstance sets it while the root scalars are assigned.')];
}

/** Rule: domain.aggregate.get-new-instance. Presence on an ordinary aggregate, and the body when the method exists. */
function aggregateGetNewInstance(relativeFile: string, text: string, members: readonly ClassMember[], roleSubdomain: boolean): ArchitectureViolation[] {
	const violations: ArchitectureViolation[] = [];
	if (!roleSubdomain && !identifierPresent(text, 'getNewInstance')) {
		violations.push(violation('domain.aggregate.get-new-instance', relativeFile, 'The aggregate exposes static getNewInstance. It assigns root scalars through the setters.'));
	}
	const member = members.find((item) => item.kind === 'method' && item.name === 'getNewInstance');
	if (!member) return violations;
	if (!member.isStatic) violations.push(violation('domain.aggregate.get-new-instance', relativeFile, 'getNewInstance is static.'));
	if (member.use.touchesProps()) {
		violations.push(violation('domain.aggregate.get-new-instance', relativeFile, 'getNewInstance assigns root scalars through the setters. It does not assign props.'));
	}
	if (roleSubdomain) {
		if (!member.use.assigns('isNew', 'true') || !member.use.assigns('isNew', 'false')) {
			violations.push(violation('domain.aggregate.get-new-instance', relativeFile, 'A role getNewInstance sets isNew to true, assigns roleName and isDefault through the setters, then sets isNew to false.'));
		}
	} else if (!member.use.calls('markAsNew') || !member.use.assigns('isNew', 'false')) {
		violations.push(violation('domain.aggregate.get-new-instance', relativeFile, 'getNewInstance calls markAsNew, assigns the root scalars it takes, then sets isNew to false. An existing aggregate reference may be a parameter. A nested value object or a collection is not.'));
	}
	return violations;
}

/**
 * A built-in role sets isNew, then assigns the name, the kind, isDefault, and the permission flags through setters.
 * Rule: domain.aggregate.default-instance
 */
function aggregateDefaultInstance(relativeFile: string, members: readonly ClassMember[]): ArchitectureViolation[] {
	const violations: ArchitectureViolation[] = [];
	for (const member of members) {
		if (member.kind !== 'method' || !member.name.startsWith('getNewDefault')) continue;
		if (!member.isStatic) violations.push(violation('domain.aggregate.default-instance', relativeFile, `${member.name} is static.`));
		if (!member.use.assigns('isNew', 'true') || !member.use.assigns('isNew', 'false')) {
			violations.push(violation('domain.aggregate.default-instance', relativeFile, `${member.name} sets isNew to true, assigns through the setters, then sets isNew to false.`));
		}
		if (member.use.touchesProps()) {
			violations.push(violation('domain.aggregate.default-instance', relativeFile, `${member.name} assigns roleName, isDefault, the kind, and permissions.<group>Permissions.<flag> through setters. It does not assign props.`));
		}
	}
	return violations;
}

/**
 * getDefaultRoleNames lists the built-in names. deleteAndReassignTo refuses a default, marks the role deleted, and records the reassignment.
 * Rule: domain.aggregate.role-method
 */
function aggregateRoleMethod(relativeFile: string, members: readonly ClassMember[]): ArchitectureViolation[] {
	const violations: ArchitectureViolation[] = [];
	const names = aggregateRoleMethodMember(members, 'getDefaultRoleNames');
	if (!names) {
		violations.push(violation('domain.aggregate.role-method', relativeFile, 'getDefaultRoleNames returns the canonical default names.'));
	} else if (!names.isStatic) {
		violations.push(violation('domain.aggregate.role-method', relativeFile, 'getDefaultRoleNames is static.'));
	}
	const reassign = aggregateRoleMethodMember(members, 'deleteAndReassignTo');
	if (!reassign) {
		violations.push(violation('domain.aggregate.role-method', relativeFile, 'deleteAndReassignTo refuses a default role, sets isDeleted, and adds an integration event with the deleted id and the id that receives the assignments.'));
	} else {
		if (!reassign.use.mentions('isDefault')) {
			violations.push(violation('domain.aggregate.role-method', relativeFile, 'deleteAndReassignTo refuses a default role.'));
		}
		if (!reassign.use.assigns('isDeleted', 'true')) {
			violations.push(violation('domain.aggregate.role-method', relativeFile, 'deleteAndReassignTo sets isDeleted.'));
		}
		if (!reassign.use.calls('addIntegrationEvent')) {
			violations.push(violation('domain.aggregate.role-method', relativeFile, 'deleteAndReassignTo adds an integration event with the deleted id and the id that receives the assignments.'));
		}
	}
	return violations;
}

function aggregateRoleMethodMember(members: readonly ClassMember[], name: string): ClassMember | undefined {
	return members.find((member) => member.kind === 'method' && member.name === name);
}

/** `<subdomain>-permissions.ts`, or `<subdomain>-<group>-permissions.ts`. */
function isRolePermissionFile(fileName: string, subdomain: string): boolean {
	return fileName === `${subdomain}-permissions.ts` || rolePermissionGroup(fileName, subdomain) !== undefined;
}

/** `dock-role-berth-permissions.ts` under `dock-role` is `berth`. The composer is not a group. */
function rolePermissionGroup(fileName: string, subdomain: string): string | undefined {
	const prefix = `${subdomain}-`;
	const suffix = '-permissions.ts';
	if (fileName === `${subdomain}-permissions.ts` || !fileName.startsWith(prefix) || !fileName.endsWith(suffix)) return undefined;
	const group = fileName.slice(prefix.length, -suffix.length);
	return isKebabName(group) ? group : undefined;
}

/**
 * One permissions composer, then one value object per group. The aggregate getter builds the composer.
 * Rule: domain.role.permissions
 */
async function rolePermissions(domainRoot: string, relative: string, subdomain: string, subdomainDir: string, files: readonly string[], aggregateFile: string): Promise<ArchitectureViolation[]> {
	const violations: ArchitectureViolation[] = [];
	const pascal = pascalFromKebab(subdomain);
	const composerFile = `${subdomain}-permissions.ts`;
	const groups = files.flatMap((fileName) => {
		const group = rolePermissionGroup(fileName, subdomain);
		return group ? [{ fileName, group }] : [];
	});
	if (!files.includes(composerFile)) {
		violations.push(violation('domain.role.permissions', `${relative}/${composerFile}`, `A role has ${composerFile}, then one ${subdomain}-<group>-permissions.ts per group.`));
	} else {
		violations.push(...rolePermissionComposer(relative, composerFile, pascal, groups, await readText(path.join(subdomainDir, composerFile))));
	}
	for (const group of groups) {
		violations.push(...rolePermissionGroupShape(relative, group.fileName, pascal, group.group, await readText(path.join(subdomainDir, group.fileName))));
	}
	if (groups.length === 0) {
		violations.push(violation('domain.role.permissions', `${relative}/${composerFile}`, `Each permission group is its own ${subdomain}-<group>-permissions.ts. Flags are setters on that group.`));
	}
	if (files.includes(aggregateFile)) {
		violations.push(...roleAggregatePermissions(`${relative}/${aggregateFile}`, pascal, await readText(path.join(domainRoot, `${relative}/${aggregateFile}`))));
	}
	return violations;
}

function rolePermissionComposer(relative: string, fileName: string, pascal: string, groups: readonly { group: string }[], text: string): ArchitectureViolation[] {
	const violations: ArchitectureViolation[] = [];
	const className = `${pascal}Permissions`;
	const composer = classShapes(text).find((item) => item.name === className);
	const relativeFile = `${relative}/${fileName}`;
	if (!composer || !/\bextends\s+ValueObject\b/.test(composer.extendsClause)) {
		violations.push(violation('domain.role.permissions', relativeFile, `${className} extends ValueObject. It lists each group and builds that group's class with the visa.`));
		return violations;
	}
	const constructor = composer.members.find((member) => member.kind === 'constructor');
	if (!constructor?.use.touches('this.visa')) {
		violations.push(violation('domain.role.permissions', relativeFile, `${className} assigns this.visa in the constructor body.`));
	}
	for (const group of groups) {
		const getterName = `${camelFromKebab(group.group)}Permissions`;
		const groupClass = `${pascal}${pascalFromKebab(group.group)}Permissions`;
		const getter = composer.members.find((member) => member.kind === 'get' && member.name === getterName);
		if (!getter?.use.constructs(groupClass)) {
			violations.push(violation('domain.role.permissions', relativeFile, `${getterName} returns new ${groupClass}(this.props.${getterName}, this.visa). A missing group is an object where every flag is false.`));
		}
	}
	return violations;
}

function rolePermissionGroupShape(relative: string, fileName: string, pascal: string, group: string, text: string): ArchitectureViolation[] {
	const violations: ArchitectureViolation[] = [];
	const className = `${pascal}${pascalFromKebab(group)}Permissions`;
	const propsName = `${className}Props`;
	const relativeFile = `${relative}/${fileName}`;
	const groupClass = classShapes(text).find((item) => item.name === className);
	if (!groupClass || !/\bextends\s+ValueObject\b/.test(groupClass.extendsClause)) {
		violations.push(violation('domain.role.permissions', relativeFile, `${className} extends ValueObject. Each flag has a getter and a setter. The setter assigns this.props.<flag>.`));
		return violations;
	}
	const constructor = groupClass.members.find((member) => member.kind === 'constructor');
	if (!constructor?.use.touches('this.visa')) {
		violations.push(violation('domain.role.permissions', relativeFile, `${className} assigns this.visa in the constructor body. The visa check on the setter is not written yet.`));
	}
	const flags = permissionFlags(text, propsName);
	const setters = groupClass.members.filter((member) => member.kind === 'set');
	if (flags.length === 0 && setters.length === 0) {
		violations.push(violation('domain.role.permissions', relativeFile, `${className} gives every flag a getter and a setter. The setter assigns this.props.<flag>.`));
	}
	for (const flag of flags) {
		const setter = setters.find((member) => member.name === flag);
		const getter = groupClass.members.find((member) => member.kind === 'get' && member.name === flag);
		if (!getter || !setter?.use.touches(`this.props.${flag}`)) {
			violations.push(violation('domain.role.permissions', relativeFile, `${flag} has a getter and a setter. The setter assigns this.props.${flag}.`));
		}
	}
	for (const setter of setters) {
		if (flags.includes(setter.name)) continue;
		if (!setter.use.touches(`this.props.${setter.name}`)) {
			violations.push(violation('domain.role.permissions', relativeFile, `${setter.name} assigns this.props.${setter.name}.`));
		}
	}
	return violations;
}

/** Flags declared on the props interface, including a spec it extends in the same file. */
function permissionFlags(text: string, propsName: string): string[] {
	const flags: string[] = [];
	const seen = new Set<string>();
	const visit = (name: string): void => {
		if (seen.has(name)) return;
		seen.add(name);
		const shape = interfaceShape(text, name);
		if (!shape) return;
		flags.push(...shape.properties);
		for (const heritage of interfaceHeritage(text, name) ?? []) visit(heritage.name);
	};
	visit(propsName);
	return flags;
}

function roleAggregatePermissions(relativeFile: string, pascal: string, text: string): ArchitectureViolation[] {
	const violations: ArchitectureViolation[] = [];
	const props = interfaceProperties(text, `${pascal}Props`);
	if (!props?.some((property) => property.name === 'permissions')) {
		violations.push(violation('domain.role.permissions', relativeFile, `${pascal}Props includes readonly permissions: ${pascal}PermissionsProps.`));
	}
	if (!identifierPresent(text, `${pascal}PermissionsEntityReference`)) {
		violations.push(violation('domain.role.permissions', relativeFile, `The entity reference uses ${pascal}PermissionsEntityReference in place of the permissions props.`));
	}
	const aggregate = classShapes(text).find((item) => item.name === pascal);
	const getter = aggregate?.members.find((member) => member.kind === 'get' && member.name === 'permissions');
	if (!getter?.use.constructs(`${pascal}Permissions`)) {
		violations.push(violation('domain.role.permissions', relativeFile, `permissions returns new ${pascal}Permissions(this.props.permissions, this.visa).`));
	}
	if (aggregate?.members.some((member) => member.kind === 'set' && member.name === 'permissions')) {
		violations.push(violation('domain.role.permissions', relativeFile, 'Permission flags are setters on the group value object. The aggregate does not take a permissions update object.'));
	}
	return violations;
}

/** Rule: domain.aggregate.setter. */
function aggregateSetter(relativeFile: string, members: readonly ClassMember[]): ArchitectureViolation[] {
	const violations: ArchitectureViolation[] = [];
	for (const member of members) {
		if (member.kind === 'set' && member.use.calls('valueOf') && !member.use.touches('ValueObjects')) {
			violations.push(violation('domain.aggregate.setter', relativeFile, `${member.name} wraps a string with new ValueObjects.<Field>(...).valueOf().`));
		}
	}
	return violations;
}

/**
 * The domain repository is an interface extending Repository. The class lives in persistence.
 * getById and getNewInstance are not required. Rule: domain.repository.shape
 */
async function checkDomainRepository(domainRoot: string, relativeFile: string, subdomain: string): Promise<ArchitectureViolation[]> {
	const text = await readText(path.join(domainRoot, relativeFile));
	return [
		...(await rule('domain.repository.shape', () => domainRepositoryShape(relativeFile, text, subdomain))),
		...(await rule('domain.repository.member', () => domainRepositoryMember(relativeFile, text))),
	];
}

/** Rule: domain.repository.member. */
function domainRepositoryMember(relativeFile: string, text: string): ArchitectureViolation[] {
	return unexpectedFunctions(relativeFile, text, 'domain.repository.member');
}

/** Rule: domain.repository.shape. */
function domainRepositoryShape(relativeFile: string, text: string, subdomain: string): ArchitectureViolation[] {
	const violations: ArchitectureViolation[] = [];
	const pascal = pascalFromKebab(subdomain);
	const repositoryName = findRoleName(exportedInterfaceNames(text), subdomain, 'Repository');
	if (!repositoryName) {
		violations.push(violation('domain.repository.shape', relativeFile, `Exports interface ${pascal}Repository extends Repository.`));
	} else if (!interfaceHeritage(text, repositoryName)?.some((item) => item.name === 'Repository' && item.typeArguments > 0)) {
		violations.push(violation('domain.repository.shape', relativeFile, `${repositoryName} extends Repository from @cellix/domain-seedwork/repository.`));
	}
	if (exportedClasses(text).length > 0) {
		violations.push(violation('domain.repository.shape', relativeFile, 'The domain repository is an interface. The class lives in persistence.'));
	}
	return violations;
}

/**
 * The unit of work is an interface extending UnitOfWork and InitializedUnitOfWork, with no methods of its own.
 * Rules: domain.uow.shape, domain.uow.member
 */
async function checkDomainUnitOfWork(domainRoot: string, relativeFile: string, subdomain: string): Promise<ArchitectureViolation[]> {
	const text = await readText(path.join(domainRoot, relativeFile));
	const unitName = findRoleName(exportedInterfaceNames(text), subdomain, 'UnitOfWork');
	return [
		...(await rule('domain.uow.shape', () => domainUnitOfWorkShape(relativeFile, text, subdomain, unitName))),
		...(await rule('domain.uow.member', () => domainUnitOfWorkMember(relativeFile, text, unitName))),
	];
}

/** Rule: domain.uow.shape. */
function domainUnitOfWorkShape(relativeFile: string, text: string, subdomain: string, unitName: string | undefined): ArchitectureViolation[] {
	const violations: ArchitectureViolation[] = [];
	const pascal = pascalFromKebab(subdomain);
	const heritage = unitName ? interfaceHeritage(text, unitName) : undefined;
	if (!unitName || !heritage) {
		violations.push(violation('domain.uow.shape', relativeFile, `Exports interface ${pascal}UnitOfWork.`));
	} else if (!heritage.some((item) => item.name === 'UnitOfWork') || !heritage.some((item) => item.name === 'InitializedUnitOfWork')) {
		violations.push(violation('domain.uow.shape', relativeFile, `${unitName} extends UnitOfWork and InitializedUnitOfWork.`));
	}
	if (exportedClasses(text).length > 0) {
		violations.push(violation('domain.uow.shape', relativeFile, 'The domain unit of work is an interface. The Mongo unit of work lives in persistence.'));
	}
	return violations;
}

/** Rule: domain.uow.member. */
function domainUnitOfWorkMember(relativeFile: string, text: string, unitName: string | undefined): ArchitectureViolation[] {
	const violations: ArchitectureViolation[] = [];
	const unitInterface = unitName ? interfaceShape(text, unitName) : undefined;
	for (const method of unitInterface?.methods ?? []) {
		violations.push(violation('domain.uow.member', relativeFile, `${method} is not a skill method. The unit-of-work interface adds no methods of its own.`));
	}
	violations.push(...unexpectedFunctions(relativeFile, text, 'domain.uow.member'));
	return violations;
}

/**
 * A value-objects file holds constrained strings. A plain string gets no class.
 * A role may also extend VOSet. Rules: domain.value-objects.shape, domain.value-objects.body, domain.value-objects.pattern
 */
async function checkRootValueObjects(domainRoot: string, relativeFile: string, allowSet = false): Promise<ArchitectureViolation[]> {
	const text = await readText(path.join(domainRoot, relativeFile));
	return [
		...(await rule('domain.value-objects.shape', () => valueObjectsShape(relativeFile, text, allowSet))),
		...(await rule('domain.value-objects.body', () => valueObjectsBody(relativeFile, text))),
		...(await rule('domain.value-objects.pattern', () => stringPatternOptions(relativeFile, text))),
	];
}

/** Rule: domain.value-objects.shape. */
function valueObjectsShape(relativeFile: string, text: string, allowSet: boolean): ArchitectureViolation[] {
	const classes = exportedClasses(text);
	if (classes.length === 0) {
		return [violation('domain.value-objects.shape', relativeFile, 'A value-objects file exports the constrained strings. A plain string gets no class, and the file is omitted when every string is plain.')];
	}
	const violations: ArchitectureViolation[] = [];
	for (const item of classes) {
		const isStringClass = /\bextends\s+VOString\b/.test(item.extendsClause) || /\bextends\s+VOOptional\b/.test(item.extendsClause);
		const isSetClass = allowSet && /\bextends\s+VOSet\b/.test(item.extendsClause);
		if (!isStringClass && !isSetClass) {
			const expected = allowSet ? 'VOString, VOOptional, or VOSet' : 'VOString or VOOptional';
			violations.push(violation('domain.value-objects.shape', relativeFile, `${item.name} extends ${expected}. A nested object is its own .value-object.ts file.`));
		}
	}
	return violations;
}

/** Rule: domain.value-objects.body. */
function valueObjectsBody(relativeFile: string, text: string): ArchitectureViolation[] {
	const violations: ArchitectureViolation[] = [];
	for (const item of exportedClasses(text)) {
		if (!classBodyIsEmpty(item.body)) {
			violations.push(violation('domain.value-objects.body', relativeFile, `${item.name} has an empty class body. Length and pattern live in the VOString options.`));
		}
	}
	violations.push(...unexpectedFunctions(relativeFile, text, 'domain.value-objects.body'));
	return violations;
}

/** A nested value object extends ValueObject, stores visa in the constructor body, and does not use isNew. */
async function checkNestedValueObject(domainRoot: string, relativeFile: string): Promise<ArchitectureViolation[]> {
	const text = await readText(path.join(domainRoot, relativeFile));
	const shapes = classShapes(text);
	return [
		...(await rule('domain.nested-value-object.shape', () => nestedValueObjectShape(relativeFile, text))),
		...(await rule('domain.value-objects.body', () => nestedStringBody(relativeFile, shapes))),
		...(await rule('domain.nested-value-object.visa', () => nestedValueObjectVisa(relativeFile, text))),
		...(await rule('domain.nested-value-object.is-new', () => nestedValueObjectIsNew(relativeFile, text))),
		...(await rule('domain.value-objects.pattern', () => stringPatternOptions(relativeFile, text))),
		...(await rule('domain.nested-value-object.member', () => nestedValueObjectMember(relativeFile, text, shapes))),
		...(await rule('domain.nested-value-object.root', () => nestedValueObjectRoot(relativeFile, shapes))),
	];
}

/** Rule: domain.nested-value-object.shape. */
function nestedValueObjectShape(relativeFile: string, text: string): ArchitectureViolation[] {
	const valueObjects = exportedClasses(text).filter((item) => /\bextends\s+ValueObject\b/.test(item.extendsClause));
	if (valueObjects.length === 0) return [violation('domain.nested-value-object.shape', relativeFile, 'Exports a class that extends ValueObject.')];
	return [];
}

function nestedStringBody(relativeFile: string, shapes: readonly ClassShape[]): ArchitectureViolation[] {
	return shapes.flatMap((item) => {
		const isStringClass = /\bVOString\b/.test(item.extendsClause) || /\bVOOptional\b/.test(item.extendsClause);
		return isStringClass && item.members.length > 0 ? [violation('domain.value-objects.body', relativeFile, `${item.name} has an empty class body.`)] : [];
	});
}

/** Rule: domain.nested-value-object.visa. */
function nestedValueObjectVisa(relativeFile: string, text: string): ArchitectureViolation[] {
	if (!hasParameterProperty(text)) return [];
	return [violation('domain.nested-value-object.visa', relativeFile, 'Declare the visa field and assign it in the constructor body.')];
}

/** Rule: domain.nested-value-object.is-new. */
function nestedValueObjectIsNew(relativeFile: string, text: string): ArchitectureViolation[] {
	if (!mentionsWord(text, 'isNew')) return [];
	return [violation('domain.nested-value-object.is-new', relativeFile, 'isNew belongs only on the aggregate.')];
}

/** Rule: domain.nested-value-object.member. */
function nestedValueObjectMember(relativeFile: string, text: string, shapes: readonly ClassShape[]): ArchitectureViolation[] {
	return nestedMembers(relativeFile, text, shapes, 'domain.nested-value-object.member');
}

/** Rule: domain.nested-value-object.root. */
function nestedValueObjectRoot(relativeFile: string, shapes: readonly ClassShape[]): ArchitectureViolation[] {
	return shapes.filter((item) => /\bValueObject\b/.test(item.extendsClause)).flatMap((item) => rootField(relativeFile, item, 'domain.nested-value-object.root'));
}

function nestedMembers(relativeFile: string, text: string, shapes: readonly ClassShape[], id: 'domain.nested-value-object.member' | 'domain.entity.member'): ArchitectureViolation[] {
	const base = id === 'domain.entity.member' ? 'DomainEntity' : 'ValueObject';
	return [
		...shapes.filter((item) => new RegExp(`\\b${base}\\b`).test(item.extendsClause)).flatMap((item) => valueObjectMembers(relativeFile, item.members, id)),
		...unexpectedFunctions(relativeFile, text, id),
	];
}

/** An entity extends DomainEntity, stores visa in the constructor body, and lists createdAt and updatedAt. */
async function checkNestedEntity(domainRoot: string, relativeFile: string): Promise<ArchitectureViolation[]> {
	const text = await readText(path.join(domainRoot, relativeFile));
	const shapes = classShapes(text);
	return [
		...(await rule('domain.entity.shape', () => entityShape(relativeFile, text))),
		...(await rule('domain.entity.visa', () => entityVisa(relativeFile, text))),
		...(await rule('domain.entity.is-new', () => entityIsNew(relativeFile, text))),
		...(await rule('domain.entity.member', () => entityMember(relativeFile, text, shapes))),
		...(await rule('domain.entity.root', () => entityRoot(relativeFile, shapes))),
		...(await rule('domain.entity.timestamps', () => entityTimestamps(relativeFile, text))),
	];
}

/** Rule: domain.entity.shape. */
function entityShape(relativeFile: string, text: string): ArchitectureViolation[] {
	if (exportedClasses(text).some((item) => /\bextends\s+DomainEntity\b/.test(item.extendsClause))) return [];
	return [violation('domain.entity.shape', relativeFile, 'Exports a class that extends DomainEntity.')];
}

/** Rule: domain.entity.visa. */
function entityVisa(relativeFile: string, text: string): ArchitectureViolation[] {
	if (!hasParameterProperty(text)) return [];
	return [violation('domain.entity.visa', relativeFile, 'Declare the visa field and assign it in the constructor body.')];
}

/** Rule: domain.entity.is-new. */
function entityIsNew(relativeFile: string, text: string): ArchitectureViolation[] {
	if (!mentionsWord(text, 'isNew')) return [];
	return [violation('domain.entity.is-new', relativeFile, 'isNew belongs only on the aggregate.')];
}

/** Rule: domain.entity.member. */
function entityMember(relativeFile: string, text: string, shapes: readonly ClassShape[]): ArchitectureViolation[] {
	return nestedMembers(relativeFile, text, shapes, 'domain.entity.member');
}

/** Rule: domain.entity.root. */
function entityRoot(relativeFile: string, shapes: readonly ClassShape[]): ArchitectureViolation[] {
	return shapes.filter((item) => /\bDomainEntity\b/.test(item.extendsClause)).flatMap((item) => rootField(relativeFile, item, 'domain.entity.root'));
}

/** Rule: domain.entity.timestamps. */
function entityTimestamps(relativeFile: string, text: string): ArchitectureViolation[] {
	const violations: ArchitectureViolation[] = [];
	for (const propsName of exportedInterfaceNames(text)) {
		if (!propsName.endsWith('Props') || !interfaceHeritage(text, propsName)?.some((item) => item.name === 'DomainEntityProps')) continue;
		const props = interfaceProperties(text, propsName) ?? [];
		for (const timestamp of ['createdAt', 'updatedAt']) {
			if (!props.some((property) => property.name === timestamp)) {
				violations.push(violation('domain.entity.timestamps', relativeFile, `${propsName} includes readonly ${timestamp}. schemaVersion stays on the aggregate.`));
			}
		}
	}
	return violations;
}

async function checkIsNewOnlyOnAggregate(subdomainDir: string, relative: string, aggregateFile: string): Promise<ArchitectureViolation[]> {
	const violations: ArchitectureViolation[] = [];
	const files = await listFiles(subdomainDir);
	for (const fileName of files) {
		if (!fileName.endsWith('.ts') || fileName.endsWith('.test.ts') || fileName === aggregateFile) continue;
		const text = await readText(path.join(subdomainDir, fileName));
		if (mentionsWord(text, 'isNew')) {
			violations.push(violation('domain.is-new', `${relative}/${fileName}`, 'isNew belongs only on the aggregate.'));
		}
	}
	return violations;
}

async function checkDuplicateClassNames(subdomainDir: string, relative: string): Promise<ArchitectureViolation[]> {
	const seen = new Map<string, string>();
	const violations: ArchitectureViolation[] = [];
	const files = await listFiles(subdomainDir);
	for (const fileName of files) {
		if (!fileName.endsWith('.ts') || fileName.endsWith('.test.ts') || fileName === 'index.ts') continue;
		const text = await readText(path.join(subdomainDir, fileName));
		for (const item of exportedClasses(text)) {
			const previous = seen.get(item.name);
			if (previous) {
				violations.push(violation('domain.subdomain.names', `${relative}/${fileName}`, `Exports class ${item.name}, and ${previous} already exports that name. A second file uses <Parent><Nested> or <Nested><Field>.`));
			} else {
				seen.set(item.name, fileName);
			}
		}
	}
	return violations;
}

/** Rule: domain.aggregate.reference. A foreign EntityReference has load* and a setter that writes only while isNew is true. A string id is left alone. */
function aggregateReferenceFields(relativeFile: string, text: string, subdomain: string, propsName: string, members: readonly ClassMember[]): ArchitectureViolation[] {
	const violations: ArchitectureViolation[] = [];
	const ownName = pascalFromKebab(subdomain);
	for (const property of interfaceProperties(text, propsName) ?? []) {
		if (!isForeignAggregateReference(property.type, ownName)) continue;
		const loadName = `load${pascalIdentifier(property.name)}`;
		const load = members.find((member) => member.kind === 'method' && member.name === loadName);
		if (!load) {
			violations.push(violation('domain.aggregate.reference', relativeFile, `${property.name} is typed ${property.type}. That is an id of another aggregate, so the aggregate has ${loadName}() forwarding to the prop. A string id is not this case.`));
		} else if (!load.use.touches('this.props')) {
			violations.push(violation('domain.aggregate.reference', relativeFile, `${loadName}() forwards to this.props.${loadName}().`));
		}
		const setter = members.find((member) => member.kind === 'set' && member.name === property.name);
		if (!setter || !setter.use.mentions('isNew')) {
			violations.push(violation('domain.aggregate.reference', relativeFile, `${property.name} has a setter that writes only while isNew is true.`));
		}
	}
	return violations;
}

/** Rule: domain.aggregate.collection. */
function aggregateCollection(relativeFile: string, text: string, propsName: string, members: readonly ClassMember[]): ArchitectureViolation[] {
	const violations: ArchitectureViolation[] = [];
	for (const property of interfaceProperties(text, propsName) ?? []) {
		if (!/\bPropArray\s*</.test(property.type)) continue;
		const getter = members.find((member) => member.kind === 'get' && member.name === property.name);
		if (!getter || !getter.use.touches(`this.props.${property.name}.items`)) {
			violations.push(violation('domain.aggregate.collection', relativeFile, `${property.name} is a PropArray. The getter maps this.props.${property.name}.items.`));
		}
		const grows = members.some((member) => member.kind === 'method' && member.use.touches(`this.props.${property.name}.getNewItem`));
		if (!grows) {
			violations.push(violation('domain.aggregate.collection', relativeFile, `${property.name} grows with this.props.${property.name}.getNewItem().`));
		}
	}
	return violations;
}

/** Rule: domain.aggregate.nested. */
function aggregateNested(relativeFile: string, text: string, propsName: string, members: readonly ClassMember[]): ArchitectureViolation[] {
	const violations: ArchitectureViolation[] = [];
	for (const property of interfaceProperties(text, propsName) ?? []) {
		if (!(/\b[A-Za-z0-9_]+Props\s*\|\s*null\b/.test(property.type) || /\bnull\s*\|\s*[A-Za-z0-9_]+Props\b/.test(property.type))) continue;
		const getter = members.find((member) => member.kind === 'get' && member.name === property.name);
		if (!getter || !getter.use.returnsNull) {
			violations.push(violation('domain.aggregate.nested', relativeFile, `${property.name} is a nested props type or null. The getter returns null when the prop is missing.`));
		}
	}
	return violations;
}

function isForeignAggregateReference(type: string, ownName: string): boolean {
	if (/\bPropArray\b/.test(type) || /\bReadonlyArray\b/.test(type) || type.includes('[]')) return false;
	const names = [...type.matchAll(/\b([A-Za-z0-9_]+)EntityReference\b/g)].flatMap((match) => (match[1] ? [match[1]] : []));
	return names.some((name) => name !== ownName);
}

function pascalIdentifier(name: string): string {
	return name.charAt(0).toUpperCase() + name.slice(1);
}

function stringPatternOptions(relativeFile: string, text: string): ArchitectureViolation[] {
	return classShapes(text).flatMap((item) => stringPatternOnClass(relativeFile, item.name, item.extendsClause));
}

function stringPatternOnClass(relativeFile: string, className: string, extendsClause: string): ArchitectureViolation[] {
	if (!/\bVOString\s*\(/.test(extendsClause)) return [];
	const violations: ArchitectureViolation[] = [];
	const hasMin = /\bminLength\s*:/.test(extendsClause);
	const hasMax = /\bmaxLength\s*:/.test(extendsClause);
	const hasPattern = /pattern\s*:\s*\//.test(extendsClause);
	if (hasMin !== hasMax) {
		violations.push(violation('domain.value-objects.pattern', relativeFile, `${className} sets minLength and maxLength together. A plain string gets no class.`));
	} else if (!hasMin && !hasMax && !hasPattern) {
		violations.push(violation('domain.value-objects.pattern', relativeFile, `${className} is a plain string and gets no class. A VOString carries minLength and maxLength, or a pattern.`));
	}
	if (/\bpattern\s*:/.test(extendsClause) && !hasPattern) {
		violations.push(violation('domain.value-objects.pattern', relativeFile, `${className} pattern is a regex literal.`));
	}
	return violations;
}

function unexpectedFunctions(relativeFile: string, text: string, rule: string): ArchitectureViolation[] {
	return functionForms(text).map((name) => violation(rule, relativeFile, `${name} uses the word function. Skill code uses methods, getters, setters, and arrows.`));
}

/** Rule: domain.aggregate.member. Allowed members, plus the word function. */
function aggregateMember(relativeFile: string, text: string, members: readonly ClassMember[], hasClass: boolean, roleSubdomain: boolean): ArchitectureViolation[] {
	return [...(hasClass ? aggregateMembers(relativeFile, members, roleSubdomain) : []), ...unexpectedFunctions(relativeFile, text, 'domain.aggregate.member')];
}

/**
 * An ordinary aggregate may declare isNew, visa, getNewInstance, markAsNew, onSave, request*, and load*.
 * A role may also declare getDefaultRoleNames, getNewDefault*, and deleteAndReassignTo.
 * Other verbs belong in the application service. A constrained string setter uses ValueObjects.
 * Permission guards are left alone. This check does not require or reject them.
 * Rules: domain.aggregate.member, domain.aggregate.get-new-instance, domain.aggregate.setter
 */
function aggregateMembers(relativeFile: string, members: readonly ClassMember[], roleSubdomain = false): ArchitectureViolation[] {
	const violations: ArchitectureViolation[] = [];
	const allowedMethod = (name: string): boolean => {
		if (name === 'getNewInstance' || name === 'markAsNew' || name === 'onSave' || name.startsWith('request') || name.startsWith('load')) return true;
		if (!roleSubdomain) return false;
		return name === 'getDefaultRoleNames' || name === 'deleteAndReassignTo' || name.startsWith('getNewDefault');
	};
	for (const member of members) {
		if (member.kind === 'property' && member.name !== 'isNew' && member.name !== 'visa') {
			violations.push(violation('domain.aggregate.member', relativeFile, `${member.name} is not a skill field. The aggregate declares isNew and visa.`));
		}
		if (member.kind === 'method' && !allowedMethod(member.name) && !permissionGuard(member)) {
			const message = roleSubdomain
				? `${member.name} is not a role method. A role aggregate creates with getNewInstance and getNewDefault*Instance, lists defaults with getDefaultRoleNames, and reassigns with deleteAndReassignTo. Updates go through setters.`
				: `${member.name} is not a skill method. Create with getNewInstance and markAsNew, update through setters, add a child with requestNew*, and load a reference with load*. onSave may record a domain or integration event. Other verbs belong in the application service.`;
			violations.push(violation('domain.aggregate.member', relativeFile, message));
		}
		if (member.kind === 'method' && member.name.startsWith('requestNew') && !member.use.calls('getNewItem')) {
			violations.push(violation('domain.aggregate.member', relativeFile, `${member.name} returns new <Nested>(this.props.<nested>.getNewItem(), this.visa).`));
		}
		if (member.kind === 'constructor' && !member.use.touches('this.visa')) {
			violations.push(violation('domain.aggregate.member', relativeFile, 'The constructor assigns this.visa from passport.<context>.for<Subdomain>(this).'));
		}
	}
	if (!roleSubdomain && !members.some((member) => member.kind === 'method' && member.name === 'markAsNew')) {
		violations.push(violation('domain.aggregate.member', relativeFile, 'markAsNew sets isNew. getNewInstance calls it before the setters.'));
	}
	return violations;
}

/** A permission guard is not a skill method and is not a violation. The visa check on a setter is not written yet. */
function permissionGuard(member: ClassMember): boolean {
	if (member.name === 'validateVisa' || member.name.startsWith('ensureCan') || member.name.startsWith('validateManage')) return true;
	return member.use.mentions('PermissionError') || member.use.calls('determineIf');
}

/**
 * A child that needs a field on the aggregate or on a sibling takes `root`.
 * The aggregate passes `this`. A nested object passes that same `this.root`.
 * The child reads `this.root.<field>` and does not take the other object's props.
 */
function rootField(relativeFile: string, item: ClassShape, rule: string): ArchitectureViolation[] {
	const violations: ArchitectureViolation[] = [];
	const hasRoot = item.members.some((member) => member.kind === 'property' && member.name === 'root');
	const hasVisa = item.members.some((member) => member.kind === 'property' && member.name === 'visa');
	const constructor = item.members.find((member) => member.kind === 'constructor');
	const usesRoot = item.members.some((member) => member.kind !== 'property' && member.use.touches('this.root'));
	if ((hasRoot || usesRoot) && !constructor?.use.touches('this.root')) {
		violations.push(violation(rule, relativeFile, `${item.name} assigns this.root in the constructor body. A child reaches another level through this.root.<field>.`));
	}
	if (hasVisa && !constructor?.use.touches('this.visa')) {
		violations.push(violation(rule, relativeFile, `${item.name} assigns this.visa in the constructor body. A parameter property fails erasableSyntaxOnly.`));
	}
	return violations;
}

async function checkRootWiring(subdomainDir: string, relative: string, aggregateFile: string): Promise<ArchitectureViolation[]> {
	const violations: ArchitectureViolation[] = [];
	const files = (await listFiles(subdomainDir)).filter((fileName) => fileName.endsWith('.ts') && !fileName.endsWith('.test.ts'));
	const texts = new Map<string, string>();
	for (const fileName of files) {
		texts.set(fileName, await readText(path.join(subdomainDir, fileName)));
	}
	const rootClasses = new Map<string, string>();
	for (const [fileName, text] of texts) {
		if (fileName === aggregateFile || fileName === 'index.ts' || fileName.endsWith('.value-objects.ts')) continue;
		for (const ctor of constructorParameters(text)) {
			const root = ctor.parameters.find((parameter) => parameter.name === 'root');
			if (!root) continue;
			rootClasses.set(ctor.className, fileName);
			if (!/Root/.test(root.type)) {
				violations.push(violation('domain.nested.root', `${relative}/${fileName}`, `${ctor.className} types root as the interface on the aggregate that extends RootEventRegistry. It does not take the aggregate class.`));
			}
		}
	}
	if (rootClasses.size === 0) return violations;
	const aggregate = texts.get(aggregateFile) ?? '';
	const rootRegistry = interfacesNamed(aggregate, (name) => name.endsWith('AggregateRoot')).some((item) => item.heritage.some((heritage) => heritage.name === 'RootEventRegistry'));
	if (!rootRegistry) {
		violations.push(violation('domain.nested.root', `${relative}/${aggregateFile}`, 'Exports an interface extending RootEventRegistry. It lists the getters and request methods a child may call on another level.'));
	}
	for (const [fileName, text] of texts) {
		for (const call of constructions(text)) {
			if (!rootClasses.has(call.className)) continue;
			const passesRoot = fileName === aggregateFile ? call.arguments.includes('this') : call.arguments.includes('this.root');
			if (!passesRoot) {
				const passed = fileName === aggregateFile ? 'passes this' : 'passes this.root';
				violations.push(violation('domain.nested.root', `${relative}/${fileName}`, `${call.className} takes root. This call ${passed}. The child reads another level as this.root.<field>.`));
			}
		}
	}
	return violations;
}

function valueObjectMembers(relativeFile: string, members: readonly ClassMember[], rule: string): ArchitectureViolation[] {
	const violations: ArchitectureViolation[] = [];
	for (const member of members) {
		if (member.kind === 'property' && member.name !== 'visa' && member.name !== 'root') {
			violations.push(violation(rule, relativeFile, `${member.name} is not a skill field. The object declares visa, root, or both, and reads this.props. Another level is this.root.<field>.`));
		}
		if (member.kind === 'method' && member.name !== 'validateVisa' && !member.name.startsWith('request')) {
			violations.push(violation(rule, relativeFile, `${member.name} is not a skill method. The object has validateVisa, request* methods, getters, and setters. A request* method assigns through setters.`));
		}
	}
	return violations;
}

