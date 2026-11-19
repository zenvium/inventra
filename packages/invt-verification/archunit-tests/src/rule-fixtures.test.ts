import { mkdir, mkdtemp, readFile, rm, writeFile } from 'node:fs/promises';
import { tmpdir } from 'node:os';
import path from 'node:path';
import { afterEach, describe, expect, it } from 'vitest';
import { formatViolations } from './architecture-violation.ts';
import { checkApiComposition } from './checks/api-composition.ts';
import { checkLayerDependencies } from './checks/layer-dependencies.ts';
import { checkApplicationServicesContexts } from './checks/application-services-layout.ts';
import { checkDomainContextFolders, checkDomainContextsBarrel } from './checks/domain-layout.ts';
import { checkGraphqlLayout } from './checks/graphql-layout.ts';
import { checkModelsLayout } from './checks/models-layout.ts';
import { checkPersistenceDomainLayout, checkPersistenceReadonlyLayout } from './checks/persistence-layout.ts';
import { checkQueueOperationsLayout } from './checks/queue-operations-layout.ts';
import { checkTimerOperationsLayout } from './checks/timer-operations-layout.ts';

const roots: string[] = [];

afterEach(async () => {
	await Promise.all(roots.splice(0).map((root) => rm(root, { recursive: true, force: true })));
});

