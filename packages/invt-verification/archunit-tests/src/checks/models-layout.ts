import path from 'node:path';
import { type ArchitectureViolation, violation } from '../architecture-violation.ts';
import { isKebabName, pascalFromKebab, singularFolder } from '../names.ts';
import { rule } from '../rule.ts';
import { directoryExists, listDirectories, listFiles, readText } from '../read-tree.ts';
import { functionForms, identifierPresent, interfaceHeritage, objectLiterals } from '../skill-members.ts';
import { exportedConstNames, exportedInterfaceNames, importsFragment } from '../typescript-text.ts';

/**
 * Model tree from cellix-rosetta `file-tree.md` and `files/subdomain.model.md`.
 *
 * A `*.model.ts` file sitting directly in `models/` is the previous layout.
 * This check starts when `models/<subdomain>/` exists, and then that folder
 * may not drift from `<subdomain>.model.ts`. The example document lives in
 * `apps/server-mongodb-memory-mock/src/seed`, not beside the schema.
 */
export interface ModelsLayoutConfig {
	/** Models package `src` directory, the one that contains `models/`. */
	modelsRoot: string;
}

export async function checkModelsLayout(config: ModelsLayoutConfig): Promise<ArchitectureViolation[]> {
	const modelsDir = path.join(config.modelsRoot, 'models');
	if (!(await directoryExists(modelsDir))) return [];
	let packageIndex = '';
	let indexMissing = false;
	try {
		packageIndex = await readText(path.join(config.modelsRoot, 'index.ts'));
	} catch {
		indexMissing = true;
	}
	const subdomains = await listDirectories(modelsDir);
	const violations = [...(await rule('models.index', () => modelIndexMissing(indexMissing)))];
	for (const subdomain of subdomains) {
		violations.push(...(await rule('models.subdomain.name', () => modelSubdomainName(subdomain.name))));
		violations.push(...(await checkModelFolder(subdomain.name, subdomain.absolutePath, packageIndex)));
	}
	return violations;
}

/** Rule: models.index. The package index file exists. */
function modelIndexMissing(indexMissing: boolean): ArchitectureViolation[] {
	if (!indexMissing) return [];
	return [violation('models.index', 'index.ts', 'The package index registers each model factory on the builder that already exists.')];
}

/** Rule: models.subdomain.name. */
function modelSubdomainName(name: string): ArchitectureViolation[] {
	const violations: ArchitectureViolation[] = [];
	if (!isKebabName(name)) violations.push(violation('models.subdomain.name', `models/${name}`, 'A model folder is the kebab subdomain.'));
	const singular = singularFolder(name);
	if (singular) violations.push(violation('models.subdomain.name', `models/${name}`, `A subdomain folder is singular. ${name} is ${singular}.`));
	return violations;
}

/**
 * String constraints follow the same pair a VOString carries: minLength and maxLength,
 * plus pattern when the sheet already has a regex. A mongoose string field states that
 * as minlength, maxlength, and match. A union stored as String has none of those, so
 * it is left alone. An ObjectId with ref is an id of another model. An ObjectId with
 * no ref is a stored id, and this check cannot tell that from a foreign id.
 */
/** Rule: models.schema.pattern. A plain string schema is left alone. */
function schemaPattern(relativeFile: string, source: string): ArchitectureViolation[] {
	const violations: ArchitectureViolation[] = [];
	for (const properties of objectLiterals(source)) {
		const type = properties.find((property) => property.name === 'type');
		if (type?.text !== 'String') continue;
		const hasMin = properties.some((property) => property.name === 'minlength');
		const hasMax = properties.some((property) => property.name === 'maxlength');
		const match = properties.find((property) => property.name === 'match');
		if ((hasMin || hasMax || match) && (!hasMin || !hasMax)) {
			violations.push(violation('models.schema.pattern', relativeFile, 'A constrained string sets minlength and maxlength together, the same pair VOString uses. match is the pattern, and it is a regex literal.'));
		}
		if (match && !match.regex) violations.push(violation('models.schema.pattern', relativeFile, 'match is a regex literal, the VOString pattern.'));
	}
	return violations;
}

