import { MongooseSeedwork } from '@cellix/mongoose-seedwork';
import type { PurchaseOrder as PurchaseOrderDoc } from '@invt/data-sources-mongoose-models';
import { Domain } from '@invt/domain';

export class PurchaseOrderConverter extends MongooseSeedwork.MongoTypeConverter<
	PurchaseOrderDoc,
	PurchaseOrderDomainAdapter,
	Domain.Passport,
	Domain.Contexts.Procurement.PurchaseOrder.PurchaseOrder<PurchaseOrderDomainAdapter>
> {
	constructor() {
		super(PurchaseOrderDomainAdapter, Domain.Contexts.Procurement.PurchaseOrder.PurchaseOrder);
	}
}

export class PurchaseOrderDomainAdapter extends MongooseSeedwork.MongooseDomainAdapter<PurchaseOrderDoc> implements Domain.Contexts.Procurement.PurchaseOrder.PurchaseOrderProps {
	get organizationId(): string {
		return this.doc.organizationId;
	}
	set organizationId(organizationId: string) {
		this.doc.organizationId = organizationId;
	}
	get supplierId(): string {
		return this.doc.supplierId;
	}
	set supplierId(supplierId: string) {
		this.doc.supplierId = supplierId;
	}
	get warehouseId(): string {
		return this.doc.warehouseId;
	}
	set warehouseId(warehouseId: string) {
		this.doc.warehouseId = warehouseId;
	}
	get status(): Domain.Contexts.Procurement.PurchaseOrder.PurchaseOrderStatus {
		return this.doc.status;
	}
	set status(status: Domain.Contexts.Procurement.PurchaseOrder.PurchaseOrderStatus) {
		this.doc.status = status;
	}
	get items(): Domain.Contexts.Procurement.PurchaseOrder.PurchaseOrderItemProps[] {
		return this.doc.items;
	}
	set items(items: Domain.Contexts.Procurement.PurchaseOrder.PurchaseOrderItemProps[]) {
		this.doc.items = items;
	}
	get expectedDeliveryDate(): Date | null {
		return this.doc.expectedDeliveryDate ?? null;
	}
	set expectedDeliveryDate(expectedDeliveryDate: Date | null) {
		this.doc.expectedDeliveryDate = expectedDeliveryDate;
	}
}