describe('rule switches', () => {
	it('lists every rule() id in rules.json as enabled', async () => {
		const checksDir = path.join(import.meta.dirname, 'checks');
		const { readdir } = await import('node:fs/promises');
		const files = (await readdir(checksDir)).filter((name) => name.endsWith('.ts'));
		const ids = new Set<string>();
		for (const fileName of files) {
			const text = await readFile(path.join(checksDir, fileName), 'utf8');
			for (const match of text.matchAll(/rule\('([^']+)'/g)) ids.add(match[1] ?? '');
		}
		const switches = JSON.parse(await readFile(path.join(import.meta.dirname, '..', 'rules.json'), 'utf8')) as Record<string, Record<string, boolean>>;
		const listed = Object.entries(switches).flatMap(([group, rules]) => Object.keys(rules).map((name) => `${group}.${name}`));
		expect([...ids].sort()).toEqual(listed.sort());
		expect(Object.values(switches).every((rules) => Object.values(rules).every((enabled) => enabled === true))).toBe(true);
	});
});

describe('rule fixtures', () => {
	it('accepts a subdomain folder that matches the rosetta domain pages', async () => {
		const domainRoot = await tempRoot();
		await writeDomainSlice(domainRoot);
		expect(formatViolations(await checkDomainContextsBarrel({ domainRoot }))).toEqual([]);
		expect(formatViolations(await checkDomainContextFolders({ domainRoot }))).toEqual([]);
	});

	it('rejects a mark* aggregate method and keeps request* and onSave', async () => {
		const domainRoot = await tempRoot();
		await writeDomainSlice(domainRoot);
		const aggregatePath = path.join(domainRoot, 'domain/contexts/exam/score/score.aggregate.ts');
		const text = await readFile(aggregatePath, 'utf8');
		await writeFile(
			aggregatePath,
			text.replace(
				'private markAsNew(): void { this.isNew = true; }',
				[
					'private markAsNew(): void { this.isNew = true; }',
					"private ensureCanManage(): void { if (!this.visa.determineIf((permissions) => permissions.canManageScore)) throw new PermissionError('Cannot modify score'); }",
					'public markPosted(): void { this.props.name = "posted"; }',
					'public requestClose(): void { this.name = "closed"; }',
					'public override onSave(isModified: boolean): void { if (isModified) this.addIntegrationEvent(ScoreUpdated, { id: this.id }); }',
				].join('\n  '),
			),
		);
		const messages = formatViolations(await checkDomainContextFolders({ domainRoot }));
		expect(messages.some((line) => line.includes('markPosted is not a skill method'))).toBe(true);
		expect(messages.some((line) => line.includes('ensureCanManage is not a skill method'))).toBe(false);
		expect(messages.some((line) => line.includes('requestClose is not a skill method'))).toBe(false);
		expect(messages.some((line) => line.includes('onSave is not a skill method'))).toBe(false);
	});

	it('accepts a child that reaches another level through root, and rejects a visa passed in its place', async () => {
		const domainRoot = await tempRoot();
		await writeDomainSlice(domainRoot);
		const subdomain = path.join(domainRoot, 'domain/contexts/exam/score');
		const aggregatePath = path.join(subdomain, 'score.aggregate.ts');
		const text = await readFile(aggregatePath, 'utf8');
		await writeFile(
			aggregatePath,
			[
				"import type { RootEventRegistry } from '@cellix/domain-seedwork/aggregate-root';",
				text.replace('name: string;', 'name: string;\n  profile: ProfileProps;').replace(
					'get name(): string { return this.props.name; }',
					'get profile(): Profile { return new Profile(this.props.profile, this); }\n  get name(): string { return this.props.name; }',
				),
				'export interface IScoreAggregateRoot extends RootEventRegistry { requestAddNote(note: string): void }',
			].join('\n'),
		);
		await writeFile(
			path.join(subdomain, 'profile.value-object.ts'),
			[
				'export interface ProfileProps extends ValueObjectProps { city: string }',
				'export class Profile extends ValueObject<ProfileProps> {',
				'  private readonly root: IScoreAggregateRoot;',
				'  constructor(props: ProfileProps, root: IScoreAggregateRoot) {',
				'    super(props);',
				'    this.root = root;',
				'  }',
				'  get city(): string { return this.props.city; }',
				'  public requestUpdateCity(city: string): void {',
				"    this.props.city = city;",
				'    this.root.requestAddNote(city);',
				'  }',
				'}',
			].join('\n'),
		);
		const indexPath = path.join(subdomain, 'index.ts');
		const index = await readFile(indexPath, 'utf8');
		await writeFile(indexPath, `${index}export { Profile, type ProfileProps } from './profile.value-object.ts';\n`);
		expect(formatViolations(await checkDomainContextFolders({ domainRoot })).some((line) => line.includes('domain.nested.root'))).toBe(false);

		await writeFile(aggregatePath, (await readFile(aggregatePath, 'utf8')).replace('new Profile(this.props.profile, this)', 'new Profile(this.props.profile, this.visa)'));
		const rejected = formatViolations(await checkDomainContextFolders({ domainRoot }));
		expect(rejected.some((line) => line.includes('domain.nested.root') && line.includes('Profile takes root') && line.includes('passes this'))).toBe(true);
	});

	it('rejects a plural context before it compares the alias', async () => {
		const domainRoot = await tempRoot();
		await mkdir(path.join(domainRoot, 'domain/contexts/harbors'), { recursive: true });
		await writeFile(path.join(domainRoot, 'domain/contexts/passport.ts'), 'export interface Passport {}\n');
		await writeFile(path.join(domainRoot, 'domain/contexts/index.ts'), "export * as Harbor from './harbors/index.ts';\n");
		await writeFile(path.join(domainRoot, 'domain/contexts/harbors/index.ts'), 'export const harbor = 1;\n');
		const messages = formatViolations(await checkDomainContextsBarrel({ domainRoot }));
		expect(messages.some((line) => line.includes('harbors is harbor') && line.includes('The alias is Harbor'))).toBe(true);
		expect(messages.some((line) => line.includes('does not match'))).toBe(false);
	});

	it('checks a role subdomain against the Cellix role aggregate', async () => {
		const domainRoot = await tempRoot();
		await writeRoleSubdomain(domainRoot);
		const messages = formatViolations(await checkDomainContextFolders({ domainRoot }));
		expect(messages.some((line) => line.includes('deleteAndReassignTo is not a role method') || line.includes('getNewDefaultPilotInstance is not a role method'))).toBe(false);
		expect(messages.some((line) => line.includes('schemaVersion'))).toBe(false);
		expect(messages.some((line) => line.includes('Declares getById') || line.includes('Declares getNewInstance'))).toBe(false);
		expect(messages.some((line) => line.includes('DockKind'))).toBe(false);
		expect(messages.some((line) => line.includes('dock-role-permissions.ts') && line.includes('Not a subdomain role'))).toBe(false);
		expect(messages.some((line) => line.includes('updateRoleName is not a role method'))).toBe(true);
		expect(messages.some((line) => line.includes('domain.aggregate.default-instance') || line.includes('domain.aggregate.role-method') || line.includes('domain.role.permissions'))).toBe(false);
	});

	it('requires a role default to assign through setters', async () => {
		const domainRoot = await tempRoot();
		const subdomain = path.join(domainRoot, 'domain/contexts/harbor/dock-role');
		await writeRoleSubdomain(domainRoot);
		const aggregatePath = path.join(subdomain, 'dock-role.aggregate.ts');
		const text = await readFile(aggregatePath, 'utf8');
		await writeFile(aggregatePath, text.replace('role.roleName = \'Dock Pilot\';', 'role.props.roleName = \'Dock Pilot\';'));
		const messages = formatViolations(await checkDomainContextFolders({ domainRoot }));
		expect(messages.some((line) => line.includes('domain.aggregate.default-instance') && line.includes('does not assign props'))).toBe(true);
	});

	it('requires getDefaultRoleNames and deleteAndReassignTo on a role', async () => {
		const domainRoot = await tempRoot();
		const subdomain = path.join(domainRoot, 'domain/contexts/harbor/dock-role');
		await writeRoleSubdomain(domainRoot);
		const aggregatePath = path.join(subdomain, 'dock-role.aggregate.ts');
		const text = await readFile(aggregatePath, 'utf8');
		await writeFile(aggregatePath, text.replace(/public static getDefaultRoleNames\(\): string\[\] \{[^}]+\}/, '').replace(/public deleteAndReassignTo[\s\S]*?addIntegrationEvent\(RoleDeletedReassignEvent, \{ deletedRoleId: this\.props\.id, newRoleId: roleRef\.id \}\);\s*\}/, ''));
		const messages = formatViolations(await checkDomainContextFolders({ domainRoot }));
		expect(messages.some((line) => line.includes('getDefaultRoleNames returns the canonical default names'))).toBe(true);
		expect(messages.some((line) => line.includes('deleteAndReassignTo refuses a default role'))).toBe(true);
	});

	it('rejects a role that keeps permission flags on the aggregate', async () => {
		const domainRoot = await tempRoot();
		const subdomain = path.join(domainRoot, 'domain/contexts/harbor/dock-role');
		await writeRoleSubdomain(domainRoot);
		await rm(path.join(subdomain, 'dock-role-berth-permissions.ts'));
		const aggregatePath = path.join(subdomain, 'dock-role.aggregate.ts');
		const text = await readFile(aggregatePath, 'utf8');
		await writeFile(aggregatePath, text.replace('get permissions(): DockRolePermissions { return new DockRolePermissions(this.props.permissions, this.visa); }', 'set permissions(input: { canAssignBerth?: boolean }) { this.props.permissions.canAssignBerth = input.canAssignBerth; }'));
		const index = await readFile(path.join(subdomain, 'index.ts'), 'utf8');
		await writeFile(path.join(subdomain, 'index.ts'), index.replace("export { DockRoleBerthPermissions } from './dock-role-berth-permissions.ts';\n", ''));
		const messages = formatViolations(await checkDomainContextFolders({ domainRoot }));
		expect(messages.some((line) => line.includes('Each permission group is its own'))).toBe(true);
		expect(messages.some((line) => line.includes('does not take a permissions update object'))).toBe(true);
	});

	it('rejects an aggregate method the skill does not name', async () => {
		const domainRoot = await tempRoot();
		await writeDomainSlice(domainRoot);
		const aggregatePath = path.join(domainRoot, 'domain/contexts/exam/score/score.aggregate.ts');
		const text = await readFile(aggregatePath, 'utf8');
		await writeFile(aggregatePath, text.replace('private markAsNew', 'public rename(): void { return; }\n  private markAsNew'));
		const messages = formatViolations(await checkDomainContextFolders({ domainRoot }));
		expect(messages.some((line) => line.includes('domain.aggregate.member') && line.includes('rename'))).toBe(true);
	});

	it('accepts a subdomain that has no value-objects file', async () => {
		const domainRoot = await tempRoot();
		await writeDomainSlice(domainRoot);
		await rm(path.join(domainRoot, 'domain/contexts/exam/score/score.value-objects.ts'));
		const messages = formatViolations(await checkDomainContextFolders({ domainRoot }));
		expect(messages.some((line) => line.includes('score.value-objects.ts'))).toBe(false);
	});

	it('rejects an action file that uses the word function', async () => {
		const root = await tempRoot();
		await writeApplicationSlice(root);
		await writeFile(path.join(root, 'contexts/exam/score/rename.ts'), 'export function rename() { return 1; }\n');
		const messages = formatViolations(await checkApplicationServicesContexts({ applicationServicesRoot: root }));
		expect(messages.some((line) => line.includes('application.action.function'))).toBe(true);
	});

	it('rejects a persistence context that keeps role files beside index.ts', async () => {
		const root = await tempRoot();
		await mkdir(path.join(root, 'datasources/domain/exam'), { recursive: true });
		await writeFile(path.join(root, 'datasources/domain/index.ts'), "import { ExamContextPersistence } from './exam/index.ts';\nexport const DomainDataSourceImplementation = ExamContextPersistence;\n");
		await writeFile(path.join(root, 'datasources/domain/exam/index.ts'), 'export const ExamContextPersistence = () => ({});\n');
		await writeFile(path.join(root, 'datasources/domain/exam/score.repository.ts'), 'export class ScoreRepository {}\n');
		const messages = formatViolations(await checkPersistenceDomainLayout({ persistenceRoot: root }));
		expect(messages.some((line) => line.includes('persistence.context.files') && line.includes('score.repository.ts'))).toBe(true);
	});

	it('rejects a seed file in a model folder', async () => {
		const root = await tempRoot();
		await mkdir(path.join(root, 'models/score'), { recursive: true });
		await writeFile(path.join(root, 'index.ts'), '');
		await writeFile(
			path.join(root, 'models/score/score.model.ts'),
			"export interface Score extends MongooseSeedwork.Base { name: string }\nexport const ScoreModelName = 'Score';\nexport const ScoreModelFactory = () => ({});\nconst schema = { collection: 'scores' };\nvoid schema;\n",
		);
		await writeFile(path.join(root, 'models/score/score.seed.ts'), 'export const scoreSeed = [{}];\n');
		const messages = formatViolations(await checkModelsLayout({ modelsRoot: root }));
		expect(messages.some((line) => line.includes('models.files') && line.includes('score.seed.ts'))).toBe(true);
	});

	it('rejects an entity-reference id with no load method and leaves a string id alone', async () => {
		const domainRoot = await tempRoot();
		await writeDomainSlice(domainRoot);
		const aggregatePath = path.join(domainRoot, 'domain/contexts/exam/score/score.aggregate.ts');
		const text = await readFile(aggregatePath, 'utf8');
		await writeFile(aggregatePath, text.replace('name: string;', 'name: string;\n  schoolId: string;\n  school: Readonly<SchoolEntityReference>;'));
		const messages = formatViolations(await checkDomainContextFolders({ domainRoot }));
		expect(messages.some((line) => line.includes('domain.aggregate.reference') && line.includes('loadSchool'))).toBe(true);
		expect(messages.some((line) => line.includes('schoolId'))).toBe(false);
	});

	it('rejects a PropArray that never calls getNewItem', async () => {
		const domainRoot = await tempRoot();
		await writeDomainSlice(domainRoot);
		const aggregatePath = path.join(domainRoot, 'domain/contexts/exam/score/score.aggregate.ts');
		const text = await readFile(aggregatePath, 'utf8');
		await writeFile(aggregatePath, text.replace('name: string;', 'name: string;\n  activityLog: PropArray<ActivityLogProps>;'));
		const messages = formatViolations(await checkDomainContextFolders({ domainRoot }));
		expect(messages.some((line) => line.includes('domain.aggregate.collection') && line.includes('getNewItem'))).toBe(true);
	});

	it('rejects a null nested props getter that cannot return null', async () => {
		const domainRoot = await tempRoot();
		await writeDomainSlice(domainRoot);
		const aggregatePath = path.join(domainRoot, 'domain/contexts/exam/score/score.aggregate.ts');
		const text = await readFile(aggregatePath, 'utf8');
		await writeFile(
			aggregatePath,
			text.replace('name: string;', 'name: string;\n  profile: ProfileProps | null;').replace('get createdAt()', 'get profile(): ProfileProps { return new Profile(this.props.profile, this.visa); }\n  get createdAt()'),
		);
		const messages = formatViolations(await checkDomainContextFolders({ domainRoot }));
		expect(messages.some((line) => line.includes('domain.aggregate.nested') && line.includes('profile'))).toBe(true);
	});

	it('rejects an entity props interface that drops createdAt', async () => {
		const domainRoot = await tempRoot();
		await writeDomainSlice(domainRoot);
		await writeFile(
			path.join(domainRoot, 'domain/contexts/exam/score/activity.entity.ts'),
			'export interface ActivityLogProps extends DomainEntityProps { note: string }\nexport class ActivityLog extends DomainEntity<ActivityLogProps> {}\n',
		);
		const messages = formatViolations(await checkDomainContextFolders({ domainRoot }));
		expect(messages.some((line) => line.includes('domain.entity.timestamps') && line.includes('createdAt'))).toBe(true);
	});

	it('rejects a VOString that omits maxLength', async () => {
		const domainRoot = await tempRoot();
		await writeDomainSlice(domainRoot);
		await writeFile(path.join(domainRoot, 'domain/contexts/exam/score/score.value-objects.ts'), 'export class Name extends VOString({ trim: true, minLength: 1 }) {}\n');
		const messages = formatViolations(await checkDomainContextFolders({ domainRoot }));
		expect(messages.some((line) => line.includes('domain.value-objects.pattern') && line.includes('maxLength'))).toBe(true);
	});

	it('rejects a constrained string schema that sets only minlength, and a ref that is not an ObjectId', async () => {
		const root = await tempRoot();
		await mkdir(path.join(root, 'models/score'), { recursive: true });
		await writeFile(path.join(root, 'index.ts'), "export { ScoreModelFactory } from './models/score/score.model.ts';\n");
		await writeFile(
			path.join(root, 'models/score/score.model.ts'),
			[
				'export interface Score extends MongooseSeedwork.Base { name: string; schoolId: string }',
				"export const ScoreModelName = 'Score';",
				'export const ScoreModelFactory = () => ({});',
				'const schema = {',
				"  name: { type: String, required: true, minlength: 1 },",
				"  schoolId: { type: String, ref: 'School' },",
				"  collection: 'scores',",
				'};',
				'void schema;',
			].join('\n'),
		);
		const messages = formatViolations(await checkModelsLayout({ modelsRoot: root }));
		expect(messages.some((line) => line.includes('models.schema.pattern'))).toBe(true);
		expect(messages.some((line) => line.includes('models.schema.reference'))).toBe(true);
	});

	it('rejects a repository getById that returns null', async () => {
		const root = await tempRoot();
		await writePersistenceSlice(root);
		const messages = formatViolations(await checkPersistenceDomainLayout({ persistenceRoot: root }));
		expect(messages.some((line) => line.includes('persistence.repository.missing'))).toBe(true);
	});

	it('rejects a read repository getById that does not return null', async () => {
		const root = await tempRoot();
		await writeReadonlySlice(root);
		const messages = formatViolations(await checkPersistenceReadonlyLayout({ persistenceRoot: root }));
		expect(messages.some((line) => line.includes('persistence.readonly.missing'))).toBe(true);
	});

	it('ignores an existing graphql file until its subdomain is enrolled', async () => {
		const root = await tempRoot();
		await writeFile(path.join(root, 'score.graphql'), 'type Score { name: String }\n');
		expect(formatViolations(await checkGraphqlLayout({ files: [] }))).toEqual([]);
		const messages = formatViolations(await checkGraphqlLayout({ files: [path.join(root, 'score.graphql')] }));
		expect(messages.some((line) => line.includes('graphql.files') && line.includes('score.resolvers.ts'))).toBe(true);
	});

	it('ignores an existing queue handler until its folder is enrolled', async () => {
		const root = await tempRoot();
		await mkdir(path.join(root, 'fn_queue_handler_school'), { recursive: true });
		await writeFile(path.join(root, 'index.ts'), 'export const legacy = 1;\n');
		await writeFile(path.join(root, 'fn_queue_handler_school/index.ts'), 'export const school = () => 1;\n');
		expect(formatViolations(await checkQueueOperationsLayout({ files: [] }))).toEqual([]);
		const messages = formatViolations(await checkQueueOperationsLayout({ files: [path.join(root, 'fn_queue_handler_school/index.ts')] }));
		expect(messages.some((line) => line.includes('queue.shape'))).toBe(true);
	});

	it('accepts an enrolled graphql pair and an enrolled timer that call the application service', async () => {
		const graphqlRoot = await tempRoot();
		await writeFile(path.join(graphqlRoot, 'score.graphql'), 'type Score {\n  id: ID!\n}\nextend type Query {\n  scoreById(id: ID!): Score\n}\n');
		await writeFile(
			path.join(graphqlRoot, 'score.resolvers.ts'),
			'const scoreResolvers = { Query: { scoreById: async (_parent, args, context) => context.applicationServices.Exam.Score.queryById({ id: args.id }) } };\nexport default scoreResolvers;\n',
		);
		expect(formatViolations(await checkGraphqlLayout({ files: [path.join(graphqlRoot, 'score.graphql'), path.join(graphqlRoot, 'score.resolvers.ts')] }))).toEqual([]);

		const timerRoot = await tempRoot();
		await mkdir(path.join(timerRoot, 'fn_timer_handler_daily_job'), { recursive: true });
		await writeFile(path.join(timerRoot, 'index.ts'), "export { dailyJobOperation, dailyJobPermissions, dailyJobSchedule } from './fn_timer_handler_daily_job/index.ts';\n");
		await writeFile(
			path.join(timerRoot, 'fn_timer_handler_daily_job/index.ts'),
			[
				'export const dailyJobPermissions = { canManageScore: true };',
				'export function dailyJobSchedule(): string {',
				"  const schedule = process.env['DAILY_JOB_SCHEDULE'];",
				"  if (!schedule) throw new Error('DAILY_JOB_SCHEDULE is not defined');",
				'  return schedule;',
				'}',
				'export const dailyJobOperation: TimerOperation<ApplicationServices> = async (_timer, _context, applicationServices) => {',
				'  await applicationServices.Exam.Score.dailyJob({});',
				'};',
			].join('\n'),
		);
		expect(formatViolations(await checkTimerOperationsLayout({ files: [path.join(timerRoot, 'fn_timer_handler_daily_job/index.ts')] }))).toEqual([]);
	});

	it('ignores an existing timer handler until its folder is enrolled', async () => {
		const root = await tempRoot();
		await mkdir(path.join(root, 'fn_timer_handler_daily_job'), { recursive: true });
		await writeFile(path.join(root, 'index.ts'), 'export const legacy = 1;\n');
		await writeFile(path.join(root, 'fn_timer_handler_daily_job/index.ts'), 'export const daily = () => 1;\n');
		expect(formatViolations(await checkTimerOperationsLayout({ files: [] }))).toEqual([]);
		const messages = formatViolations(await checkTimerOperationsLayout({ files: [path.join(root, 'fn_timer_handler_daily_job/index.ts')] }));
		expect(messages.some((line) => line.includes('timer.shape'))).toBe(true);
	});

	it('rejects composition aimed at apps/api', async () => {
		const root = await tempRoot();
		const compositionFile = path.join(root, 'apps/api/src/index.ts');
		await mkdir(path.dirname(compositionFile), { recursive: true });
		await writeFile(compositionFile, 'export const host = {};\n');
		const messages = formatViolations(await checkApiComposition({ compositionFile }));
		expect(messages.some((line) => line.includes('api.composition.target'))).toBe(true);
	});

	it('rejects a visa that does not extend Visa', async () => {
		const domainRoot = await tempRoot();
		await writeDomainSlice(domainRoot);
		await writeFile(path.join(domainRoot, 'domain/contexts/exam/exam.visa.ts'), 'export interface ExamVisa { determineIf(): boolean }\n');
		const messages = formatViolations(await checkDomainContextFolders({ domainRoot }));
		expect(messages.some((line) => line.includes('domain.context.visa') && line.includes('extends Visa'))).toBe(true);
	});

	it('rejects a context passport that omits a subdomain', async () => {
		const domainRoot = await tempRoot();
		await writeDomainSlice(domainRoot);
		await writeFile(path.join(domainRoot, 'domain/contexts/exam/exam.passport.ts'), 'export interface ExamPassport {}\n');
		const messages = formatViolations(await checkDomainContextFolders({ domainRoot }));
		expect(messages.some((line) => line.includes('domain.context.passport') && line.includes('forScore'))).toBe(true);
	});

	it('rejects a unit of work that extends only one base', async () => {
		const domainRoot = await tempRoot();
		await writeDomainSlice(domainRoot);
		await writeFile(
			path.join(domainRoot, 'domain/contexts/exam/score/score.uow.ts'),
			'export interface ScoreUnitOfWork extends UnitOfWork<Passport, ScoreProps, Score<ScoreProps>, ScoreRepository<ScoreProps>> {}\n',
		);
		const messages = formatViolations(await checkDomainContextFolders({ domainRoot }));
		expect(messages.some((line) => line.includes('domain.uow.shape') && line.includes('InitializedUnitOfWork'))).toBe(true);
	});

	it('rejects an adapter method', async () => {
		const root = await tempRoot();
		await writePersistenceSlice(root);
		await writeFile(
			path.join(root, 'datasources/domain/exam/score/score.domain-adapter.ts'),
			'export class ScoreDomainAdapter { get name(): string { return this.doc.name; } tidy(): void { return; } }\nexport class ScoreConverter extends MongoTypeConverter {}\n',
		);
		const messages = formatViolations(await checkPersistenceDomainLayout({ persistenceRoot: root }));
		expect(messages.some((line) => line.includes('persistence.adapter.member') && line.includes('tidy'))).toBe(true);
	});

	it('rejects a domain file that imports mongoose', async () => {
		const root = await tempRoot();
		const domainRoot = path.join(root, 'domain');
		const empty = path.join(root, 'empty');
		await mkdir(domainRoot, { recursive: true });
		await mkdir(empty, { recursive: true });
		await writeFile(path.join(domainRoot, 'exam.ts'), "import mongoose from 'mongoose';\nexport const exam = mongoose;\n");
		const messages = formatViolations(
			await checkLayerDependencies({
				domainRoot,
				persistenceRoot: empty,
				applicationServicesRoot: empty,
				modelsRoot: empty,
				scope: '@pwy',
			}),
		);
		expect(messages.some((line) => line.includes('domain.imports') && line.includes('mongoose'))).toBe(true);
	});

	it('ignores a mongoose import that exists only in a comment', async () => {
		const root = await tempRoot();
		const domainRoot = path.join(root, 'domain');
		const empty = path.join(root, 'empty');
		await mkdir(domainRoot, { recursive: true });
		await mkdir(empty, { recursive: true });
		await writeFile(path.join(domainRoot, 'exam.ts'), "// import mongoose from 'mongoose';\nexport const exam = 1;\n");
		const messages = formatViolations(
			await checkLayerDependencies({
				domainRoot,
				persistenceRoot: empty,
				applicationServicesRoot: empty,
				modelsRoot: empty,
				scope: '@pwy',
			}),
		);
		expect(messages.some((line) => line.includes('mongoose'))).toBe(false);
	});

	it('accepts a nested getter that returns null from a ternary', async () => {
		const domainRoot = await tempRoot();
		await writeDomainSlice(domainRoot);
		const aggregate = path.join(domainRoot, 'domain/contexts/exam/score/score.aggregate.ts');
		const text = await readFile(aggregate, 'utf8');
		await writeFile(
			aggregate,
			text
				.replace('readonly schemaVersion: string;', 'readonly schemaVersion: string;\n  readonly profile: ProfileProps | null;')
				.replace(
					'get name(): string { return this.props.name; }',
					'get name(): string { return this.props.name; }\n  get profile() {\n    // return null\n    return this.props.profile ? new Profile(this.props.profile) : null;\n  }',
				),
		);
		const messages = formatViolations(await checkDomainContextFolders({ domainRoot }));
		expect(messages.some((line) => line.includes('domain.aggregate.nested'))).toBe(false);
	});

	it('does not treat a comment as a nested null return', async () => {
		const domainRoot = await tempRoot();
		await writeDomainSlice(domainRoot);
		const aggregate = path.join(domainRoot, 'domain/contexts/exam/score/score.aggregate.ts');
		const text = await readFile(aggregate, 'utf8');
		await writeFile(
			aggregate,
			text
				.replace('readonly schemaVersion: string;', 'readonly schemaVersion: string;\n  readonly profile: ProfileProps | null;')
				.replace('get name(): string { return this.props.name; }', 'get name(): string { return this.props.name; }\n  get profile() {\n    // return null\n    return this.props.profile;\n  }'),
		);
		const messages = formatViolations(await checkDomainContextFolders({ domainRoot }));
		expect(messages.some((line) => line.includes('domain.aggregate.nested') && line.includes('profile'))).toBe(true);
	});

	it('accepts a readonly getById that returns null inside an if', async () => {
		const root = await tempRoot();
		await writeReadonlySlice(root);
		await writeFile(
			path.join(root, 'datasources/readonly/exam/score/score.read-repository.ts'),
			[
				'export interface ScoreReadRepository { getById(id: string): Promise<unknown> }',
				'class ScoreReadRepositoryImpl {',
				'  async getById(id: string) {',
				'    // return null',
				'    const document = await this.mongoDataSource.findById(id);',
				'    if (!document) return null;',
				'    return this.converter.toDomain(document, this.passport);',
				'  }',
				'}',
			].join('\n'),
		);
		const messages = formatViolations(await checkPersistenceReadonlyLayout({ persistenceRoot: root }));
		expect(messages.some((line) => line.includes('persistence.readonly.missing'))).toBe(false);
	});
});

