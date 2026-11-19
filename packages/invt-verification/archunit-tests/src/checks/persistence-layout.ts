import path from 'node:path';
import { type ArchitectureViolation, violation } from '../architecture-violation.ts';
import { findRoleName, isKebabName, pascalFromKebab, singularFolder } from '../names.ts';
import { rule } from '../rule.ts';
import { directoryExists, listDirectories, listFiles, readText } from '../read-tree.ts';
import { type CodeUse, classShapes, functionForms, identifierPresent } from '../skill-members.ts';
import { exportedClasses, exportedConstNames, exportedInterfaceNames, hasParameterProperty, importsFragment } from '../typescript-text.ts';

/**
 * Persistence tree from cellix-rosetta `file-tree.md` and the persistence pages.
 * `datasources/domain/<context>` and `datasources/readonly/<context>` are checked
 * when those directories exist. GraphQL is not part of this check.
 */
export interface PersistenceLayoutConfig {
	/** Persistence package `src` directory, the one that contains `datasources/`. */
	persistenceRoot: string;
}

/** Domain persistence: the index, then each context, then each subdomain's adapter, repository, and unit of work. */
export async function checkPersistenceDomainLayout(config: PersistenceLayoutConfig): Promise<ArchitectureViolation[]> {
	const domainDir = path.join(config.persistenceRoot, 'datasources', 'domain');
	if (!(await directoryExists(domainDir))) return [];
	const contexts = await listDirectories(domainDir);
	let index = '';
	let indexMissing = false;
	try {
		index = await readText(path.join(domainDir, 'index.ts'));
	} catch {
		indexMissing = true;
	}
	const violations = [...(await rule('persistence.domain.index', () => persistenceDomainIndex(index, indexMissing, contexts.map((context) => context.name))))];
	for (const context of contexts) {
		violations.push(...(await rule('persistence.context.name', () => persistenceContextName(`datasources/domain/${context.name}`, context.name))));
		violations.push(...(await checkDomainContext(context.name, context.absolutePath)));
	}
	return violations;
}

/** Rule: persistence.domain.index. */
function persistenceDomainIndex(index: string, indexMissing: boolean, contextNames: readonly string[]): ArchitectureViolation[] {
	const violations: ArchitectureViolation[] = [];
	if (indexMissing) {
		violations.push(violation('persistence.domain.index', 'datasources/domain/index.ts', 'Adds `<Context>: <Context>ContextPersistence(models, passport)` for each context. It does not drop an existing context.'));
	}
	for (const name of contextNames) {
		if (index && !importsFragment(index, `./${name}/index.ts`)) {
			violations.push(violation('persistence.domain.index', 'datasources/domain/index.ts', `References ./${name}/index.ts.`));
		}
	}
	return violations;
}

/** Rule: persistence.context.name. */
function persistenceContextName(relative: string, name: string): ArchitectureViolation[] {
	const violations: ArchitectureViolation[] = [];
	if (!isKebabName(name)) violations.push(violation('persistence.context.name', relative, 'A context folder is kebab-case.'));
	const singular = singularFolder(name);
	if (singular) violations.push(violation('persistence.context.name', relative, `A context folder is singular. ${name} is ${singular}.`));
	return violations;
}

/** Readonly persistence: the root files, then each context, then each subdomain's data source and read repository. getAll and getById are not required. */
export async function checkPersistenceReadonlyLayout(config: PersistenceLayoutConfig): Promise<ArchitectureViolation[]> {
	const readonlyDir = path.join(config.persistenceRoot, 'datasources', 'readonly');
	if (!(await directoryExists(readonlyDir))) return [];
	const files = await listFiles(readonlyDir);
	const contexts = await listDirectories(readonlyDir);
	let index = '';
	let indexMissing = false;
	try {
		index = await readText(path.join(readonlyDir, 'index.ts'));
	} catch {
		indexMissing = true;
	}
	const violations = [
		...(await rule('persistence.readonly.files', () => readonlyRootFiles(files))),
		...(await rule('persistence.readonly.index', () => readonlyIndex(index, indexMissing, contexts.map((context) => context.name)))),
	];
	for (const context of contexts) {
		violations.push(...(await rule('persistence.context.name', () => persistenceContextName(`datasources/readonly/${context.name}`, context.name))));
		violations.push(...(await checkReadonlyContext(context.name, context.absolutePath)));
	}
	return violations;
}

