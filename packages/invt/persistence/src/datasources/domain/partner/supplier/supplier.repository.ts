import type { Supplier as SupplierDoc } from '@invt/data-sources-mongoose-models';
import { Domain } from '@invt/domain';
import { MongooseSeedwork } from '@cellix/mongoose-seedwork';
import type { SupplierDomainAdapter } from './supplier.domain-adapter.ts';

export class SupplierRepository
	extends MongooseSeedwork.MongoRepositoryBase<SupplierDoc, SupplierDomainAdapter, Domain.Passport, Domain.Contexts.Partner.Supplier.Supplier<SupplierDomainAdapter>>
	implements Domain.Contexts.Partner.Supplier.SupplierRepository<SupplierDomainAdapter>
{
	async getById(id: string): Promise<Domain.Contexts.Partner.Supplier.Supplier<SupplierDomainAdapter>> {
		const document = await this.model.findById(id).exec();
		if (!document) {
			throw new Error(`Supplier with id ${id} not found`);
		}
		return this.typeConverter.toDomain(document, this.passport);
	}

	// biome-ignore lint: noRequireAwait
	async getNewInstance(
		organizationId: string,
		name: string,
		contactName: string | null,
		email: string | null,
		phone: string | null,
		isActive: boolean,
	): Promise<Domain.Contexts.Partner.Supplier.Supplier<SupplierDomainAdapter>> {
		const adapter = this.typeConverter.toAdapter(new this.model());
		return Promise.resolve(
			Domain.Contexts.Partner.Supplier.Supplier.getNewInstance(adapter, organizationId, name, contactName, email, phone, isActive, this.passport),
		);
	}
}
