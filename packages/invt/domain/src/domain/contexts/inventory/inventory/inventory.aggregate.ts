import { AggregateRoot } from '@cellix/domain-seedwork/aggregate-root';
import { PermissionError } from '@cellix/domain-seedwork/domain-entity';
import type { DomainEntityProps } from '@cellix/domain-seedwork/domain-entity';
import type { Passport } from '../../passport.ts';
import type { InventoryVisa } from '../inventory.visa.ts';

export interface InventoryProps extends DomainEntityProps {
	organizationId: string;
	productId: string;
	warehouseId: string;
	quantityOnHand: number;
	quantityReserved: number;
	readonly createdAt: Date;
	readonly updatedAt: Date;
	readonly schemaVersion: string;
}

export interface InventoryEntityReference extends Readonly<InventoryProps> {}

export class Inventory<props extends InventoryProps> extends AggregateRoot<props, Passport> implements InventoryEntityReference {
	private isNew = false;
	protected readonly visa: InventoryVisa;

	constructor(props: props, passport: Passport) {
		super(props, passport);
		this.visa = passport.inventory.forInventory(this);
	}

	get organizationId(): string {
		return this.props.organizationId;
	}
	set organizationId(organizationId: string) {
		this.ensureCanManage();
		this.props.organizationId = organizationId;
	}

	get productId(): string {
		return this.props.productId;
	}
	set productId(productId: string) {
		this.ensureCanManage();
		this.props.productId = productId;
	}

	get warehouseId(): string {
		return this.props.warehouseId;
	}
	set warehouseId(warehouseId: string) {
		this.ensureCanManage();
		this.props.warehouseId = warehouseId;
	}

	get quantityOnHand(): number {
		return this.props.quantityOnHand;
	}
	set quantityOnHand(quantityOnHand: number) {
		this.ensureCanManage();
		this.props.quantityOnHand = quantityOnHand;
	}

	get quantityReserved(): number {
		return this.props.quantityReserved;
	}
	set quantityReserved(quantityReserved: number) {
		this.ensureCanManage();
		this.props.quantityReserved = quantityReserved;
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

	public static getNewInstance<props extends InventoryProps>(
		newProps: props,
		organizationId: string,
		productId: string,
		warehouseId: string,
		quantityOnHand: number,
		quantityReserved: number,
		passport: Passport,
	): Inventory<props> {
		const inventory = new Inventory(newProps, passport);
		inventory.markAsNew();
		inventory.organizationId = organizationId;
		inventory.productId = productId;
		inventory.warehouseId = warehouseId;
		inventory.quantityOnHand = quantityOnHand;
		inventory.quantityReserved = quantityReserved;
		inventory.isNew = false;
		return inventory;
	}

	private markAsNew(): void {
		this.isNew = true;
	}
	private ensureCanManage(): void {
		if (!this.isNew && !this.visa.determineIf((permissions) => permissions.canManageInventory)) {
			throw new PermissionError('Cannot update inventory: insufficient permissions');
		}
	}

}
