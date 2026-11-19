import { AggregateRoot } from '@cellix/domain-seedwork/aggregate-root';
import { PermissionError } from '@cellix/domain-seedwork/domain-entity';
import type { DomainEntityProps } from '@cellix/domain-seedwork/domain-entity';
import type { Passport } from '../../passport.ts';
import type { InventoryVisa } from '../inventory.visa.ts';
import { Address, type AddressProps } from './address.value-object.ts';

export interface WarehouseProps extends DomainEntityProps {
	organizationId: string;
	name: string;
	code: string;
	address: AddressProps | null;
	isActive: boolean;
	readonly createdAt: Date;
	readonly updatedAt: Date;
	readonly schemaVersion: string;
}

export interface WarehouseEntityReference extends Readonly<Omit<WarehouseProps, 'address'>> {
	readonly address: AddressProps | null;
}

export class Warehouse<props extends WarehouseProps> extends AggregateRoot<props, Passport> implements WarehouseEntityReference {
	private isNew = false;
	private readonly visa: InventoryVisa;

	constructor(props: props, passport: Passport) {
		super(props, passport);
		this.visa = passport.inventory.forWarehouse(this);
	}

	public static getNewInstance<props extends WarehouseProps>(
		newProps: props,
		organizationId: string,
		name: string,
		code: string,
		isActive: boolean,
		passport: Passport,
	): Warehouse<props> {
		const warehouse = new Warehouse(newProps, passport);
		warehouse.markAsNew();
		warehouse.organizationId = organizationId;
		warehouse.name = name;
		warehouse.code = code;
		warehouse.isActive = isActive;
		warehouse.isNew = false;
		return warehouse;
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
	get code(): string {
		return this.props.code;
	}
	set code(code: string) {
		this.ensureCanManage();
		this.props.code = code;
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
		if (!this.isNew && !this.visa.determineIf((permissions) => permissions.canManageWarehouse)) {
			throw new PermissionError('Cannot update warehouse: insufficient permissions');
		}
	}

}