/** Rule: persistence.readonly.files at the readonly root. Subdomain files use the same rule from `readonlySubdomainFiles`. */
function readonlyRootFiles(files: readonly string[]): ArchitectureViolation[] {
	return files
		.filter((fileName) => fileName !== 'index.ts' && fileName !== 'mongo-data-source.ts')
		.map((fileName) => violation('persistence.readonly.files', `datasources/readonly/${fileName}`, 'readonly/ keeps index.ts, mongo-data-source.ts, and one directory per context. mongo-data-source.ts is not rewritten.'));
}

/** Rule: persistence.readonly.index. */
function readonlyIndex(index: string, indexMissing: boolean, contextNames: readonly string[]): ArchitectureViolation[] {
	const violations: ArchitectureViolation[] = [];
	if (indexMissing) violations.push(violation('persistence.readonly.index', 'datasources/readonly/index.ts', 'The readonly index adds each context. It does not drop one.'));
	for (const name of contextNames) {
		if (index && !importsFragment(index, `./${name}/`)) {
			violations.push(violation('persistence.readonly.index', 'datasources/readonly/index.ts', `References ./${name}/ for the context that exists.`));
		}
	}
	return violations;
}

async function checkDomainContext(context: string, contextDir: string): Promise<ArchitectureViolation[]> {
	const relative = `datasources/domain/${context}`;
	const pascal = pascalFromKebab(context);
	const files = await listFiles(contextDir);
	const subdomains = await listDirectories(contextDir);
	const index = files.includes('index.ts') ? await readText(path.join(contextDir, 'index.ts')) : '';
	const violations = [
		...(await rule('persistence.context.files', () => persistenceContextFiles(relative, pascal, files))),
		...(await rule('persistence.context.factory', () => persistenceContextFactory(relative, pascal, files, index, subdomains.map((subdomain) => subdomain.name)))),
	];
	for (const subdomain of subdomains) violations.push(...(await checkDomainSubdomain(context, subdomain.name, subdomain.absolutePath)));
	return violations;
}

/** Rule: persistence.context.files. */
function persistenceContextFiles(relative: string, pascal: string, files: readonly string[]): ArchitectureViolation[] {
	const violations: ArchitectureViolation[] = [];
	if (!files.includes('index.ts')) violations.push(violation('persistence.context.files', `${relative}/index.ts`, `Exports const ${pascal}ContextPersistence.`));
	for (const fileName of files) {
		if (fileName === 'index.ts' || fileName.endsWith('.test.ts')) continue;
		violations.push(violation('persistence.context.files', `${relative}/${fileName}`, 'Role files live in datasources/domain/<context>/<subdomain>/. The context folder holds index.ts and those directories.'));
	}
	return violations;
}

/** Rule: persistence.context.factory. */
function persistenceContextFactory(relative: string, pascal: string, files: readonly string[], index: string, subdomainNames: readonly string[]): ArchitectureViolation[] {
	if (!files.includes('index.ts')) return [];
	const violations: ArchitectureViolation[] = [];
	if (!exportedConstNames(index).includes(`${pascal}ContextPersistence`)) {
		violations.push(violation('persistence.context.factory', `${relative}/index.ts`, `Exports const ${pascal}ContextPersistence(models, passport).`));
	}
	for (const name of subdomainNames) {
		if (!importsFragment(index, `./${name}/index.ts`) && !importsFragment(index, `./${name}/`)) {
			violations.push(violation('persistence.context.factory', `${relative}/index.ts`, `References the ${name} subdomain.`));
		}
	}
	return violations;
}

