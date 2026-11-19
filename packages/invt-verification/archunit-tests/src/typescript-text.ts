import { classShapes, hasParameterProperty, identifierPresent, moduleSpecifiers, parse } from './skill-members.ts';
import ts from 'typescript';

export { hasParameterProperty, identifierPresent };

export interface ExportedClass {
	name: string;
	extendsClause: string;
	body: string;
}

/** Exported classes. The body is empty only when the class declares no members. */
export function exportedClasses(source: string): ExportedClass[] {
	return classShapes(source)
		.filter((item) => item.exported)
		.map((item) => ({
			name: item.name,
			extendsClause: item.extendsClause,
			body: item.members.length === 0 ? '' : 'member',
		}));
}

export function classBodyIsEmpty(body: string): boolean {
	return body.trim().length === 0;
}

export function exportedConstNames(source: string): string[] {
	const file = parse(source);
	const names: string[] = [];
	for (const statement of file.statements) {
		if (!ts.isVariableStatement(statement) || !hasExport(statement)) continue;
		if ((statement.declarationList.flags & ts.NodeFlags.Const) === 0) continue;
		for (const declaration of statement.declarationList.declarations) {
			if (ts.isIdentifier(declaration.name)) names.push(declaration.name.text);
		}
	}
	return names;
}

export function exportedInterfaceNames(source: string): string[] {
	const file = parse(source);
	return file.statements.flatMap((statement) => (ts.isInterfaceDeclaration(statement) && hasExport(statement) ? [statement.name.text] : []));
}

/** An identifier in the tree. The word `function` is a function declaration or expression, not an identifier. */
export function mentionsWord(source: string, word: string): boolean {
	if (word === 'function') return functionKeyword(source);
	return identifierPresent(source, word);
}

export function importsSpecifier(source: string, specifierPrefix: string): boolean {
	return moduleSpecifiers(source).some((specifier) => specifier === specifierPrefix || specifier.startsWith(`${specifierPrefix}/`));
}

/** A module specifier that contains this path, such as `./score/index.ts`. */
export function importsFragment(source: string, fragment: string): boolean {
	return moduleSpecifiers(source).some((specifier) => specifier.includes(fragment));
}

function functionKeyword(source: string): boolean {
	const file = parse(source);
	let found = false;
	const visit = (node: ts.Node): void => {
		if (found) return;
		if (ts.isFunctionDeclaration(node) || ts.isFunctionExpression(node)) {
			found = true;
			return;
		}
		ts.forEachChild(node, visit);
	};
	visit(file);
	return found;
}

function hasExport(node: ts.Node): boolean {
	return (ts.canHaveModifiers(node) ? ts.getModifiers(node) : undefined)?.some((modifier) => modifier.kind === ts.SyntaxKind.ExportKeyword) ?? false;
}
