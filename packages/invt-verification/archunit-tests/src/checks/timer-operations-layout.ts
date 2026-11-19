import path from 'node:path';
import { type ArchitectureViolation, violation } from '../architecture-violation.ts';
import { rule } from '../rule.ts';
import { fileExists, readText } from '../read-tree.ts';
import { exportedFunctions, identifierPresent } from '../skill-members.ts';
import { exportedConstNames, importsFragment } from '../typescript-text.ts';

/**
 * Timer handler files the caller names, each `fn_timer_handler_<action>/index.ts`.
 * An empty `files` list checks nothing.
 */
export interface TimerOperationsLayoutConfig {
	files: readonly string[];
}

export async function checkTimerOperationsLayout(config: TimerOperationsLayoutConfig): Promise<ArchitectureViolation[]> {
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
		violations.push(...(await rule('timer.barrel', () => timerBarrel(barrel, barrelMissing, folders, present))));
		for (const filePath of files) {
			const folder = path.basename(path.dirname(filePath));
			const relative = `${folder}/index.ts`;
			if (!present.includes(folder)) {
				violations.push(...(await rule('timer.files', () => timerFiles(relative))));
				continue;
			}
			const text = await readText(filePath);
			violations.push(...(await rule('timer.shape', () => timerShape(relative, text))), ...(await rule('timer.schedule', () => timerSchedule(relative, text))));
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

/** Rule: timer.files. */
function timerFiles(relative: string): ArchitectureViolation[] {
	return [violation('timer.files', relative, 'An enrolled timer has fn_timer_handler_<action>/index.ts. The folder uses _ where the operation name uses -.')];
}

/** Rule: timer.barrel. */
function timerBarrel(barrel: string, barrelMissing: boolean, enrolled: readonly string[], present: readonly string[]): ArchitectureViolation[] {
	const violations: ArchitectureViolation[] = [];
	if (barrelMissing) violations.push(violation('timer.barrel', 'index.ts', 'The package index exports each enrolled timer. It does not replace the barrel.'));
	for (const folder of enrolled) {
		if (present.includes(folder) && barrel && !importsFragment(barrel, `./${folder}/`)) {
			violations.push(violation('timer.barrel', 'index.ts', `Exports the operation, permissions, and schedule from ./${folder}/index.ts.`));
		}
	}
	return violations;
}

/** Rule: timer.shape. */
function timerShape(relative: string, text: string): ArchitectureViolation[] {
	const violations: ArchitectureViolation[] = [];
	const operations = exportedConstNames(text).filter((name) => name.endsWith('Operation'));
	const permissions = exportedConstNames(text).filter((name) => name.endsWith('Permissions'));
	const schedules = exportedFunctions(text).filter((item) => item.name.endsWith('Schedule'));
	if (operations.length !== 1 || permissions.length !== 1 || schedules.length !== 1) {
		violations.push(violation('timer.shape', relative, 'Exports one permissions const, one <actionCamel>Schedule function, and one operation const.'));
	}
	if (!identifierPresent(text, 'TimerOperation')) violations.push(violation('timer.shape', relative, 'The operation is TimerOperation<ApplicationServices>.'));
	if (identifierPresent(text, 'withScopedTransaction') || identifierPresent(text, 'forSystem')) violations.push(violation('timer.shape', relative, 'The handler calls the application service. It does not open a unit of work or call forSystem.'));
	if (!identifierPresent(text, 'applicationServices')) violations.push(violation('timer.shape', relative, 'The operation calls applicationServices.<Context>.<Subdomain>.<actionCamel>.'));
	return violations;
}

/** Rule: timer.schedule. */
function timerSchedule(relative: string, text: string): ArchitectureViolation[] {
	const schedule = exportedFunctions(text).find((item) => item.name.endsWith('Schedule'));
	if (schedule && !schedule.use.touches('process.env')) {
		return [violation('timer.schedule', relative, `${schedule.name} reads one environment variable and throws when it is missing.`)];
	}
	return [];
}
