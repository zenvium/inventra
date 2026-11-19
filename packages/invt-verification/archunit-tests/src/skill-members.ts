import ts from 'typescript';

/**
 * Member lists for the class and interface shapes in the cellix-rosetta pages.
 * A member that is not one of those shapes is a violation.
 */
/** Calls, assignments, and returns taken from a method body. Comments and string contents are not included. */
export interface CodeUse {
	calls(name: string): boolean;
	/** `new Name(...)` inside the body. */
	constructs(name: string): boolean;
	touches(path: string): boolean;
	/** An access such as `role.props.roleName` or `this.props.id`. */
	touchesProps(): boolean;
	assigns(name: string, value: string): boolean;
	mentions(name: string): boolean;
	readonly returnsNull: boolean;
	readonly throws: boolean;
}

export interface ClassMember {
	kind: 'constructor' | 'property' | 'get' | 'set' | 'method';
	name: string;
	isStatic: boolean;
	isPrivate: boolean;
	body: string;
	use: CodeUse;
}

export interface ClassShape {
	name: string;
	exported: boolean;
	extendsClause: string;
	members: ClassMember[];
}

export interface InterfaceShape {
	name: string;
	methods: string[];
	properties: string[];
}

export interface InterfaceProperty {
	name: string;
	type: string;
}

export interface ExportedFunction {
	name: string;
	body: string;
	use: CodeUse;
}

export interface ConstructorParameter {
	name: string;
	type: string;
}

export interface ConstructorShape {
	className: string;
	parameters: ConstructorParameter[];
}

export interface Construction {
	className: string;
	arguments: string[];
}

export function classShapes(source: string): ClassShape[] {
	const file = parse(source);
	const shapes: ClassShape[] = [];
	for (const statement of file.statements) {
		if (!ts.isClassDeclaration(statement) || !statement.name) continue;
		shapes.push({
			name: statement.name.text,
			exported: hasExport(statement),
			extendsClause: extendsClause(statement),
			members: statement.members.flatMap((member) => {
				const info = classMember(member, file);
				return info ? [info] : [];
			}),
		});
	}
	return shapes;
}

export function interfaceShape(source: string, interfaceName: string): InterfaceShape | undefined {
	const file = parse(source);
	for (const statement of file.statements) {
		if (!ts.isInterfaceDeclaration(statement) || statement.name.text !== interfaceName) continue;
		const methods: string[] = [];
		const properties: string[] = [];
		for (const member of statement.members) {
			const name = propertyName(member.name, file);
			if (!name) continue;
			if (ts.isMethodSignature(member)) methods.push(name);
			else properties.push(name);
		}
		return { name: interfaceName, methods, properties };
	}
	return undefined;
}

export function interfaceProperties(source: string, interfaceName: string): InterfaceProperty[] | undefined {
	const file = parse(source);
	for (const statement of file.statements) {
		if (!ts.isInterfaceDeclaration(statement) || statement.name.text !== interfaceName) continue;
		const properties: InterfaceProperty[] = [];
		for (const member of statement.members) {
			if (!ts.isPropertySignature(member)) continue;
			const name = propertyName(member.name, file);
			if (!name) continue;
			properties.push({ name, type: member.type ? syntaxText(member.type) : '' });
		}
		return properties;
	}
	return undefined;
}

export function exportedFunctions(source: string): ExportedFunction[] {
	const file = parse(source);
	const found: ExportedFunction[] = [];
	for (const statement of file.statements) {
		if (!ts.isFunctionDeclaration(statement) || !statement.name || !hasExportModifier(statement)) continue;
		found.push({ name: statement.name.text, body: statement.body ? syntaxText(statement.body) : '', use: codeUse(statement.body) });
	}
	return found;
}

export function constructorParameters(source: string): ConstructorShape[] {
	const file = parse(source);
	const shapes: ConstructorShape[] = [];
	for (const statement of file.statements) {
		if (!ts.isClassDeclaration(statement) || !statement.name) continue;
		const constructor = statement.members.find((member) => ts.isConstructorDeclaration(member));
		if (!constructor || !ts.isConstructorDeclaration(constructor)) continue;
		shapes.push({
			className: statement.name.text,
			parameters: constructor.parameters.flatMap((parameter) => {
				if (!ts.isParameter(parameter) || !ts.isIdentifier(parameter.name)) return [];
				return [{ name: parameter.name.text, type: parameter.type ? syntaxText(parameter.type) : '' }];
			}),
		});
	}
	return shapes;
}

