import { AggregateRoot } from '@cellix/domain-seedwork/aggregate-root';
import { PermissionError } from '@cellix/domain-seedwork/domain-entity';
import type { DomainEntityProps } from '@cellix/domain-seedwork/domain-entity';
import type { Passport } from '../../passport.ts';
import type { UserVisa } from '../user.visa.ts';

export type UserRole = 'ADMIN' | 'MANAGER' | 'EMPLOYEE' | 'VIEWER';

export interface UserProps extends DomainEntityProps {
	organizationId: string;
	name: string;
	email: string;
	role: UserRole;
	isActive: boolean;
	readonly createdAt: Date;
	readonly updatedAt: Date;
	readonly schemaVersion: string;
}

export interface UserEntityReference extends Readonly<UserProps> {}

export class User<props extends UserProps> extends AggregateRoot<props, Passport> implements UserEntityReference {
	private isNew = false;
	protected readonly visa: UserVisa;

	constructor(props: props, passport: Passport) {
		super(props, passport);
		this.visa = passport.user.forUser(this);
	}

	get organizationId(): string {
		return this.props.organizationId;
	}
	set organizationId(organizationId: string) {
		this.ensureCanManage();
		this.props.organizationId = organizationId;
	}

	get name(): string {
		return this.props.name;
	}
	set name(name: string) {
		this.ensureCanManage();
		this.props.name = name;
	}

	get email(): string {
		return this.props.email;
	}
	set email(email: string) {
		this.ensureCanManage();
		this.props.email = email;
	}

	get role(): UserRole {
		return this.props.role;
	}
	set role(role: UserRole) {
		this.ensureCanManage();
		this.props.role = role;
	}

	get isActive(): boolean {
		return this.props.isActive;
	}
	set isActive(isActive: boolean) {
		this.ensureCanManage();
		this.props.isActive = isActive;
	}

	get createdAt(): Date {
		return this.props.createdAt;
	}
	get updatedAt(): Date {
		return this.props.updatedAt;
	}
	get schemaVersion(): string {
		return this.props.schemaVersion;
	}

	public static getNewInstance<props extends UserProps>(
		newProps: props,
		organizationId: string,
		name: string,
		email: string,
		role: UserRole,
		isActive: boolean,
		passport: Passport,
	): User<props> {
		const user = new User(newProps, passport);
		user.markAsNew();
		user.organizationId = organizationId;
		user.name = name;
		user.email = email;
		user.role = role;
		user.isActive = isActive;
		user.isNew = false;
		return user;
	}

	private markAsNew(): void {
		this.isNew = true;
	}
	private ensureCanManage(): void {
		if (!this.isNew && !this.visa.determineIf((permissions) => permissions.canManageUser)) {
			throw new PermissionError('Cannot update user: insufficient permissions');
		}
	}

}