async function checkDomainSubdomain(context: string, subdomain: string, subdomainDir: string): Promise<ArchitectureViolation[]> {
	const violations: ArchitectureViolation[] = [];
	const relative = `datasources/domain/${context}/${subdomain}`;
	violations.push(...(await rule('persistence.subdomain.name', () => persistenceSubdomainName(relative, subdomain))));
	const pascal = pascalFromKebab(subdomain);
	const required = [`${subdomain}.domain-adapter.ts`, `${subdomain}.repository.ts`, `${subdomain}.uow.ts`, 'index.ts'];
	const files = await listFiles(subdomainDir);
	const directories = await listDirectories(subdomainDir);
	violations.push(...(await rule('persistence.subdomain.files', () => persistenceSubdomainFiles(relative, files, required, directories.map((directory) => directory.name)))));
	if (files.includes(`${subdomain}.domain-adapter.ts`)) {
		violations.push(...(await checkAdapter(path.join(subdomainDir, `${subdomain}.domain-adapter.ts`), `${relative}/${subdomain}.domain-adapter.ts`, pascal)));
	}
	if (files.includes(`${subdomain}.repository.ts`)) {
		violations.push(...(await checkRepository(path.join(subdomainDir, `${subdomain}.repository.ts`), `${relative}/${subdomain}.repository.ts`, pascal)));
	}
	if (files.includes(`${subdomain}.uow.ts`)) {
		violations.push(...(await checkUnitOfWork(path.join(subdomainDir, `${subdomain}.uow.ts`), `${relative}/${subdomain}.uow.ts`, pascal)));
	}
	if (files.includes('index.ts')) {
		const index = await readText(path.join(subdomainDir, 'index.ts'));
		const uowFile = `${subdomain}.uow.ts`;
		const uowText = files.includes(uowFile) ? await readText(path.join(subdomainDir, uowFile)) : '';
		violations.push(...(await rule('persistence.subdomain.barrel', () => persistenceSubdomainBarrel(relative, pascal, files, index, uowFile, uowText, subdomain))));
		violations.push(...(await rule('persistence.subdomain.factory', () => persistenceSubdomainFactory(relative, pascal, subdomain, index, uowText))));
	}
	return violations;
}

/** Rule: persistence.subdomain.files. */
function persistenceSubdomainFiles(relative: string, files: readonly string[], required: readonly string[], directories: readonly string[]): ArchitectureViolation[] {
	const violations: ArchitectureViolation[] = [];
	for (const fileName of required) {
		if (!files.includes(fileName)) violations.push(violation('persistence.subdomain.files', `${relative}/${fileName}`, 'A persistence subdomain owns the domain adapter, the repository, the unit of work, and index.ts.'));
	}
	for (const fileName of files) {
		if (required.includes(fileName) || fileName.endsWith('.test.ts')) continue;
		violations.push(violation('persistence.subdomain.files', `${relative}/${fileName}`, 'Not a persistence role file for this subdomain.'));
	}
	for (const name of directories) violations.push(violation('persistence.subdomain.files', `${relative}/${name}`, 'A persistence subdomain has no nested folders.'));
	return violations;
}

/** Rule: persistence.subdomain.name. */
function persistenceSubdomainName(relative: string, subdomain: string): ArchitectureViolation[] {
	const violations: ArchitectureViolation[] = [];
	if (!isKebabName(subdomain)) violations.push(violation('persistence.subdomain.name', relative, 'A subdomain folder is kebab-case.'));
	const singular = singularFolder(subdomain);
	if (singular) violations.push(violation('persistence.subdomain.name', relative, `A subdomain folder is singular. ${subdomain} is ${singular}.`));
	return violations;
}

/** Rule: persistence.subdomain.barrel. */
function persistenceSubdomainBarrel(relative: string, pascal: string, files: readonly string[], index: string, uowFile: string, uowText: string, subdomain: string): ArchitectureViolation[] {
	const violations: ArchitectureViolation[] = [];
	if (files.includes(uowFile) && !importsFragment(index, `./${uowFile}`)) {
		violations.push(violation('persistence.subdomain.barrel', `${relative}/index.ts`, `References ./${uowFile}. The skill's factory imports get${pascal}UnitOfWork from that file. An \`export * from\` barrel keeps that form.`));
	}
	for (const fileName of [`${subdomain}.domain-adapter.ts`, `${subdomain}.repository.ts`]) {
		if (!files.includes(fileName)) continue;
		if (!importsFragment(uowText, `./${fileName}`) && !importsFragment(index, `./${fileName}`)) {
			violations.push(violation('persistence.subdomain.barrel', `${relative}/${uowFile}`, `References ./${fileName}. The unit of work builds the converter and the repository.`));
		}
	}
	return violations;
}

