import { AggregateRoot } from '@cellix/domain-seedwork/aggregate-root';
import { PermissionError } from '@cellix/domain-seedwork/domain-entity';
import type { DomainEntityProps } from '@cellix/domain-seedwork/domain-entity';
import type { Passport } from '../../passport.ts';
import type { PartnerVisa } from '../partner.visa.ts';
import { Address, type AddressProps } from './address.value-object.ts';

export interface CustomerProps extends DomainEntityProps {
	organizationId: string;
	name: string;
	email: string | null;
	phone: string | null;
	address: AddressProps | null;
	readonly createdAt: Date;
	readonly updatedAt: Date;
	readonly schemaVersion: string;
}

export interface CustomerEntityReference extends Readonly<Omit<CustomerProps, 'address'>> {
	readonly address: Address | null;
}

export class Customer<props extends CustomerProps> extends AggregateRoot<props, Passport> implements CustomerEntityReference {
	private isNew = false;
	private readonly visa: PartnerVisa;

	constructor(props: props, passport: Passport) {
		super(props, passport);
		this.visa = passport.partner.forCustomer(this);
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

	get email(): string | null {
		return this.props.email;
	}
	set email(email: string | null) {
		this.ensureCanManage();
		this.props.email = email;
	}

	get phone(): string | null {
		return this.props.phone;
	}
	set phone(phone: string | null) {
		this.ensureCanManage();
		this.props.phone = phone;
	}

	get address(): Address | null {
		return this.props.address ? new Address(this.props.address) : null;
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

	public static getNewInstance<props extends CustomerProps>(
		newProps: props,
		organizationId: string,
		name: string,
		email: string | null,
		phone: string | null,
		passport: Passport,
	): Customer<props> {
		const customer = new Customer(newProps, passport);
		customer.markAsNew();
		customer.organizationId = organizationId;
		customer.name = name;
		customer.email = email;
		customer.phone = phone;
		customer.isNew = false;
		return customer;
	}

	private markAsNew(): void {
		this.isNew = true;
	}
	private ensureCanManage(): void {
		if (!this.isNew && !this.visa.determineIf((permissions) => permissions.canManageCustomer)) {
			throw new PermissionError('Cannot update customer: insufficient permissions');
		}
	}

}