async function writeRoleSubdomain(domainRoot: string): Promise<void> {
	const subdomain = path.join(domainRoot, 'domain/contexts/harbor/dock-role');
	await mkdir(subdomain, { recursive: true });
	await writeFile(path.join(domainRoot, 'domain/contexts/index.ts'), "export * as Harbor from './harbor/index.ts';\n");
	await writeFile(path.join(domainRoot, 'domain/contexts/passport.ts'), 'export interface Passport { harbor: { forDockRole(entity: unknown): unknown } }\n');
	await writeFile(path.join(domainRoot, 'domain/contexts/harbor/harbor.domain-permissions.ts'), 'export interface HarborDomainPermissions { canAssignBerth: boolean }\n');
	await writeFile(path.join(domainRoot, 'domain/contexts/harbor/harbor.visa.ts'), "import type { Visa } from '@cellix/domain-seedwork/visa';\nexport interface HarborVisa extends Visa<HarborDomainPermissions> {}\n");
	await writeFile(path.join(domainRoot, 'domain/contexts/harbor/harbor.passport.ts'), 'export interface HarborPassport { forDockRole(root: unknown): unknown }\n');
	await writeFile(
		path.join(domainRoot, 'domain/contexts/harbor/index.ts'),
		"export * as DockRole from './dock-role/index.ts';\nexport type { HarborDomainPermissions } from './harbor.domain-permissions.ts';\nexport type { HarborVisa } from './harbor.visa.ts';\nexport type { HarborPassport } from './harbor.passport.ts';\n",
	);
	await writeFile(path.join(subdomain, 'dock-role.aggregate.ts'), dockRoleAggregate());
	await writeFile(path.join(subdomain, 'dock-role.repository.ts'), 'export interface DockRoleRepository<props extends DockRoleProps> extends Repository<DockRole<props>> { getByRoleName(roleName: string): Promise<DockRole<props>> }\n');
	await writeFile(
		path.join(subdomain, 'dock-role.uow.ts'),
		'export interface DockRoleUnitOfWork extends UnitOfWork<Passport, DockRoleProps, DockRole<DockRoleProps>, DockRoleRepository<DockRoleProps>>, InitializedUnitOfWork<Passport, DockRoleProps, DockRole<DockRoleProps>, DockRoleRepository<DockRoleProps>> {}\n',
	);
	await writeFile(
		path.join(subdomain, 'dock-role.value-objects.ts'),
		"import { VOSet, VOString } from '@lucaspaganini/value-objects';\nexport class RoleName extends VOString({ trim: true, minLength: 1, maxLength: 50 }) {}\nexport class DockKind extends VOSet(['Dock.Pilot']) {}\n",
	);
	await writeFile(path.join(subdomain, 'dock-role-berth-permissions.ts'), dockRoleBerthPermissions());
	await writeFile(path.join(subdomain, 'dock-role-permissions.ts'), dockRolePermissions());
	await writeFile(
		path.join(subdomain, 'index.ts'),
		"export { DockRole } from './dock-role.aggregate.ts';\nexport type { DockRoleRepository } from './dock-role.repository.ts';\nexport type { DockRoleUnitOfWork } from './dock-role.uow.ts';\nexport * as DockRoleValueObjects from './dock-role.value-objects.ts';\nexport { DockRolePermissions } from './dock-role-permissions.ts';\nexport { DockRoleBerthPermissions } from './dock-role-berth-permissions.ts';\n",
	);
}