/** Rule: persistence.subdomain.factory. */
function persistenceSubdomainFactory(relative: string, pascal: string, subdomain: string, index: string, uowText: string): ArchitectureViolation[] {
	if (findRoleName([...exportedConstNames(index), ...exportedConstNames(uowText)], subdomain, 'Persistence')) return [];
	return [violation('persistence.subdomain.factory', `${relative}/index.ts`, `Defines ${pascal}Persistence, on the index or on the unit-of-work file when the barrel is \`export * from\`.`)];
}

/**
 * An adapter exports DomainAdapter and Converter, assigns doc in the constructor body,
 * and has only a constructor, getters, and setters. Rules: persistence.adapter.shape, persistence.adapter.doc, persistence.adapter.member, persistence.adapter.nested
 */
async function checkAdapter(filePath: string, relativeFile: string, pascal: string): Promise<ArchitectureViolation[]> {
	const text = await readText(filePath);
	const shapes = classShapes(text);
	return [
		...(await rule('persistence.adapter.shape', () => adapterShape(relativeFile, pascal, text))),
		...(await rule('persistence.adapter.doc', () => adapterDoc(relativeFile, text))),
		...(await rule('persistence.adapter.member', () => adapterMember(relativeFile, text, shapes))),
		...(await rule('persistence.adapter.nested', () => adapterNested(relativeFile, shapes))),
	];
}

/** Rule: persistence.adapter.shape. */
function adapterShape(relativeFile: string, pascal: string, text: string): ArchitectureViolation[] {
	const violations: ArchitectureViolation[] = [];
	const classes = exportedClasses(text);
	if (!classes.some((item) => item.name === `${pascal}DomainAdapter`)) {
		violations.push(violation('persistence.adapter.shape', relativeFile, `Exports class ${pascal}DomainAdapter. It implements the aggregate props.`));
	}
	if (!classes.some((item) => item.name === `${pascal}Converter`)) {
		violations.push(violation('persistence.adapter.shape', relativeFile, `Exports class ${pascal}Converter extends MongoTypeConverter.`));
	}
	return violations;
}

/** Rule: persistence.adapter.doc. */
function adapterDoc(relativeFile: string, text: string): ArchitectureViolation[] {
	if (!hasParameterProperty(text)) return [];
	return [violation('persistence.adapter.doc', relativeFile, 'Declare readonly doc and assign this.doc in the constructor body.')];
}

/** Rule: persistence.adapter.member. */
function adapterMember(relativeFile: string, text: string, shapes: ReturnType<typeof classShapes>): ArchitectureViolation[] {
	const violations = shapes.flatMap((item) => item.members.filter((member) => member.kind === 'method').map((member) => violation('persistence.adapter.member', relativeFile, `${item.name}.${member.name} is not a skill method. An adapter has a constructor, getters, and setters.`)));
	violations.push(...functionForms(text).map((name) => violation('persistence.adapter.member', relativeFile, `${name} uses the word function.`)));
	return violations;
}

/** Rule: persistence.adapter.nested. */
function adapterNested(relativeFile: string, shapes: ReturnType<typeof classShapes>): ArchitectureViolation[] {
	const violations: ArchitectureViolation[] = [];
	for (const item of shapes) {
		for (const member of item.members) {
			if (member.kind === 'get' && member.use.returnsNull && member.use.touches('this.doc.set')) {
				violations.push(violation('persistence.adapter.nested', relativeFile, `${item.name}.${member.name} returns null when the path is missing and does not create the subdocument.`));
			}
		}
	}
	return violations;
}

/**
 * The repository class extends MongoRepositoryBase.
 * A written getById loads findById and throws. A written getNewInstance adapts a new model.
 * Neither method is required. Rules: persistence.repository.shape, persistence.repository.methods, persistence.repository.missing, persistence.repository.helper, persistence.repository.save
 */
