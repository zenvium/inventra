import { AggregateRoot } from '@cellix/domain-seedwork/aggregate-root';
import { PermissionError } from '@cellix/domain-seedwork/domain-entity';
import type { DomainEntityProps } from '@cellix/domain-seedwork/domain-entity';
import type { Passport } from '../../passport.ts';
import type { OrganizationVisa } from '../organization.visa.ts';

export interface OrganizationProps extends DomainEntityProps {
	name: string;
	slug: string;
	readonly createdAt: Date;
	readonly updatedAt: Date;
	readonly schemaVersion: string;
}

export interface OrganizationEntityReference extends Readonly<OrganizationProps> {}

export class Organization<props extends OrganizationProps> extends AggregateRoot<props, Passport> implements OrganizationEntityReference {
	private isNew = false;
	protected readonly visa: OrganizationVisa;

	constructor(props: props, passport: Passport) {
		super(props, passport);
		this.visa = passport.organization.forOrganization(this);
	}

	get name(): string {
		return this.props.name;
	}
	set name(name: string) {
		this.ensureCanManage();
		this.props.name = name;
	}

	get slug(): string {
		return this.props.slug;
	}
	set slug(slug: string) {
		this.ensureCanManage();
		this.props.slug = slug;
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

	public static getNewInstance<props extends OrganizationProps>(newProps: props, name: string, slug: string, passport: Passport): Organization<props> {
		const organization = new Organization(newProps, passport);
		organization.markAsNew();
		organization.name = name;
		organization.slug = slug;
		organization.isNew = false;
		return organization;
	}

	private markAsNew(): void {
		this.isNew = true;
	}
	private ensureCanManage(): void {
		if (!this.isNew && !this.visa.determineIf((permissions) => permissions.canManageOrganization)) {
			throw new PermissionError('Cannot update organization: insufficient permissions');
		}
	}

}
