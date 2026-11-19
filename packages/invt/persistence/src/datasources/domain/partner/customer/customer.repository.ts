import type { Customer as CustomerDoc } from '@invt/data-sources-mongoose-models';
import { Domain } from '@invt/domain';
import { MongooseSeedwork } from '@cellix/mongoose-seedwork';
import type { CustomerDomainAdapter } from './customer.domain-adapter.ts';

export class CustomerRepository
	 extends MongooseSeedwork.MongoRepositoryBase<
		CustomerDoc,
		CustomerDomainAdapter,
		Domain.Passport,
		Domain.Contexts.Partner.Customer.Customer<CustomerDomainAdapter>
	>
	 implements Domain.Contexts.Partner.Customer.CustomerRepository<CustomerDomainAdapter>
{
	async getById(id: string): Promise<Domain.Contexts.Partner.Customer.Customer<CustomerDomainAdapter>> {
		const document = await this.model.findById(id).exec();
		if (!document) {
			throw new Error(`Customer with id ${id} not found`);
		}
		return this.typeConverter.toDomain(document, this.passport);
	}

	// biome-ignore lint: noRequireAwait
	async getNewInstance(
		organizationId: string,
		name: string,
		email: string | null,
		phone: string | null,
	): Promise<Domain.Contexts.Partner.Customer.Customer<CustomerDomainAdapter>> {
		const adapter = this.typeConverter.toAdapter(new this.model());
		return Promise.resolve(
			Domain.Contexts.Partner.Customer.Customer.getNewInstance(adapter, organizationId, name, email, phone, this.passport),
		);
	}
}
