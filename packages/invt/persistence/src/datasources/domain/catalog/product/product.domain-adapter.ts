import { MongooseSeedwork } from '@cellix/mongoose-seedwork';
import type { Product as ProductDoc } from '@invt/data-sources-mongoose-models';
import { Domain } from '@invt/domain';

export class ProductConverter extends MongooseSeedwork.MongoTypeConverter<
	ProductDoc,
	ProductDomainAdapter,
	Domain.Passport,
	Domain.Contexts.Catalog.Product.Product<ProductDomainAdapter>
> {
	constructor() {
		super(ProductDomainAdapter, Domain.Contexts.Catalog.Product.Product);
	}
}

export class ProductDomainAdapter extends MongooseSeedwork.MongooseDomainAdapter<ProductDoc> implements Domain.Contexts.Catalog.Product.ProductProps {
	get organizationId(): string {
		return this.doc.organizationId;
	}
	set organizationId(organizationId: string) {
		this.doc.organizationId = organizationId;
	}
	get sku(): string {
		return this.doc.sku;
	}
	set sku(sku: string) {
		this.doc.sku = sku;
	}
	get name(): string {
		return this.doc.name;
	}
	set name(name: string) {
		this.doc.name = name;
	}
	get description(): string | null {
		return this.doc.description ?? null;
	}
	set description(description: string | null) {
		this.doc.description = description;
	}
	get category(): string | null {
		return this.doc.category ?? null;
	}
	set category(category: string | null) {
		this.doc.category = category;
	}
	get price(): number {
		return this.doc.price;
	}
	set price(price: number) {
		this.doc.price = price;
	}
	get cost(): number {
		return this.doc.cost;
	}
	set cost(cost: number) {
		this.doc.cost = cost;
	}
	get unit(): string {
		return this.doc.unit;
	}
	set unit(unit: string) {
		this.doc.unit = unit;
	}
	get reorderPoint(): number {
		return this.doc.reorderPoint;
	}
	set reorderPoint(reorderPoint: number) {
		this.doc.reorderPoint = reorderPoint;
	}
	get isActive(): boolean {
		return this.doc.isActive;
	}
	set isActive(isActive: boolean) {
		this.doc.isActive = isActive;
	}
}
