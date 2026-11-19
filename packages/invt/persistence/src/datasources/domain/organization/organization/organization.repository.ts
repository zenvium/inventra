import type { Organization as OrganizationDoc } from '@invt/data-sources-mongoose-models';
import { Domain } from '@invt/domain';
import { MongooseSeedwork } from '@cellix/mongoose-seedwork';
import type { OrganizationDomainAdapter } from './organization.domain-adapter.ts';

export class OrganizationRepository
		extends MongooseSeedwork.MongoRepositoryBase<
			OrganizationDoc,
			OrganizationDomainAdapter,
			Domain.Passport,
			Domain.Contexts.Organization.Organization.Organization<OrganizationDomainAdapter>
		>
	implements Domain.Contexts.Organization.Organization.OrganizationRepository<OrganizationDomainAdapter>
{
	async getById(id: string): Promise<Domain.Contexts.Organization.Organization.Organization<OrganizationDomainAdapter>> {
		const document = await this.model.findById(id).exec();
		if (!document) {
			throw new Error(`Organization with id ${id} not found`);
		}
		return this.typeConverter.toDomain(document, this.passport);
	}

	// biome-ignore lint:noRequireAwait
	async getNewInstance(name: string, slug: string): Promise<Domain.Contexts.Organization.Organization.Organization<OrganizationDomainAdapter>> {
		const adapter = this.typeConverter.toAdapter(new this.model());
		return Promise.resolve(Domain.Contexts.Organization.Organization.Organization.getNewInstance(adapter, name, slug, this.passport));
	}
}
