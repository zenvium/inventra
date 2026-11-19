import path from 'node:path';
import { type ArchitectureViolation, violation } from '../architecture-violation.ts';
import { rule } from '../rule.ts';
import { fileExists, readText } from '../read-tree.ts';
import { identifierPresent } from '../skill-members.ts';
import { exportedConstNames, importsFragment } from '../typescript-text.ts';

/**
 * Queue handler files the caller names, each `fn_queue_handler_<queue>/index.ts`.
 * An empty `files` list checks nothing.
 */
export interface QueueOperationsLayoutConfig {
	files: readonly string[];
}

export async function checkQueueOperationsLayout(config: QueueOperationsLayoutConfig): Promise<ArchitectureViolation[]> {
	if (config.files.length === 0) return [];
	const violations: ArchitectureViolation[] = [];
	for (const [root, files] of handlerRoots(config.files)) {
		let barrel = '';
		let barrelMissing = false;
		try {
			barrel = await readText(path.join(root, 'index.ts'));
		} catch {
			barrelMissing = true;
		}
		const folders = files.map((filePath) => path.basename(path.dirname(filePath)));
		const present: string[] = [];
		for (const filePath of files) {
			if (await fileExists(filePath)) present.push(path.basename(path.dirname(filePath)));
		}
		violations.push(...(await rule('queue.barrel', () => queueBarrel(barrel, barrelMissing, folders, present))));
		for (const filePath of files) {
			const folder = path.basename(path.dirname(filePath));
			const relative = `${folder}/index.ts`;
			if (!present.includes(folder)) {
				violations.push(...(await rule('queue.files', () => queueFiles(relative))));
				continue;
			}
			const text = await readText(filePath);
			violations.push(...(await rule('queue.shape', () => queueShape(relative, text))));
		}
	}
	return violations;
}

function handlerRoots(files: readonly string[]): Map<string, string[]> {
	const byRoot = new Map<string, string[]>();
	for (const filePath of files) {
		const root = path.dirname(path.dirname(filePath));
		const list = byRoot.get(root) ?? [];
		list.push(filePath);
		byRoot.set(root, list);
	}
	return byRoot;
}

/** Rule: queue.files. */
function queueFiles(relative: string): ArchitectureViolation[] {
	return [violation('queue.files', relative, 'An enrolled queue has fn_queue_handler_<queue>/index.ts. The folder uses _ where the queue name uses -.')];
}

/** Rule: queue.barrel. */
function queueBarrel(barrel: string, barrelMissing: boolean, enrolled: readonly string[], present: readonly string[]): ArchitectureViolation[] {
	const violations: ArchitectureViolation[] = [];
	if (barrelMissing) violations.push(violation('queue.barrel', 'index.ts', 'The package index exports each enrolled handler. It does not replace the barrel.'));
	for (const folder of enrolled) {
		if (present.includes(folder) && barrel && !importsFragment(barrel, `./${folder}/`)) {
			violations.push(violation('queue.barrel', 'index.ts', `Exports the operation and permissions from ./${folder}/index.ts.`));
		}
	}
	return violations;
}

/** Rule: queue.shape. */
function queueShape(relative: string, text: string): ArchitectureViolation[] {
	const violations: ArchitectureViolation[] = [];
	const operations = exportedConstNames(text).filter((name) => name.endsWith('Operation'));
	const permissions = exportedConstNames(text).filter((name) => name.endsWith('Permissions'));
	if (operations.length !== 1 || permissions.length !== 1) violations.push(violation('queue.shape', relative, 'Exports one <actionCamel>Permissions const and one <actionCamel>Operation const.'));
	if (!identifierPresent(text, 'QueueOperation')) violations.push(violation('queue.shape', relative, 'The operation is QueueOperation<object, ApplicationServices>.'));
	if (identifierPresent(text, 'withScopedTransaction') || identifierPresent(text, 'forSystem')) violations.push(violation('queue.shape', relative, 'The handler calls the application service. It does not open a unit of work or call forSystem.'));
	if (!identifierPresent(text, 'applicationServices')) violations.push(violation('queue.shape', relative, 'The operation calls applicationServices.<Context>.<Subdomain>.<actionCamel>.'));
	return violations;
}
