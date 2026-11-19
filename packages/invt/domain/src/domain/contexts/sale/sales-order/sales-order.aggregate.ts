import { AggregateRoot } from '@cellix/domain-seedwork/aggregate-root';
import { PermissionError } from '@cellix/domain-seedwork/domain-entity';
import type { DomainEntityProps } from '@cellix/domain-seedwork/domain-entity';
import type { Passport } from '../../passport.ts';
import type { SaleVisa } from '../sale.visa.ts';

export type SalesOrderStatus = 'DRAFT' | 'CONFIRMED' | 'FULFILLED' | 'CANCELLED';

export interface SalesOrderItemProps {
	productId: string;
	warehouseId: string;
	quantity: number;
	unitPrice: number;
}

export interface SalesOrderProps extends DomainEntityProps {
	organizationId: string;
	customerId: string;
	status: SalesOrderStatus;
	items: SalesOrderItemProps[];
	readonly createdAt: Date;
	readonly updatedAt: Date;
	readonly schemaVersion: string;
}

export interface SalesOrderEntityReference extends Readonly<Omit<SalesOrderProps, 'items'>> {
	readonly items: ReadonlyArray<SalesOrderItemProps>;
}

export class SalesOrder<props extends SalesOrderProps> extends AggregateRoot<props, Passport> implements SalesOrderEntityReference {
	private isNew = false;
	private readonly visa: SaleVisa;

	constructor(props: props, passport: Passport) {
		super(props, passport);
		this.visa = passport.sale.forSalesOrder(this);
	}

	public static getNewInstance<props extends SalesOrderProps>(newProps: props, organizationId: string, customerId: string, status: SalesOrderStatus, passport: Passport): SalesOrder<props> {
		const salesOrder = new SalesOrder(newProps, passport);
		salesOrder.markAsNew();
		salesOrder.organizationId = organizationId;
		salesOrder.customerId = customerId;
		salesOrder.status = status;
		salesOrder.isNew = false;
		return salesOrder;
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
	get customerId(): string {
		return this.props.customerId;
	}
	set customerId(customerId: string) {
		this.ensureCanManage();
		this.props.customerId = customerId;
	}
	get status(): SalesOrderStatus {
		return this.props.status;
	}
	set status(status: SalesOrderStatus) {
		this.ensureCanManage();
		this.props.status = status;
	}
	get items(): ReadonlyArray<SalesOrderItemProps> {
		return this.props.items;
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
		if (!this.isNew && !this.visa.determineIf((permissions) => permissions.canManageSalesOrder)) {
			throw new PermissionError('Cannot update sales-order: insufficient permissions');
		}
	}

}
