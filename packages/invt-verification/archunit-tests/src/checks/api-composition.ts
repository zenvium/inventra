import path from 'node:path';
import { type ArchitectureViolation, violation } from '../architecture-violation.ts';
import { rule } from '../rule.ts';
import { fileExists, readText } from '../read-tree.ts';
import { exportedFunctions, identifierPresent } from '../skill-members.ts';
import { exportedConstNames } from '../typescript-text.ts';

/**
 * The composition file the caller passes. The Cellix host is apps/api2.
 * Queue and timer registration is checked for the handler files the caller passes.
 */
export interface ApiCompositionConfig {
	/** Absolute path of the composition file. */
	compositionFile: string;
	/** Queue handler `index.ts` paths. Empty skips queue registration. */
	queueHandlers?: readonly string[];
	/** Timer handler `index.ts` paths. Empty skips timer registration. */
	timerHandlers?: readonly string[];
}

export async function checkApiComposition(config: ApiCompositionConfig): Promise<ArchitectureViolation[]> {
	const parts = config.compositionFile.split(/[/\\]/);
	const violations = [...(await rule('api.composition.target', () => compositionTarget(config.compositionFile, parts)))];
	if (!(await fileExists(config.compositionFile))) {
		violations.push(...(await rule('api.composition.file', () => compositionFile(config.compositionFile))));
		return violations;
	}
	const composition = await readText(config.compositionFile);
	violations.push(...(await rule('api.composition.handler', () => handlerRegistration(composition, config.queueHandlers ?? [], 'queue'))));
	violations.push(...(await rule('api.composition.handler', () => handlerRegistration(composition, config.timerHandlers ?? [], 'timer'))));
	return violations;
}

/** Rule: api.composition.file. */
function compositionFile(compositionFilePath: string): ArchitectureViolation[] {
	return [violation('api.composition.file', compositionFilePath, 'The composition file exists.')];
}

/** Rule: api.composition.target. */
function compositionTarget(compositionFile: string, parts: readonly string[]): ArchitectureViolation[] {
	const violations: ArchitectureViolation[] = [];
	if (!parts.includes('api2')) violations.push(violation('api.composition.target', compositionFile, 'apiComposition points at apps/api2. The legacy apps/api host is not the Cellix composition target.'));
	if (parts.includes('api')) violations.push(violation('api.composition.target', compositionFile, 'apps/api is not the composition target.'));
	return violations;
}

async function handlerRegistration(composition: string, handlers: readonly string[], kind: 'queue' | 'timer'): Promise<ArchitectureViolation[]> {
	if (handlers.length === 0) return [];
	const violations: ArchitectureViolation[] = [];
	const creator = kind === 'queue' ? 'createQueueHandler' : 'createTimerHandler';
	const register = kind === 'queue' ? 'registerAzureFunctionStorageQueueHandler' : 'registerAzureFunctionTimerHandler';
	if (!identifierPresent(composition, creator) || !identifierPresent(composition, register)) {
		violations.push(violation('api.composition.handler', 'apiComposition', `An enrolled ${kind} is registered with ${register} and ${creator}, on the factory initializeApplicationServices already built.`));
	}
	for (const filePath of handlers) {
		const relative = `${path.basename(path.dirname(filePath))}/index.ts`;
		if (!(await fileExists(filePath))) {
			violations.push(violation('api.composition.handler', relative, 'The handler file exists so the composition file can name its exports.'));
			continue;
		}
		const text = await readText(filePath);
		const names = [
			...exportedConstNames(text).filter((name) => name.endsWith('Operation') || name.endsWith('Permissions')),
			...exportedFunctions(text).map((item) => item.name).filter((name) => name.endsWith('Schedule')),
		];
		for (const name of names) {
			if (!identifierPresent(composition, name)) {
				violations.push(violation('api.composition.handler', 'apiComposition', `Names ${name} from ${relative} in the ${creator} options.`));
			}
		}
	}
	return violations;
}