function dockRoleAggregate(): string {
	return [
		'export interface DockRoleProps extends DomainEntityProps {',
		'  roleName: string;',
		'  isDefault: boolean;',
		'  readonly permissions: DockRolePermissionsProps;',
		'  readonly createdAt: Date;',
		'  readonly updatedAt: Date;',
		'}',
		'export interface DockRoleEntityReference extends Readonly<Omit<DockRoleProps, \'permissions\'>> {',
		'  readonly permissions: DockRolePermissionsEntityReference;',
		'}',
		'export class DockRole<props extends DockRoleProps> extends AggregateRoot<props, Passport> implements DockRoleEntityReference {',
		'  private isNew: boolean = false;',
		'  private readonly visa: HarborVisa;',
		'  constructor(props: props, passport: Passport) {',
		'    super(props, passport);',
		'    this.visa = passport.harbor.forDockRole(this);',
		'  }',
		'  public static getNewInstance<props extends DockRoleProps>(newProps: props, passport: Passport, roleName: string, isDefault: boolean): DockRole<props> {',
		'    const role = new DockRole(newProps, passport);',
		'    role.isNew = true;',
		'    role.roleName = roleName;',
		'    role.isDefault = isDefault;',
		'    role.isNew = false;',
		'    return role;',
		'  }',
		'  public static getNewDefaultPilotInstance<props extends DockRoleProps>(newProps: props, passport: Passport): DockRole<props> {',
		'    const role = new DockRole(newProps, passport);',
		'    role.isNew = true;',
		"    role.roleName = 'Dock Pilot';",
		'    role.isDefault = true;',
		'    role.permissions.berthPermissions.canAssignBerth = true;',
		'    role.permissions.berthPermissions.canCloseBerth = false;',
		'    role.isNew = false;',
		'    return role;',
		'  }',
		"  public static getDefaultRoleNames(): string[] { return ['Dock.Pilot']; }",
		'  public deleteAndReassignTo(roleRef: DockRoleEntityReference): void {',
		"    if (this.isDefault) { throw new Error('A default role cannot be deleted'); }",
		'    super.isDeleted = true;',
		'    this.addIntegrationEvent(RoleDeletedReassignEvent, { deletedRoleId: this.props.id, newRoleId: roleRef.id });',
		'  }',
		'  public updateRoleName(roleName: string): void { this.props.roleName = roleName; }',
		'  get roleName(): string { return this.props.roleName; }',
		'  set roleName(roleName: string) { this.props.roleName = roleName; }',
		'  get isDefault(): boolean { return this.props.isDefault; }',
		'  set isDefault(isDefault: boolean) { this.props.isDefault = isDefault; }',
		'  get permissions(): DockRolePermissions { return new DockRolePermissions(this.props.permissions, this.visa); }',
		'  get createdAt(): Date { return this.props.createdAt; }',
		'  get updatedAt(): Date { return this.props.updatedAt; }',
		'}',
	].join('\n');
}

