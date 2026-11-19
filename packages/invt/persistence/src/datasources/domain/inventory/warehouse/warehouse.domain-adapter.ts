import { MongooseSeedwork } from '@cellix/mongoose-seedwork';
import type { WarehouseAddressDoc as AddressDoc, Warehouse as WarehouseDoc } from '@invt/data-sources-mongoose-models';
import { Domain } from '@invt/domain';

class AddressDomainAdapter implements Domain.Contexts.Inventory.Warehouse.AddressProps {
	readonly doc: AddressDoc;
	constructor(doc: AddressDoc) {
		this.doc = doc;
	}
	get street(): string {
		return this.doc.street;
	}
	set street(street: string) {
		this.doc.street = street;
	}
	get city(): string {
		return this.doc.city;
	}
	set city(city: string) {
		this.doc.city = city;
	}
	get state(): string | null {
		return this.doc.state ?? null;
	}
	set state(state: string | null) {
		this.doc.state = state;
	}
	get postalCode(): string {
		return this.doc.postalCode;
	}
	set postalCode(postalCode: string) {
		this.doc.postalCode = postalCode;
	}
	get country(): string {
		return this.doc.country;
	}
	set country(country: string) {
		this.doc.country = country;
	}
}

export class WarehouseConverter extends MongooseSeedwork.MongoTypeConverter<
	WarehouseDoc,
	WarehouseDomainAdapter,
	Domain.Passport,
	Domain.Contexts.Inventory.Warehouse.Warehouse<WarehouseDomainAdapter>
> {
	constructor() {
		super(WarehouseDomainAdapter, Domain.Contexts.Inventory.Warehouse.Warehouse);
	}
}

export class WarehouseDomainAdapter extends MongooseSeedwork.MongooseDomainAdapter<WarehouseDoc> implements Domain.Contexts.Inventory.Warehouse.WarehouseProps {
	get organizationId(): string {
		return this.doc.organizationId;
	}
	set organizationId(organizationId: string) {
		this.doc.organizationId = organizationId;
	}
	get name(): string {
		return this.doc.name;
	}
	set name(name: string) {
		this.doc.name = name;
	}
	get code(): string {
		return this.doc.code;
	}
	set code(code: string) {
		this.doc.code = code;
	}
	get address(): Domain.Contexts.Inventory.Warehouse.AddressProps | null {
		return this.doc.address ? new AddressDomainAdapter(this.doc.address) : null;
	}
	set address(address: Domain.Contexts.Inventory.Warehouse.AddressProps | null) {
		this.doc.address = address as AddressDoc | null;
	}
	get isActive(): boolean {
		return this.doc.isActive;
	}
	set isActive(isActive: boolean) {
		this.doc.isActive = isActive;
	}
}
