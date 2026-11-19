/**
 * One broken rule. `rule` is stable so a failure names the convention,
 * and `file` is a path relative to the layer root the check was given.
 */
export interface ArchitectureViolation {
	rule: string;
	file: string;
	message: string;
}

export function violation(rule: string, file: string, message: string): ArchitectureViolation {
	return { rule, file, message };
}

/** Vitest prints this list when a rule fails. Empty means the slice held. */
export function formatViolations(violations: readonly ArchitectureViolation[]): string[] {
	return violations.map((item) => `${item.rule} ${item.file}: ${item.message}`);
}