function dockRoleBerthPermissions(): string {
	return [
		'export interface DockRoleBerthPermissionsProps extends ValueObjectProps {',
		'  canAssignBerth: boolean;',
		'  canCloseBerth: boolean;',
		'}',
		'export class DockRoleBerthPermissions extends ValueObject<DockRoleBerthPermissionsProps> {',
		'  private readonly visa: HarborVisa;',
		'  constructor(props: DockRoleBerthPermissionsProps, visa: HarborVisa) {',
		'    super(props);',
		'    this.visa = visa;',
		'  }',
		'  get canAssignBerth(): boolean { return this.props.canAssignBerth; }',
		'  set canAssignBerth(value: boolean) { this.props.canAssignBerth = value; }',
		'  get canCloseBerth(): boolean { return this.props.canCloseBerth; }',
		'  set canCloseBerth(value: boolean) { this.props.canCloseBerth = value; }',
		'}',
	].join('\n');
}

function dockRolePermissions(): string {
	return [
		'export interface DockRolePermissionsProps extends ValueObjectProps {',
		'  readonly berthPermissions: DockRoleBerthPermissionsProps;',
		'}',
		'export class DockRolePermissions extends ValueObject<DockRolePermissionsProps> {',
		'  private readonly visa: HarborVisa;',
		'  constructor(props: DockRolePermissionsProps, visa: HarborVisa) {',
		'    super(props);',
		'    this.visa = visa;',
		'  }',
		'  get berthPermissions(): DockRoleBerthPermissions {',
		'    return new DockRoleBerthPermissions(this.props.berthPermissions ?? { canAssignBerth: false, canCloseBerth: false }, this.visa);',
		'  }',
		'}',
	].join('\n');
}