/** `new Name(...)` calls. Type arguments are not part of the class name. */
export function constructions(source: string): Construction[] {
	const file = parse(source);
	const found: Construction[] = [];
	const visit = (node: ts.Node): void => {
		if (ts.isNewExpression(node) && ts.isIdentifier(node.expression)) {
			found.push({
				className: node.expression.text,
				arguments: (node.arguments ?? []).map((argument) => syntaxText(argument)),
			});
		}
		ts.forEachChild(node, visit);
	};
	visit(file);
	return found;
}

/** `function` declarations and `function` expressions. Arrow functions are not included. */
export function functionForms(source: string): string[] {
	const file = parse(source);
	const names: string[] = [];
	const visit = (node: ts.Node): void => {
		if (ts.isFunctionDeclaration(node) || ts.isFunctionExpression(node)) {
			names.push(node.name?.getText(file) ?? 'function');
		}
		ts.forEachChild(node, visit);
	};
	visit(file);
	return names;
}

export function parse(source: string): ts.SourceFile {
	return ts.createSourceFile('slice.ts', source, ts.ScriptTarget.Latest, true, ts.ScriptKind.TS);
}

/**
 * Identifiers, calls, and keywords from the tree.
 * Comments are not nodes, and string contents are not copied.
 */
export function syntaxText(node: ts.Node): string {
	const parts: string[] = [];
	const visit = (current: ts.Node): void => {
		if (ts.isIdentifier(current) || ts.isPrivateIdentifier(current)) {
			parts.push(current.text);
			return;
		}
		if (ts.isQualifiedName(current)) {
			visit(current.left);
			parts.push('.');
			visit(current.right);
			return;
		}
		if (ts.isStringLiteral(current) || ts.isNoSubstitutionTemplateLiteral(current)) {
			parts.push('""');
			return;
		}
		if (ts.isNumericLiteral(current)) {
			parts.push(current.text);
			return;
		}
		if (current.kind === ts.SyntaxKind.TrueKeyword) {
			parts.push('true');
			return;
		}
		if (current.kind === ts.SyntaxKind.FalseKeyword) {
			parts.push('false');
			return;
		}
		if (current.kind === ts.SyntaxKind.NullKeyword) {
			parts.push('null');
			return;
		}
		if (current.kind === ts.SyntaxKind.ThisKeyword) {
			parts.push('this');
			return;
		}
		if (current.kind === ts.SyntaxKind.SuperKeyword) {
			parts.push('super');
			return;
		}
		if (ts.isRegularExpressionLiteral(current)) {
			parts.push('/');
			return;
		}
		if (ts.isPropertyAccessExpression(current) || ts.isPropertyAccessChain(current)) {
			visit(current.expression);
			parts.push('.');
			visit(current.name);
			return;
		}
		if (ts.isCallExpression(current)) {
			visit(current.expression);
			parts.push('(');
			current.arguments.forEach((argument, index) => {
				if (index > 0) parts.push(', ');
				visit(argument);
			});
			parts.push(')');
			return;
		}
		if (ts.isExpressionWithTypeArguments(current) || ts.isTypeReferenceNode(current)) {
			visit(ts.isTypeReferenceNode(current) ? current.typeName : current.expression);
			writeTypeArguments(current.typeArguments);
			return;
		}
		if (ts.isUnionTypeNode(current)) {
			current.types.forEach((type, index) => {
				if (index > 0) parts.push(' | ');
				visit(type);
			});
			return;
		}
		if (ts.isArrayTypeNode(current)) {
			visit(current.elementType);
			parts.push('[]');
			return;
		}
		if (ts.isHeritageClause(current)) {
			parts.push(current.token === ts.SyntaxKind.ExtendsKeyword ? 'extends ' : 'implements ');
			current.types.forEach((type, index) => {
				if (index > 0) parts.push(', ');
				visit(type);
			});
			return;
		}
		if (ts.isBinaryExpression(current) && current.operatorToken.kind === ts.SyntaxKind.EqualsToken) {
			visit(current.left);
			parts.push(' = ');
			visit(current.right);
			return;
		}
		if (ts.isReturnStatement(current)) {
			parts.push('return ');
			if (current.expression) visit(current.expression);
			return;
		}
		if (ts.isThrowStatement(current)) {
			parts.push('throw ');
			if (current.expression) visit(current.expression);
			return;
		}
		if (ts.isObjectLiteralExpression(current)) {
			parts.push('{');
			current.properties.forEach((property, index) => {
				if (index > 0) parts.push(', ');
				visit(property);
			});
			parts.push('}');
			return;
		}
		if (ts.isBlock(current) || ts.isSourceFile(current) || ts.isModuleBlock(current)) {
			ts.forEachChild(current, (child) => {
				visit(child);
				parts.push('\n');
			});
			return;
		}
		if (ts.isPropertyAssignment(current)) {
			visit(current.name);
			parts.push(': ');
			visit(current.initializer);
			return;
		}
		let first = true;
		ts.forEachChild(current, (child) => {
			if (!first) parts.push(' ');
			first = false;
			visit(child);
		});
	};
	const writeTypeArguments = (typeArguments: ts.NodeArray<ts.TypeNode> | undefined): void => {
		if (!typeArguments?.length) return;
		parts.push('<');
		typeArguments.forEach((typeArgument, index) => {
			if (index > 0) parts.push(', ');
			visit(typeArgument);
		});
		parts.push('>');
	};
	visit(node);
	return parts.join('');
}

