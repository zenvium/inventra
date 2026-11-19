import type { Inventory as InventoryDoc } from '@invt/data-sources-mongoose-models';
import { Domain } from '@invt/domain';
import { MongooseSeedwork } from '@cellix/mongoose-seedwork';
import type { InventoryDomainAdapter } from './inventory.domain-adapter.ts';

export class InventoryRepository
		extends MongooseSeedwork.MongoRepositoryBase<
			InventoryDoc,
			InventoryDomainAdapter,
			Domain.Passport,
			Domain.Contexts.Inventory.Inventory.Inventory<InventoryDomainAdapter>
		>
	implements Domain.Contexts.Inventory.Inventory.InventoryRepository<InventoryDomainAdapter>
{
	async getById(id: string): Promise<Domain.Contexts.Inventory.Inventory.Inventory<InventoryDomainAdapter>> {
		const document = await this.model.findById(id).exec();
		if (!document) {
			throw new Error(`Inventory with id ${id} not found`);
		}
		return this.typeConverter.toDomain(document, this.passport);
	}

	// biome-ignore lint: noRequireAwait
	async getNewInstance(
		organizationId: string,
		productId: string,
		warehouseId: string,
		quantityOnHand: number,
		quantityReserved: number,
	): Promise<Domain.Contexts.Inventory.Inventory.Inventory<InventoryDomainAdapter>> {
		const adapter = this.typeConverter.toAdapter(new this.model());
		return Promise.resolve(
			Domain.Contexts.Inventory.Inventory.Inventory.getNewInstance(adapter, organizationId, productId, warehouseId, quantityOnHand, quantityReserved, this.passport),
		);
	}
}