async function tempRoot(): Promise<string> {
	const root = await mkdtemp(path.join(tmpdir(), 'pwy-arch-'));
	roots.push(root);
	return root;
}

async function writeDomainSlice(domainRoot: string): Promise<void> {
	const subdomain = path.join(domainRoot, 'domain/contexts/exam/score');
	await mkdir(subdomain, { recursive: true });
	await writeFile(path.join(domainRoot, 'domain/contexts/index.ts'), "export * as Exam from './exam/index.ts';\n");
	await writeFile(path.join(domainRoot, 'domain/contexts/passport.ts'), 'export interface Passport { exam: { forScore(entity: unknown): unknown } }\n');
	await writeFile(path.join(domainRoot, 'domain/contexts/exam/exam.domain-permissions.ts'), 'export interface ExamDomainPermissions { canManageScore: boolean }\n');
	await writeFile(
		path.join(domainRoot, 'domain/contexts/exam/exam.visa.ts'),
		"import type { Visa } from '@cellix/domain-seedwork/visa';\nexport interface ExamVisa extends Visa<ExamDomainPermissions> { determineIf(func: (permissions: Readonly<ExamDomainPermissions>) => boolean): boolean }\n",
	);
	await writeFile(path.join(domainRoot, 'domain/contexts/exam/exam.passport.ts'), 'export interface ExamPassport { forScore(root: unknown): unknown }\n');
	await writeFile(
		path.join(domainRoot, 'domain/contexts/exam/index.ts'),
		"export * as Score from './score/index.ts';\nexport type { ExamDomainPermissions } from './exam.domain-permissions.ts';\nexport type { ExamVisa } from './exam.visa.ts';\nexport type { ExamPassport } from './exam.passport.ts';\n",
	);
	await writeFile(
		path.join(subdomain, 'score.aggregate.ts'),
		[
			'export interface ScoreProps extends DomainEntityProps {',
			'  name: string;',
			'  readonly createdAt: Date;',
			'  readonly updatedAt: Date;',
			'  readonly schemaVersion: string;',
			'}',
			'export interface ScoreEntityReference extends Readonly<ScoreProps> {}',
			'export class Score<props extends ScoreProps> extends AggregateRoot<props, Passport> implements ScoreEntityReference {',
			'  private isNew: boolean = false;',
			'  private readonly visa: ExamVisa;',
			'  constructor(props: props, passport: Passport) {',
			'    super(props, passport);',
			'    this.visa = passport.exam.forScore(this);',
			'  }',
			'  public static getNewInstance<props extends ScoreProps>(newProps: props, name: string, passport: Passport): Score<props> {',
			'    const newInstance = new Score(newProps, passport);',
			'    newInstance.markAsNew();',
			'    newInstance.name = name;',
			'    newInstance.isNew = false;',
			'    return newInstance;',
			'  }',
			'  private markAsNew(): void { this.isNew = true; }',
			'  get name(): string { return this.props.name; }',
			'  set name(name: string) {',
			'    if (!this.isNew && !this.visa.determineIf((permissions) => permissions.canManageScore)) {',
			"      throw new PermissionError('You do not have permission to change name');",
			'    }',
			'    this.props.name = new ValueObjects.Name(name).valueOf();',
			'  }',
			'  get createdAt(): Date { return this.props.createdAt; }',
			'  get updatedAt(): Date { return this.props.updatedAt; }',
			'  get schemaVersion(): string { return this.props.schemaVersion; }',
			'}',
		].join('\n'),
	);
	await writeFile(
		path.join(subdomain, 'score.repository.ts'),
		'export interface ScoreRepository<props extends ScoreProps> extends Repository<Score<props>> { getNewInstance(name: string): Promise<Score<props>>; getById(id: string): Promise<Score<props>> }\n',
	);
	await writeFile(
		path.join(subdomain, 'score.uow.ts'),
		'export interface ScoreUnitOfWork extends UnitOfWork<Passport, ScoreProps, Score<ScoreProps>, ScoreRepository<ScoreProps>>, InitializedUnitOfWork<Passport, ScoreProps, Score<ScoreProps>, ScoreRepository<ScoreProps>> {}\n',
	);
	await writeFile(path.join(subdomain, 'score.value-objects.ts'), "import { VOString } from '@lucaspaganini/value-objects';\nexport class Name extends VOString({ trim: true, minLength: 1, maxLength: 200 }) {}\n");
	await writeFile(
		path.join(subdomain, 'index.ts'),
		"export type { ScoreRepository } from './score.repository.ts';\nexport { Score, type ScoreEntityReference, type ScoreProps } from './score.aggregate.ts';\nexport type { ScoreUnitOfWork } from './score.uow.ts';\nexport * as ValueObjects from './score.value-objects.ts';\n",
	);
}