async function checkRepository(filePath: string, relativeFile: string, pascal: string): Promise<ArchitectureViolation[]> {
	const text = await readText(filePath);
	const members = classShapes(text).find((item) => item.name === `${pascal}Repository`)?.members ?? [];
	const methods = members.filter((member) => member.kind === 'method');
	return [
		...(await rule('persistence.repository.shape', () => repositoryShape(relativeFile, pascal, text))),
		...(await rule('persistence.repository.methods', () => repositoryMethods(relativeFile, methods))),
		...(await rule('persistence.repository.missing', () => repositoryMissing(relativeFile, methods))),
		...(await rule('persistence.repository.helper', () => repositoryHelper(relativeFile, text, methods))),
		...(await rule('persistence.repository.save', () => repositorySave(relativeFile, methods))),
	];
}

/** Rule: persistence.repository.shape. */
function repositoryShape(relativeFile: string, pascal: string, text: string): ArchitectureViolation[] {
	const repository = exportedClasses(text).find((item) => item.name === `${pascal}Repository`);
	if (!repository) return [violation('persistence.repository.shape', relativeFile, `Exports class ${pascal}Repository.`)];
	if (!/\bMongoRepositoryBase\b/.test(repository.extendsClause)) {
		return [violation('persistence.repository.shape', relativeFile, `${pascal}Repository extends MongoRepositoryBase and implements the domain ${pascal}Repository.`)];
	}
	return [];
}

/** Rule: persistence.repository.methods. A written getById or getNewInstance has the skill shape. Neither method is required. */
function repositoryMethods(relativeFile: string, methods: readonly { name: string; use: CodeUse }[]): ArchitectureViolation[] {
	const violations: ArchitectureViolation[] = [];
	const getById = methods.find((member) => member.name === 'getById');
	const getNewInstance = methods.find((member) => member.name === 'getNewInstance');
	if (getById && !getById.use.calls('findById')) {
		violations.push(violation('persistence.repository.methods', relativeFile, 'getById loads this.model.findById(id) and throws when the document is missing.'));
	}
	if (getNewInstance && !getNewInstance.use.calls('getNewInstance')) {
		violations.push(violation('persistence.repository.methods', relativeFile, 'getNewInstance adapts new this.model() and forwards the same root scalars the aggregate takes.'));
	}
	if (getNewInstance && !getNewInstance.use.calls('toAdapter')) {
		violations.push(violation('persistence.repository.methods', relativeFile, 'getNewInstance adapts new this.model() through typeConverter.toAdapter, then calls the aggregate getNewInstance.'));
	}
	return violations;
}

/** Rule: persistence.repository.missing. */
function repositoryMissing(relativeFile: string, methods: readonly { name: string; use: CodeUse }[]): ArchitectureViolation[] {
	const getById = methods.find((member) => member.name === 'getById');
	if (getById && (!getById.use.calls('toDomain') || !getById.use.throws || getById.use.returnsNull)) {
		return [violation('persistence.repository.missing', relativeFile, 'getById calls typeConverter.toDomain and throws when the document is missing. It does not return null. save stays on MongoRepositoryBase.')];
	}
	return [];
}

/** Rule: persistence.repository.helper. */
function repositoryHelper(relativeFile: string, text: string, methods: readonly { name: string; isPrivate?: boolean }[]): ArchitectureViolation[] {
	const violations = methods.filter((member) => member.isPrivate).map((member) => violation('persistence.repository.helper', relativeFile, `${member.name} is a helper. A repository method is part of the repository. A helper is not.`));
	violations.push(...functionForms(text).map((name) => violation('persistence.repository.helper', relativeFile, `${name} uses the word function. A helper is not a repository method.`)));
	return violations;
}

/** Rule: persistence.repository.save. */
function repositorySave(relativeFile: string, methods: readonly { name: string; use: CodeUse }[]): ArchitectureViolation[] {
	const save = methods.find((member) => member.name === 'save');
	if (save && !save.use.touches('super.save')) {
		return [violation('persistence.repository.save', relativeFile, 'save stays on MongoRepositoryBase. A local save calls super.save.')];
	}
	return [];
}

