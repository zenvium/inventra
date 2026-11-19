import type { StockMovement as StockMovementDoc } from '@invt/data-sources-mongoose-models';
import { Domain } from '@invt/domain';
import { MongooseSeedwork } from '@cellix/mongoose-seedwork';
import type { StockMovementDomainAdapter } from './stock-movement.domain-adapter.ts';

export class StockMovementRepository
	extends MongooseSeedwork.MongoRepositoryBase<
	StockMovementDoc,
	StockMovementDomainAdapter,
	Domain.Passport,
	Domain.Contexts.Inventory.StockMovement.StockMovement<StockMovementDomainAdapter>
>
	implements Domain.Contexts.Inventory.StockMovement.StockMovementRepository<StockMovementDomainAdapter>
{
	async getById(id: string): Promise<Domain.Contexts.Inventory.StockMovement.StockMovement<StockMovementDomainAdapter>> {
		const document = await this.model.findById(id).exec();
		if (!document) {
			throw new Error(`StockMovement with id ${id} not found`);
		}
		return this.typeConverter.toDomain(document, this.passport);
	}

	// biome-ignore lint: noRequireAwait
	async getNewInstance(
		organizationId: string,
		productId: string,
		warehouseId: string,
		type: Domain.Contexts.Inventory.StockMovement.StockMovementType,
		quantityChange: number,
		referenceId: string | null,
		reason: string | null,
		performedBy: string | null,
	): Promise<Domain.Contexts.Inventory.StockMovement.StockMovement<StockMovementDomainAdapter>> {
		const adapter = this.typeConverter.toAdapter(new this.model());
		return Promise.resolve(
			Domain.Contexts.Inventory.StockMovement.StockMovement.getNewInstance(
				adapter,
				organizationId,
				productId,
				warehouseId,
				type,
				quantityChange,
				referenceId,
				reason,
				performedBy,
				this.passport,
			),
		);
	}
}
