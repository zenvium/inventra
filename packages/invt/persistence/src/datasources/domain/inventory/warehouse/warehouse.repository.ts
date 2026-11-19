import type { Warehouse as WarehouseDoc } from '@invt/data-sources-mongoose-models';
import { Domain } from '@invt/domain';
import { MongooseSeedwork } from '@cellix/mongoose-seedwork';
import type { WarehouseDomainAdapter } from './warehouse.domain-adapter.ts';

export class WarehouseRepository
	extends MongooseSeedwork.MongoRepositoryBase<
		WarehouseDoc,
		WarehouseDomainAdapter,
		Domain.Passport,
		Domain.Contexts.Inventory.Warehouse.Warehouse<WarehouseDomainAdapter>
	>
	implements Domain.Contexts.Inventory.Warehouse.WarehouseRepository<WarehouseDomainAdapter>
{
	async getById(id: string): Promise<Domain.Contexts.Inventory.Warehouse.Warehouse<WarehouseDomainAdapter>> {
		const document = await this.model.findById(id).exec();
		if (!document) {
			throw new Error(`Warehouse with id ${id} not found`);
		}
		return this.typeConverter.toDomain(document, this.passport);
	}

	// biome-ignore lint: noRequireAwait
	async getNewInstance(
		organizationId: string,
		name: string,
		code: string,
		isActive: boolean,
	): Promise<Domain.Contexts.Inventory.Warehouse.Warehouse<WarehouseDomainAdapter>> {
		const adapter = this.typeConverter.toAdapter(new this.model());
		return Promise.resolve(Domain.Contexts.Inventory.Warehouse.Warehouse.getNewInstance(adapter, organizationId, name, code, isActive, this.passport));
	}
}