async function writePersistenceSlice(root: string): Promise<void> {
	const subdomain = path.join(root, 'datasources/domain/exam/score');
	await mkdir(subdomain, { recursive: true });
	await writeFile(path.join(root, 'datasources/domain/index.ts'), "import { ExamContextPersistence } from './exam/index.ts';\nexport const DomainDataSourceImplementation = ExamContextPersistence;\n");
	await writeFile(
		path.join(root, 'datasources/domain/exam/index.ts'),
		"import { ScorePersistence } from './score/index.ts';\nexport const ExamContextPersistence = () => ({ Score: ScorePersistence });\n",
	);
	await writeFile(path.join(subdomain, 'score.domain-adapter.ts'), 'export class ScoreDomainAdapter { get name(): string { return this.doc.name; } }\nexport class ScoreConverter extends MongoTypeConverter {}\n');
	await writeFile(
		path.join(subdomain, 'score.repository.ts'),
		[
			'export class ScoreRepository extends MongoRepositoryBase {',
			'  async getById(id: string) {',
			'    const document = await this.model.findById(id).exec();',
			'    return document ? this.typeConverter.toDomain(document, this.passport) : null;',
			'  }',
			'  async getNewInstance(name: string) {',
			'    const adapter = this.typeConverter.toAdapter(new this.model());',
			'    return Score.getNewInstance(adapter, name, this.passport);',
			'  }',
			'}',
		].join('\n'),
	);
	await writeFile(
		path.join(subdomain, 'score.uow.ts'),
		'export const getScoreUnitOfWork = (model: unknown, passport: unknown) => getInitializedUnitOfWork(new MongoUnitOfWork(model), passport);\n',
	);
	await writeFile(path.join(subdomain, 'index.ts'), "export { getScoreUnitOfWork } from './score.uow.ts';\nexport const ScorePersistence = getScoreUnitOfWork;\n");
}

