import { MongooseSeedwork } from '@cellix/mongoose-seedwork';
import type { CustomerAddressDoc as AddressDoc, Customer as CustomerDoc } from '@invt/data-sources-mongoose-models';
import { Domain } from '@invt/domain';

class AddressDomainAdapter implements Domain.Contexts.Partner.Customer.AddressProps {
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
		return this.doc.state;
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

export class CustomerConverter extends MongooseSeedwork.MongoTypeConverter<
	CustomerDoc,
	CustomerDomainAdapter,
	Domain.Passport,
	Domain.Contexts.Partner.Customer.Customer<CustomerDomainAdapter>
> {
	constructor() {
		super(CustomerDomainAdapter, Domain.Contexts.Partner.Customer.Customer);
	}
}

export class CustomerDomainAdapter extends MongooseSeedwork.MongooseDomainAdapter<CustomerDoc> implements Domain.Contexts.Partner.Customer.CustomerProps {
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

	get email(): string | null {
		return this.doc.email ?? null;
	}
	set email(email: string | null) {
		this.doc.email = email;
	}

	get phone(): string | null {
		return this.doc.phone ?? null;
	}
	set phone(phone: string | null) {
		this.doc.phone = phone;
	}

	get address(): Domain.Contexts.Partner.Customer.AddressProps | null {
		return this.doc.address ? new AddressDomainAdapter(this.doc.address) : null;
	}
	set address(address: Domain.Contexts.Partner.Customer.AddressProps | null) {
		this.doc.set('address', address);
	}
}