/** get<Subdomain>UnitOfWork is an arrow that returns getInitializedUnitOfWork. Rule: persistence.uow.shape */
async function checkUnitOfWork(filePath: string, relativeFile: string, pascal: string): Promise<ArchitectureViolation[]> {
	const text = await readText(filePath);
	return rule('persistence.uow.shape', () => persistenceUnitOfWorkShape(relativeFile, pascal, text));
}

/** Rule: persistence.uow.shape. */
function persistenceUnitOfWorkShape(relativeFile: string, pascal: string, text: string): ArchitectureViolation[] {
	const violations: ArchitectureViolation[] = [];
	if (!identifierPresent(text, `get${pascal}UnitOfWork`)) {
		violations.push(violation('persistence.uow.shape', relativeFile, `Defines get${pascal}UnitOfWork(model, passport).`));
	}
	if (!identifierPresent(text, 'MongoUnitOfWork') || !identifierPresent(text, 'getInitializedUnitOfWork')) {
		violations.push(violation('persistence.uow.shape', relativeFile, 'Builds a MongoUnitOfWork and returns getInitializedUnitOfWork with the passport.'));
	}
	if (classShapes(text).length > 0 || functionForms(text).length > 0) {
		violations.push(violation('persistence.uow.shape', relativeFile, 'get<Subdomain>UnitOfWork is an arrow. The file does not declare a class or a function.'));
	}
	return violations;
}

async function checkReadonlyContext(context: string, contextDir: string): Promise<ArchitectureViolation[]> {
	const relative = `datasources/readonly/${context}`;
	const files = await listFiles(contextDir);
	const subdomains = await listDirectories(contextDir);
	const index = files.includes('index.ts') ? await readText(path.join(contextDir, 'index.ts')) : '';
	const violations = [...(await rule('persistence.readonly.context', () => readonlyContext(relative, files, index, subdomains.map((subdomain) => subdomain.name))))];
	for (const subdomain of subdomains) violations.push(...(await checkReadonlySubdomain(context, subdomain.name, subdomain.absolutePath)));
	return violations;
}

/** Rule: persistence.readonly.context. */
function readonlyContext(relative: string, files: readonly string[], index: string, subdomainNames: readonly string[]): ArchitectureViolation[] {
	const violations: ArchitectureViolation[] = [];
	if (!files.includes('index.ts')) {
		violations.push(violation('persistence.readonly.context', `${relative}/index.ts`, 'The context index returns one property per subdomain read repository.'));
	}
	for (const fileName of files) {
		if (fileName === 'index.ts' || fileName.endsWith('.test.ts')) continue;
		violations.push(violation('persistence.readonly.context', `${relative}/${fileName}`, 'Read files live in datasources/readonly/<context>/<subdomain>/.'));
	}
	if (files.includes('index.ts')) {
		for (const name of subdomainNames) {
			if (!importsFragment(index, `./${name}/`)) violations.push(violation('persistence.readonly.context', `${relative}/index.ts`, `References ./${name}/.`));
		}
	}
	return violations;
}

async function checkReadonlySubdomain(context: string, subdomain: string, subdomainDir: string): Promise<ArchitectureViolation[]> {
	const relative = `datasources/readonly/${context}/${subdomain}`;
	const violations = [...(await rule('persistence.subdomain.name', () => persistenceSubdomainName(relative, subdomain)))];
	const pascal = pascalFromKebab(subdomain);
	const required = [`${subdomain}.data.ts`, `${subdomain}.read-repository.ts`, 'index.ts'];
	const files = await listFiles(subdomainDir);
	violations.push(...(await rule('persistence.readonly.files', () => readonlySubdomainFiles(relative, files, required))));
	if (files.includes(`${subdomain}.data.ts`)) {
		violations.push(...(await rule('persistence.readonly.data', async () => readonlyData(relative, subdomain, pascal, await readText(path.join(subdomainDir, `${subdomain}.data.ts`))))));
	}
	if (files.includes(`${subdomain}.read-repository.ts`)) {
		const text = await readText(path.join(subdomainDir, `${subdomain}.read-repository.ts`));
		const methods = classShapes(text).flatMap((item) => item.members);
		violations.push(...(await rule('persistence.readonly.repository', () => readonlyRepository(relative, subdomain, pascal, text, methods))));
		violations.push(...(await rule('persistence.readonly.missing', () => readonlyMissing(relative, subdomain, methods))));
	}
	if (files.includes('index.ts')) {
		violations.push(...(await rule('persistence.readonly.barrel', async () => readonlyBarrel(relative, subdomain, files, await readText(path.join(subdomainDir, 'index.ts'))))));
	}
	return violations;
}

