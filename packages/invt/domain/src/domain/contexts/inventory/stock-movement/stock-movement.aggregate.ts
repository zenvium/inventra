import { AggregateRoot } from '@cellix/domain-seedwork/aggregate-root';
import { PermissionError } from '@cellix/domain-seedwork/domain-entity';
import type { DomainEntityProps } from '@cellix/domain-seedwork/domain-entity';
import type { Passport } from '../../passport.ts';
import type { InventoryVisa } from '../inventory.visa.ts';

export type StockMovementType = 'RECEIPT' | 'SALE' | 'ADJUSTMENT' | 'TRANSFER_IN' | 'TRANSFER_OUT';

export interface StockMovementProps extends DomainEntityProps {
	organizationId: string;
	productId: string;
	warehouseId: string;
	type: StockMovementType;
	quantityChange: number;
	referenceId: string | null;
	reason: string | null;
	performedBy: string | null;
	readonly createdAt: Date;
	readonly updatedAt: Date;
	readonly schemaVersion: string;
}

export interface StockMovementEntityReference extends Readonly<StockMovementProps> {}

export class StockMovement<props extends StockMovementProps> extends AggregateRoot<props, Passport> implements StockMovementEntityReference {
	private isNew = false;
	private readonly visa: InventoryVisa;

	constructor(props: props, passport: Passport) {
		super(props, passport);
		this.visa = passport.inventory.forStockMovement(this);
	}

	public static getNewInstance<props extends StockMovementProps>(
		newProps: props,
		organizationId: string,
		productId: string,
		warehouseId: string,
		type: StockMovementType,
		quantityChange: number,
		referenceId: string | null,
		reason: string | null,
		performedBy: string | null,
		passport: Passport,
	): StockMovement<props> {
		const stockMovement = new StockMovement(newProps, passport);
		stockMovement.markAsNew();
		stockMovement.organizationId = organizationId;
		stockMovement.productId = productId;
		stockMovement.warehouseId = warehouseId;
		stockMovement.type = type;
		stockMovement.quantityChange = quantityChange;
		stockMovement.referenceId = referenceId;
		stockMovement.reason = reason;
		stockMovement.performedBy = performedBy;
		stockMovement.isNew = false;
		return stockMovement;
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
	get type(): StockMovementType {
		return this.props.type;
	}
	set type(type: StockMovementType) {
		this.ensureCanManage();
		this.props.type = type;
	}
	get quantityChange(): number {
		return this.props.quantityChange;
	}
	set quantityChange(quantityChange: number) {
		this.ensureCanManage();
		this.props.quantityChange = quantityChange;
	}
	get referenceId(): string | null {
		return this.props.referenceId;
	}
	set referenceId(referenceId: string | null) {
		this.ensureCanManage();
		this.props.referenceId = referenceId;
	}
	get reason(): string | null {
		return this.props.reason;
	}
	set reason(reason: string | null) {
		this.ensureCanManage();
		this.props.reason = reason;
	}
	get performedBy(): string | null {
		return this.props.performedBy;
	}
	set performedBy(performedBy: string | null) {
		this.ensureCanManage();
		this.props.performedBy = performedBy;
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
		if (!this.isNew && !this.visa.determineIf((permissions) => permissions.canManageStockMovement)) {
			throw new PermissionError('Cannot update stock-movement: insufficient permissions');
		}
	}

}
