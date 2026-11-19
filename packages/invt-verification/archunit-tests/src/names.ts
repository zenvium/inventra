/** Kebab folder `physician-reg-authority` becomes `PhysicianRegAuthority`. */
export function pascalFromKebab(kebab: string): string {
	return kebab
		.split('-')
		.filter((part) => part.length > 0)
		.map((part) => part.charAt(0).toUpperCase() + part.slice(1))
		.join('');
}

/** Kebab folder `gl-posting-summary` becomes `glPostingSummary`. */
export function camelFromKebab(kebab: string): string {
	const pascal = pascalFromKebab(kebab);
	return pascal.charAt(0).toLowerCase() + pascal.slice(1);
}

export function folderKey(kebab: string): string {
	return kebab.replaceAll('-', '').toLowerCase();
}

/** A subdomain such as `dock-role`. The Cellix role aggregate is the pattern for that folder. */
export function isRoleSubdomain(kebab: string): boolean {
	return /(^|-)role$/.test(kebab);
}

/** `MiniCEX` matches `minicex`. The folder is already singular. */
export function matchesFolder(symbol: string, kebab: string): boolean {
	return symbol.toLowerCase() === folderKey(kebab);
}

/**
 * A regular plural last segment. `harbors` is `harbor`. `authorities` is `authority`.
 * `status` and `address` stay, because those endings are already singular.
 */
export function singularFolder(kebab: string): string | undefined {
	const parts = kebab.split('-');
	const last = parts.at(-1);
	if (!last || last.length < 4) return undefined;
	let stem: string | undefined;
	if (last.endsWith('ies')) stem = `${last.slice(0, -3)}y`;
	else if (/(?:s|x|z|ch|sh)es$/.test(last)) stem = last.slice(0, -2);
	else if (last.endsWith('s') && !/(?:ss|us|is)$/.test(last)) stem = last.slice(0, -1);
	if (!stem || stem.length < 2 || stem === last) return undefined;
	parts[parts.length - 1] = stem;
	return parts.join('-');
}

/**
 * `MiniCEXDomainPermissions` matches folder `minicex` and suffix `DomainPermissions`.
 * The prefix letters have to spell the folder. Acronym casing is allowed.
 */
export function findRoleName(names: readonly string[], kebab: string, suffix: string): string | undefined {
	const key = folderKey(kebab);
	return names.find((name) => {
		if (suffix.length === 0) return name.toLowerCase() === key;
		return name.endsWith(suffix) && name.slice(0, -suffix.length).toLowerCase() === key;
	});
}

export function isKebabName(name: string): boolean {
	return /^[a-z0-9]+(-[a-z0-9]+)*$/.test(name);
}

/** Singular is reported before any alias comparison. `harbors` is `harbor`. */
export function folderNameProblems(name: string, kind: 'context' | 'subdomain', kebabMessage: string): string[] {
	const problems: string[] = [];
	if (!isKebabName(name)) problems.push(kebabMessage);
	const singular = singularFolder(name);
	if (singular) problems.push(`A ${kind} folder is singular. ${name} is ${singular}.`);
	return problems;
}