/** Rule: persistence.readonly.files for a subdomain folder. */
function readonlySubdomainFiles(relative: string, files: readonly string[], required: readonly string[]): ArchitectureViolation[] {
	const violations: ArchitectureViolation[] = [];
	for (const fileName of required) {
		if (!files.includes(fileName)) violations.push(violation('persistence.readonly.files', `${relative}/${fileName}`, 'A readonly subdomain owns <subdomain>.data.ts, <subdomain>.read-repository.ts, and index.ts.'));
	}
	for (const fileName of files) {
		if (required.includes(fileName) || fileName.endsWith('.test.ts')) continue;
		violations.push(violation('persistence.readonly.files', `${relative}/${fileName}`, 'Not a readonly role file for this subdomain.'));
	}
	return violations;
}

/** Rule: persistence.readonly.data. */
function readonlyData(relative: string, subdomain: string, pascal: string, text: string): ArchitectureViolation[] {
	const violations: ArchitectureViolation[] = [];
	if (!exportedInterfaceNames(text).includes(`${pascal}DataSource`)) {
		violations.push(violation('persistence.readonly.data', `${relative}/${subdomain}.data.ts`, `Exports interface ${pascal}DataSource extends MongoDataSource.`));
	}
	if (!exportedClasses(text).some((item) => item.name === `${pascal}DataSourceImpl`)) {
		violations.push(violation('persistence.readonly.data', `${relative}/${subdomain}.data.ts`, `Exports class ${pascal}DataSourceImpl extends MongoDataSourceImpl.`));
	}
	return violations;
}

/** Rule: persistence.readonly.repository. getAll and getById are not required. A written getAll maps through toDomain. */
function readonlyRepository(relative: string, subdomain: string, pascal: string, text: string, methods: readonly { kind: string; name: string; use: CodeUse }[]): ArchitectureViolation[] {
	const violations: ArchitectureViolation[] = [];
	if (!exportedInterfaceNames(text).includes(`${pascal}ReadRepository`)) {
		violations.push(violation('persistence.readonly.repository', `${relative}/${subdomain}.read-repository.ts`, `Exports interface ${pascal}ReadRepository.`));
	}
	const getAll = methods.find((member) => member.kind === 'method' && member.name === 'getAll');
	if (getAll && !getAll.use.calls('toDomain')) {
		violations.push(violation('persistence.readonly.repository', `${relative}/${subdomain}.read-repository.ts`, 'getAll maps each document through converter.toDomain.'));
	}
	return violations;
}

/** Rule: persistence.readonly.missing. */
function readonlyMissing(relative: string, subdomain: string, methods: readonly { kind: string; name: string; use: CodeUse }[]): ArchitectureViolation[] {
	const getById = methods.find((member) => member.kind === 'method' && member.name === 'getById');
	if (getById && (!getById.use.calls('findById') || !getById.use.calls('toDomain') || !getById.use.returnsNull)) {
		return [violation('persistence.readonly.missing', `${relative}/${subdomain}.read-repository.ts`, 'getById loads findById, returns null when the document is missing, and otherwise returns converter.toDomain.')];
	}
	return [];
}

/** Rule: persistence.readonly.barrel. */
function readonlyBarrel(relative: string, subdomain: string, files: readonly string[], index: string): ArchitectureViolation[] {
	if (files.includes(`${subdomain}.read-repository.ts`) && !importsFragment(index, `./${subdomain}.read-repository.ts`)) {
		return [violation('persistence.readonly.barrel', `${relative}/index.ts`, `References ./${subdomain}.read-repository.ts. An existing export * barrel stays that way.`)];
	}
	return [];
}