/** Rule: models.schema.reference. */
function schemaReference(relativeFile: string, source: string): ArchitectureViolation[] {
	const violations: ArchitectureViolation[] = [];
	for (const properties of objectLiterals(source)) {
		const isObjectId = properties.some((property) => property.text === 'Schema.Types.ObjectId' || property.text === 'Types.ObjectId');
		if (properties.some((property) => property.name === 'ref') && !isObjectId) {
			violations.push(violation('models.schema.reference', relativeFile, 'ref marks an id of another model, so the field type is Schema.Types.ObjectId. An ObjectId with no ref is a stored id and is not checked as a subdomain reference.'));
		}
	}
	return violations;
}

async function checkModelFolder(subdomain: string, folder: string, packageIndex: string): Promise<ArchitectureViolation[]> {
	const relative = `models/${subdomain}`;
	const pascal = pascalFromKebab(subdomain);
	const modelFile = `${subdomain}.model.ts`;
	const files = await listFiles(folder);
	const modelText = files.includes(modelFile) ? await readText(path.join(folder, modelFile)) : '';
	const modelRelative = `${relative}/${modelFile}`;
	return [
		...(await rule('models.files', () => modelFiles(relative, files, modelFile))),
		...(await rule('models.schema', () => (modelText ? modelSchema(modelRelative, pascal, modelText) : []))),
		...(await rule('models.schema.pattern', () => (modelText ? schemaPattern(modelRelative, modelText) : []))),
		...(await rule('models.schema.reference', () => (modelText ? schemaReference(modelRelative, modelText) : []))),
		...(await rule('models.index', () => modelIndexRegistration(packageIndex, files.includes(modelFile), subdomain, modelFile, pascal))),
	];
}

/** Rule: models.index. The package index registers the model factory. */
function modelIndexRegistration(packageIndex: string, hasModel: boolean, subdomain: string, modelFile: string, pascal: string): ArchitectureViolation[] {
	if (!packageIndex || !hasModel || importsFragment(packageIndex, `./models/${subdomain}/${modelFile}`)) return [];
	return [violation('models.index', 'index.ts', `Registers ${pascal}ModelFactory from ./models/${subdomain}/${modelFile}.`)];
}

/** Rule: models.files. */
function modelFiles(relative: string, files: readonly string[], modelFile: string): ArchitectureViolation[] {
	const violations: ArchitectureViolation[] = [];
	if (!files.includes(modelFile)) violations.push(violation('models.files', `${relative}/${modelFile}`, 'A model folder owns <subdomain>.model.ts. The example document is the memory-mock seed, not a file in this folder.'));
	for (const fileName of files) {
		if (fileName === modelFile || fileName.endsWith('.test.ts')) continue;
		violations.push(violation('models.files', `${relative}/${fileName}`, 'Not a model role file. This folder holds the schema. The example document is the memory-mock seed.'));
	}
	return violations;
}

/** Rule: models.schema. */
function modelSchema(relativeFile: string, pascal: string, text: string): ArchitectureViolation[] {
	const violations: ArchitectureViolation[] = [];
	if (!exportedInterfaceNames(text).includes(pascal)) violations.push(violation('models.schema', relativeFile, `Exports interface ${pascal} extends MongooseSeedwork.Base.`));
	else if (!interfaceHeritage(text, pascal)?.some((item) => item.name === 'MongooseSeedwork.Base')) violations.push(violation('models.schema', relativeFile, `${pascal} extends MongooseSeedwork.Base.`));
	if (!exportedConstNames(text).includes(`${pascal}ModelName`) || !exportedConstNames(text).includes(`${pascal}ModelFactory`)) {
		violations.push(violation('models.schema', relativeFile, `Exports ${pascal}ModelName and ${pascal}ModelFactory.`));
	}
	if (!identifierPresent(text, 'collection')) violations.push(violation('models.schema', relativeFile, 'The schema options set collection from the sheet collection: line.'));
	for (const name of functionForms(text)) violations.push(violation('models.schema', relativeFile, `${name} uses the word function. A model file declares the interface, the schema, ModelName, and ModelFactory.`));
	return violations;
}
