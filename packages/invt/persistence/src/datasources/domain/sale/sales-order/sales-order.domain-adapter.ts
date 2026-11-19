import { MongooseSeedwork } from '@cellix/mongoose-seedwork';
import type { SalesOrder as SalesOrderDoc } from '@invt/data-sources-mongoose-models';
import { Domain } from '@invt/domain';

export class SalesOrderConverter extends MongooseSeedwork.MongoTypeConverter<
	SalesOrderDoc,
	SalesOrderDomainAdapter,
	Domain.Passport,
	Domain.Contexts.Sale.SalesOrder.SalesOrder<SalesOrderDomainAdapter>
> {
	constructor() {
		super(SalesOrderDomainAdapter, Domain.Contexts.Sale.SalesOrder.SalesOrder);
	}
}

export class SalesOrderDomainAdapter extends MongooseSeedwork.MongooseDomainAdapter<SalesOrderDoc> implements Domain.Contexts.Sale.SalesOrder.SalesOrderProps {
	get organizationId(): string {
		return this.doc.organizationId;
	}
	set organizationId(organizationId: string) {
		this.doc.organizationId = organizationId;
	}
	get customerId(): string {
		return this.doc.customerId;
	}
	set customerId(customerId: string) {
		this.doc.customerId = customerId;
	}
	get status(): Domain.Contexts.Sale.SalesOrder.SalesOrderStatus {
		return this.doc.status;
	}
	set status(status: Domain.Contexts.Sale.SalesOrder.SalesOrderStatus) {
		this.doc.status = status;
	}
	get items(): Domain.Contexts.Sale.SalesOrder.SalesOrderItemProps[] {
		return this.doc.items;
	}
	set items(items: Domain.Contexts.Sale.SalesOrder.SalesOrderItemProps[]) {
		this.doc.items = items;
	}
}
