import { MongooseSeedwork } from '@cellix/mongoose-seedwork';
import type { Organization as OrganizationDoc } from '@invt/data-sources-mongoose-models';
import { Domain } from '@invt/domain';

export class OrganizationConverter extends MongooseSeedwork.MongoTypeConverter<
	OrganizationDoc,
	OrganizationDomainAdapter,
	Domain.Passport,
	Domain.Contexts.Organization.Organization.Organization<OrganizationDomainAdapter>
> {
	constructor() {
		super(OrganizationDomainAdapter, Domain.Contexts.Organization.Organization.Organization);
	}
}

export class OrganizationDomainAdapter
		 extends MongooseSeedwork.MongooseDomainAdapter<OrganizationDoc>
	implements Domain.Contexts.Organization.Organization.OrganizationProps
{
	get name(): string {
		return this.doc.name;
	}
	set name(name: string) {
		this.doc.name = name;
	}

	get slug(): string {
		return this.doc.slug;
	}
	set slug(slug: string) {
		this.doc.slug = slug;
	}
}
