import { MongooseSeedwork } from '@cellix/mongoose-seedwork';
import type { StockMovement as StockMovementDoc } from '@invt/data-sources-mongoose-models';
import { Domain } from '@invt/domain';

export class StockMovementConverter extends MongooseSeedwork.MongoTypeConverter<
	StockMovementDoc,
	StockMovementDomainAdapter,
	Domain.Passport,
	Domain.Contexts.Inventory.StockMovement.StockMovement<StockMovementDomainAdapter>
> {
	constructor() {
		super(StockMovementDomainAdapter, Domain.Contexts.Inventory.StockMovement.StockMovement);
	}
}

export class StockMovementDomainAdapter extends MongooseSeedwork.MongooseDomainAdapter<StockMovementDoc> implements Domain.Contexts.Inventory.StockMovement.StockMovementProps {
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
	get type(): Domain.Contexts.Inventory.StockMovement.StockMovementType {
		return this.doc.type;
	}
	set type(type: Domain.Contexts.Inventory.StockMovement.StockMovementType) {
		this.doc.type = type;
	}
	get quantityChange(): number {
		return this.doc.quantityChange;
	}
	set quantityChange(quantityChange: number) {
		this.doc.quantityChange = quantityChange;
	}
	get referenceId(): string | null {
		return this.doc.referenceId ?? null;
	}
	set referenceId(referenceId: string | null) {
		this.doc.referenceId = referenceId;
	}
	get reason(): string | null {
		return this.doc.reason ?? null;
	}
	set reason(reason: string | null) {
		this.doc.reason = reason;
	}
	get performedBy(): string | null {
		return this.doc.performedBy ?? null;
	}
	set performedBy(performedBy: string | null) {
		this.doc.performedBy = performedBy;
	}
}