async function writeReadonlySlice(root: string): Promise<void> {
	const subdomain = path.join(root, 'datasources/readonly/exam/score');
	await mkdir(subdomain, { recursive: true });
	await writeFile(path.join(root, 'datasources/readonly/index.ts'), "import { Exam } from './exam/index.ts';\nexport const ReadonlyDataSource = { Exam };\n");
	await writeFile(path.join(root, 'datasources/readonly/exam/index.ts'), "import { getScoreReadRepository } from './score/index.ts';\nexport const Exam = () => ({ Score: getScoreReadRepository });\n");
	await writeFile(path.join(subdomain, 'score.data.ts'), 'export interface ScoreDataSource {}\nexport class ScoreDataSourceImpl {}\n');
	await writeFile(
		path.join(subdomain, 'score.read-repository.ts'),
		[
			'export interface ScoreReadRepository { getAll(): Promise<unknown[]>; getById(id: string): Promise<unknown> }',
			'class ScoreReadRepositoryImpl {',
			'  async getAll() {',
			'    const result = await this.mongoDataSource.find({});',
			'    return result.map((doc: unknown) => this.converter.toDomain(doc, this.passport));',
			'  }',
			'  async getById(id: string) {',
			'    const document = await this.mongoDataSource.findById(id);',
			'    if (!document) throw new Error("missing");',
			'    return this.converter.toDomain(document, this.passport);',
			'  }',
			'}',
		].join('\n'),
	);
	await writeFile(path.join(subdomain, 'index.ts'), "export { type ScoreReadRepository } from './score.read-repository.ts';\nexport const getScoreReadRepository = () => ({});\n");
}

async function writeApplicationSlice(root: string): Promise<void> {
	const subdomain = path.join(root, 'contexts/exam/score');
	await mkdir(subdomain, { recursive: true });
	await writeFile(path.join(root, 'index.ts'), "import { Exam } from './contexts/exam/index.ts';\nexport const services = { Exam: Exam({} as never) };\n");
	await writeFile(
		path.join(root, 'contexts/exam/index.ts'),
		"import { Score as ScoreApi, type ScoreApplicationService } from './score/index.ts';\nexport interface ExamContextApplicationService { Score: ScoreApplicationService }\nexport const Exam = (dataSources: unknown): ExamContextApplicationService => ({ Score: ScoreApi(dataSources) });\n",
	);
	await writeFile(
		path.join(subdomain, 'query-by-id.ts'),
		'export interface ScoreQueryByIdCommand { id: string }\nexport const queryById = (dataSources: { readonlyDataSource: { Exam: { Score: { ScoreReadRepo: { getById: (id: string) => Promise<unknown> } } } } }) => async (command: ScoreQueryByIdCommand) => await dataSources.readonlyDataSource.Exam.Score.ScoreReadRepo.getById(command.id);\n',
	);
	await writeFile(
		path.join(subdomain, 'index.ts'),
		"import { type ScoreQueryByIdCommand, queryById } from './query-by-id.ts';\nexport interface ScoreApplicationService { queryById: (command: ScoreQueryByIdCommand) => Promise<unknown> }\nexport const Score = (dataSources: unknown): ScoreApplicationService => ({ queryById: queryById(dataSources) });\n",
	);
}
