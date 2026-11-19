import { AggregateRoot } from '@cellix/domain-seedwork/aggregate-root';
import { PermissionError } from '@cellix/domain-seedwork/domain-entity';
import type { DomainEntityProps } from '@cellix/domain-seedwork/domain-entity';
import type { Passport } from '../../passport.ts';
import type { PartnerVisa } from '../partner.visa.ts';
import { Address, type AddressProps } from './address.value-object.ts';

export interface SupplierProps extends DomainEntityProps {
	organizationId: string;
	name: string;
	contactName: string | null;
	email: string | null;
	phone: string | null;
	address: AddressProps | null;
	isActive: boolean;
	readonly createdAt: Date;
	readonly updatedAt: Date;
	readonly schemaVersion: string;
}

export interface SupplierEntityReference extends Readonly<Omit<SupplierProps, 'address'>> {
	readonly address: Address | null;
}

export class Supplier<props extends SupplierProps> extends AggregateRoot<props, Passport> implements SupplierEntityReference {
	private isNew = false;
	private readonly visa: PartnerVisa;

	constructor(props: props, passport: Passport) {
		super(props, passport);
		this.visa = passport.partner.forSupplier(this);
	}

	public static getNewInstance<props extends SupplierProps>(
		newProps: props,
		organizationId: string,
		name: string,
		contactName: string | null,
		email: string | null,
		phone: string | null,
		isActive: boolean,
		passport: Passport,
	): Supplier<props> {
		const supplier = new Supplier(newProps, passport);
		supplier.markAsNew();
		supplier.organizationId = organizationId;
		supplier.name = name;
		supplier.contactName = contactName;
		supplier.email = email;
		supplier.phone = phone;
		supplier.isActive = isActive;
		supplier.isNew = false;
		return supplier;
	}

	private markAsNew(): void {
		this.isNew = true;
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
	get contactName(): string | null {
		return this.props.contactName;
	}
	set contactName(contactName: string | null) {
		this.ensureCanManage();
		this.props.contactName = contactName;
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
	private ensureCanManage(): void {
		if (!this.isNew && !this.visa.determineIf((permissions) => permissions.canManageSupplier)) {
			throw new PermissionError('Cannot update supplier: insufficient permissions');
		}
	}

}