export interface HeritageType {
	name: string;
	typeArguments: number;
}

/** Heritage of one interface. Undefined when that interface is not declared. */
export function interfaceHeritage(source: string, interfaceName: string): HeritageType[] | undefined {
	const file = parse(source);
	for (const statement of file.statements) {
		if (!ts.isInterfaceDeclaration(statement) || statement.name.text !== interfaceName) continue;
		return heritageTypes(statement.heritageClauses);
	}
	return undefined;
}

export function interfacesNamed(source: string, nameMatches: (name: string) => boolean): { name: string; heritage: HeritageType[] }[] {
	const file = parse(source);
	const found: { name: string; heritage: HeritageType[] }[] = [];
	for (const statement of file.statements) {
		if (!ts.isInterfaceDeclaration(statement) || !nameMatches(statement.name.text)) continue;
		found.push({ name: statement.name.text, heritage: heritageTypes(statement.heritageClauses) });
	}
	return found;
}

export function interfaceNames(source: string): string[] {
	const file = parse(source);
	return file.statements.flatMap((statement) => (ts.isInterfaceDeclaration(statement) ? [statement.name.text] : []));
}

/** The letters after `for` on a method or a call, such as `Score` from `forScore(`. */
export function forNames(source: string): string[] {
	const file = parse(source);
	const found: string[] = [];
	const take = (name: string | undefined): void => {
		const suffix = name?.match(/^for([A-Za-z0-9]+)$/)?.[1];
		if (suffix) found.push(suffix);
	};
	const visit = (node: ts.Node): void => {
		if (ts.isMethodDeclaration(node) || ts.isMethodSignature(node) || ts.isFunctionDeclaration(node)) take(propertyName(node.name, file));
		if (ts.isCallExpression(node)) take(calleeName(node.expression, file));
		ts.forEachChild(node, visit);
	};
	visit(file);
	return found;
}

export function identifierPresent(source: string, name: string): boolean {
	const file = parse(source);
	let found = false;
	const visit = (node: ts.Node): void => {
		if (found) return;
		if ((ts.isIdentifier(node) || ts.isPrivateIdentifier(node)) && node.text === name) {
			found = true;
			return;
		}
		ts.forEachChild(node, visit);
	};
	visit(file);
	return found;
}

export function moduleSpecifiers(source: string): string[] {
	const file = parse(source);
	const specs: string[] = [];
	const visit = (node: ts.Node): void => {
		if ((ts.isImportDeclaration(node) || ts.isExportDeclaration(node)) && node.moduleSpecifier && ts.isStringLiteral(node.moduleSpecifier)) {
			specs.push(node.moduleSpecifier.text);
		}
		if (ts.isCallExpression(node) && node.expression.kind === ts.SyntaxKind.ImportKeyword) {
			const argument = node.arguments[0];
			if (argument && ts.isStringLiteral(argument)) specs.push(argument.text);
		}
		ts.forEachChild(node, visit);
	};
	visit(file);
	return specs;
}

export function namespaceExports(source: string): { alias: string; from: string }[] {
	const file = parse(source);
	const found: { alias: string; from: string }[] = [];
	for (const statement of file.statements) {
		if (!ts.isExportDeclaration(statement) || !statement.exportClause || !ts.isNamespaceExport(statement.exportClause)) continue;
		if (!statement.moduleSpecifier || !ts.isStringLiteral(statement.moduleSpecifier)) continue;
		found.push({ alias: statement.exportClause.name.text, from: statement.moduleSpecifier.text });
	}
	return found;
}

export interface LiteralProperty {
	name: string;
	text: string;
	regex: boolean;
}

