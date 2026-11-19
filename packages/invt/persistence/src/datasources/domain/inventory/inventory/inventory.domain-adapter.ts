import { MongooseSeedwork } from '@cellix/mongoose-seedwork';
import type { Inventory as InventoryDoc } from '@invt/data-sources-mongoose-models';
import { Domain } from '@invt/domain';

export class InventoryConverter extends MongooseSeedwork.MongoTypeConverter<
	InventoryDoc,
	InventoryDomainAdapter,
	Domain.Passport,
	Domain.Contexts.Inventory.Inventory.Inventory<InventoryDomainAdapter>
> {
	constructor() {
		super(InventoryDomainAdapter, Domain.Contexts.Inventory.Inventory.Inventory);
	}
}

export class InventoryDomainAdapter extends MongooseSeedwork.MongooseDomainAdapter<InventoryDoc> implements Domain.Contexts.Inventory.Inventory.InventoryProps {
	get organizationId(): string {
		return this.doc.organizationId;
	}
	set organizationId(organizationId: string) {
		this.doc.organizationId = organizationId;
	}
	get productId(): string {
		return this.doc.productId;
	}
	set productId(productId: string) {
		this.doc.productId = productId;
	}
	get warehouseId(): string {
		return this.doc.warehouseId;
	}
	set warehouseId(warehouseId: string) {
		this.doc.warehouseId = warehouseId;
	}
	get quantityOnHand(): number {
		return this.doc.quantityOnHand;
	}
	set quantityOnHand(quantityOnHand: number) {
		this.doc.quantityOnHand = quantityOnHand;
	}
	get quantityReserved(): number {
		return this.doc.quantityReserved;
	}
	set quantityReserved(quantityReserved: number) {
		this.doc.quantityReserved = quantityReserved;
	}
}
