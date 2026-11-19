import { AggregateRoot } from '@cellix/domain-seedwork/aggregate-root';
import { PermissionError } from '@cellix/domain-seedwork/domain-entity';
import type { DomainEntityProps } from '@cellix/domain-seedwork/domain-entity';
import type { Passport } from '../../passport.ts';
import type { ProcurementVisa } from '../procurement.visa.ts';

export type PurchaseOrderStatus = 'DRAFT' | 'SUBMITTED' | 'PARTIALLY_RECEIVED' | 'RECEIVED' | 'CANCELLED';

export interface PurchaseOrderItemProps {
	productId: string;
	quantityOrdered: number;
	quantityReceived: number;
	unitCost: number;
}

export interface PurchaseOrderProps extends DomainEntityProps {
	organizationId: string;
	supplierId: string;
	warehouseId: string;
	status: PurchaseOrderStatus;
	items: PurchaseOrderItemProps[];
	expectedDeliveryDate: Date | null;
	readonly createdAt: Date;
	readonly updatedAt: Date;
	readonly schemaVersion: string;
}

export interface PurchaseOrderEntityReference extends Readonly<Omit<PurchaseOrderProps, 'items'>> {
	readonly items: ReadonlyArray<PurchaseOrderItemProps>;
}

export class PurchaseOrder<props extends PurchaseOrderProps> extends AggregateRoot<props, Passport> implements PurchaseOrderEntityReference {
	private isNew = false;
	private readonly visa: ProcurementVisa;

	constructor(props: props, passport: Passport) {
		super(props, passport);
		this.visa = passport.procurement.forPurchaseOrder(this);
	}

	public static getNewInstance<props extends PurchaseOrderProps>(
		newProps: props,
		organizationId: string,
		supplierId: string,
		warehouseId: string,
		status: PurchaseOrderStatus,
		expectedDeliveryDate: Date | null,
		passport: Passport,
	): PurchaseOrder<props> {
		const purchaseOrder = new PurchaseOrder(newProps, passport);
		purchaseOrder.markAsNew();
		purchaseOrder.organizationId = organizationId;
		purchaseOrder.supplierId = supplierId;
		purchaseOrder.warehouseId = warehouseId;
		purchaseOrder.status = status;
		purchaseOrder.expectedDeliveryDate = expectedDeliveryDate;
		purchaseOrder.isNew = false;
		return purchaseOrder;
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
	get supplierId(): string {
		return this.props.supplierId;
	}
	set supplierId(supplierId: string) {
		this.ensureCanManage();
		this.props.supplierId = supplierId;
	}
	get warehouseId(): string {
		return this.props.warehouseId;
	}
	set warehouseId(warehouseId: string) {
		this.ensureCanManage();
		this.props.warehouseId = warehouseId;
	}
	get status(): PurchaseOrderStatus {
		return this.props.status;
	}
	set status(status: PurchaseOrderStatus) {
		this.ensureCanManage();
		this.props.status = status;
	}
	get items(): ReadonlyArray<PurchaseOrderItemProps> {
		return this.props.items;
	}
	get expectedDeliveryDate(): Date | null {
		return this.props.expectedDeliveryDate;
	}
	set expectedDeliveryDate(expectedDeliveryDate: Date | null) {
		this.ensureCanManage();
		this.props.expectedDeliveryDate = expectedDeliveryDate;
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
		if (!this.isNew && !this.visa.determineIf((permissions) => permissions.canManagePurchaseOrder)) {
			throw new PermissionError('Cannot update purchase-order: insufficient permissions');
		}
	}

}