/** Direct properties of each object literal. A nested object is its own entry. */
export function objectLiterals(source: string): LiteralProperty[][] {
	const file = parse(source);
	const found: LiteralProperty[][] = [];
	const visit = (node: ts.Node): void => {
		if (ts.isObjectLiteralExpression(node)) {
			found.push(
				node.properties.flatMap((property) => {
					if (ts.isPropertyAssignment(property)) {
						const name = propertyName(property.name, file);
						if (!name) return [];
						return [{ name, text: syntaxText(property.initializer), regex: ts.isRegularExpressionLiteral(property.initializer) }];
					}
					if (ts.isShorthandPropertyAssignment(property)) return [{ name: property.name.text, text: property.name.text, regex: false }];
					return [];
				}),
			);
		}
		ts.forEachChild(node, visit);
	};
	visit(file);
	return found;
}

export function hasExportDefault(source: string): boolean {
	const file = parse(source);
	return file.statements.some((statement) => ts.isExportAssignment(statement) || hasModifier(statement, ts.SyntaxKind.DefaultKeyword));
}

export function hasParameterProperty(source: string): boolean {
	const file = parse(source);
	let found = false;
	const visit = (node: ts.Node): void => {
		if (ts.isConstructorDeclaration(node)) {
			for (const parameter of node.parameters) {
				const modifiers = ts.canHaveModifiers(parameter) ? ts.getModifiers(parameter) : undefined;
				if (modifiers?.some((modifier) => modifier.kind === ts.SyntaxKind.PrivateKeyword || modifier.kind === ts.SyntaxKind.PublicKeyword || modifier.kind === ts.SyntaxKind.ProtectedKeyword || modifier.kind === ts.SyntaxKind.ReadonlyKeyword)) {
					found = true;
				}
			}
		}
		ts.forEachChild(node, visit);
	};
	visit(file);
	return found;
}

function heritageTypes(clauses: ts.NodeArray<ts.HeritageClause> | undefined): HeritageType[] {
	const extendsClause = clauses?.find((clause) => clause.token === ts.SyntaxKind.ExtendsKeyword);
	if (!extendsClause) return [];
	return extendsClause.types.map((type) => ({ name: syntaxText(type.expression), typeArguments: type.typeArguments?.length ?? 0 }));
}

function calleeName(expression: ts.Expression, file: ts.SourceFile): string | undefined {
	if (ts.isIdentifier(expression)) return expression.text;
	if (ts.isPropertyAccessExpression(expression)) return propertyName(expression.name, file);
	return undefined;
}

function hasExport(node: ts.ClassDeclaration): boolean {
	return hasExportModifier(node);
}

function hasExportModifier(node: ts.Node): boolean {
	return hasModifier(node, ts.SyntaxKind.ExportKeyword);
}

function hasModifier(node: ts.Node, kind: ts.SyntaxKind): boolean {
	return (ts.canHaveModifiers(node) ? ts.getModifiers(node) : undefined)?.some((modifier) => modifier.kind === kind) ?? false;
}

function extendsClause(node: ts.ClassDeclaration): string {
	const clause = node.heritageClauses?.find((heritage) => heritage.token === ts.SyntaxKind.ExtendsKeyword);
	return clause ? syntaxText(clause) : '';
}

function classMember(member: ts.ClassElement, file: ts.SourceFile): ClassMember | undefined {
	const isStatic = (ts.canHaveModifiers(member) ? ts.getModifiers(member) : undefined)?.some((modifier) => modifier.kind === ts.SyntaxKind.StaticKeyword) ?? false;
	const isPrivate = memberIsPrivate(member);
	const described = (kind: ClassMember['kind'], name: string, node: ts.Node | undefined): ClassMember => ({
		kind,
		name,
		isStatic,
		isPrivate,
		body: node ? syntaxText(node) : '',
		use: codeUse(node),
	});
	if (ts.isConstructorDeclaration(member)) return described('constructor', 'constructor', member.body);
	if (ts.isGetAccessorDeclaration(member)) return described('get', propertyName(member.name, file) ?? 'get', member.body);
	if (ts.isSetAccessorDeclaration(member)) return described('set', propertyName(member.name, file) ?? 'set', member.body);
	if (ts.isMethodDeclaration(member)) return described('method', propertyName(member.name, file) ?? 'method', member.body);
	if (ts.isPropertyDeclaration(member)) return described('property', propertyName(member.name, file) ?? 'property', member.initializer);
	return undefined;
}

/** Facts from one body. A comment or a string does not count as a call, an assignment, or a return. */
export function codeUse(node: ts.Node | undefined): CodeUse {
	const calls = new Set<string>();
	const constructed = new Set<string>();
	const paths = new Set<string>();
	const names = new Set<string>();
	const assignments: { name: string; value: string }[] = [];
	let returnsNull = false;
	let throws = false;
	const visit = (current: ts.Node): void => {
		if (ts.isIdentifier(current) || ts.isPrivateIdentifier(current)) names.add(current.text);
		if (ts.isNewExpression(current) && ts.isIdentifier(current.expression)) constructed.add(current.expression.text);
		if (ts.isCallExpression(current)) {
			const name = callName(current.expression);
			if (name) calls.add(name);
			const path = accessPath(current.expression);
			if (path) paths.add(path);
		} else if (ts.isPropertyAccessExpression(current)) {
			const path = accessPath(current);
			if (path) paths.add(path);
		}
		if (ts.isBinaryExpression(current) && current.operatorToken.kind === ts.SyntaxKind.EqualsToken) {
			const path = accessPath(current.left);
			const value = literalValue(current.right);
			const name = path?.split('.').at(-1);
			if (name && value) assignments.push({ name, value });
		}
		if (ts.isReturnStatement(current) && current.expression && expressionContainsNull(current.expression)) returnsNull = true;
		if (ts.isThrowStatement(current)) throws = true;
		ts.forEachChild(current, visit);
	};
	if (node) visit(node);
	return {
		calls: (name) => calls.has(name),
		constructs: (name) => constructed.has(name),
		touches: (path) => [...paths].some((item) => item === path || item.startsWith(`${path}.`)),
		touchesProps: () => [...paths].some((item) => item === 'props' || item.endsWith('.props') || item.includes('.props.')),
		assigns: (name, value) => assignments.some((item) => item.name === name && item.value === value),
		mentions: (name) => names.has(name),
		returnsNull,
		throws,
	};
}

function callName(expression: ts.Expression): string | undefined {
	if (ts.isIdentifier(expression)) return expression.text;
	if (ts.isPropertyAccessExpression(expression) && ts.isIdentifier(expression.name)) return expression.name.text;
	return undefined;
}

function accessPath(node: ts.Node): string | undefined {
	if (ts.isIdentifier(node)) return node.text;
	if (node.kind === ts.SyntaxKind.ThisKeyword) return 'this';
	if (node.kind === ts.SyntaxKind.SuperKeyword) return 'super';
	if (ts.isPropertyAccessExpression(node) && ts.isIdentifier(node.name)) {
		const left = accessPath(node.expression);
		return left ? `${left}.${node.name.text}` : undefined;
	}
	if (ts.isParenthesizedExpression(node) || ts.isAsExpression(node) || ts.isNonNullExpression(node) || ts.isTypeAssertionExpression(node)) return accessPath(node.expression);
	if (ts.isCallExpression(node)) return accessPath(node.expression);
	return undefined;
}

function literalValue(node: ts.Expression): string | undefined {
	if (node.kind === ts.SyntaxKind.TrueKeyword) return 'true';
	if (node.kind === ts.SyntaxKind.FalseKeyword) return 'false';
	if (node.kind === ts.SyntaxKind.NullKeyword) return 'null';
	if (ts.isParenthesizedExpression(node)) return literalValue(node.expression);
	return undefined;
}

function expressionContainsNull(node: ts.Expression): boolean {
	if (node.kind === ts.SyntaxKind.NullKeyword) return true;
	if (ts.isParenthesizedExpression(node)) return expressionContainsNull(node.expression);
	if (ts.isConditionalExpression(node)) return expressionContainsNull(node.whenTrue) || expressionContainsNull(node.whenFalse);
	if (ts.isBinaryExpression(node) && (node.operatorToken.kind === ts.SyntaxKind.BarBarToken || node.operatorToken.kind === ts.SyntaxKind.QuestionQuestionToken)) {
		return expressionContainsNull(node.left) || expressionContainsNull(node.right);
	}
	return false;
}

function memberIsPrivate(member: ts.ClassElement): boolean {
	const modifiers = ts.canHaveModifiers(member) ? ts.getModifiers(member) : undefined;
	if (modifiers?.some((modifier) => modifier.kind === ts.SyntaxKind.PrivateKeyword)) return true;
	return 'name' in member && !!member.name && ts.isPrivateIdentifier(member.name);
}

function propertyName(name: ts.PropertyName | undefined, file: ts.SourceFile): string | undefined {
	if (!name) return undefined;
	if (ts.isIdentifier(name) || ts.isPrivateIdentifier(name) || ts.isStringLiteral(name)) return name.text;
	return name.getText(file);
}
