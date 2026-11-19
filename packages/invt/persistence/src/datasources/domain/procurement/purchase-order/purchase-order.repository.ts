import type { PurchaseOrder as PurchaseOrderDoc } from '@invt/data-sources-mongoose-models';
import { Domain } from '@invt/domain';
import { MongooseSeedwork } from '@cellix/mongoose-seedwork';
import type { PurchaseOrderDomainAdapter } from './purchase-order.domain-adapter.ts';

export class PurchaseOrderRepository
	 extends MongooseSeedwork.MongoRepositoryBase<
		PurchaseOrderDoc,
		PurchaseOrderDomainAdapter,
		Domain.Passport,
		Domain.Contexts.Procurement.PurchaseOrder.PurchaseOrder<PurchaseOrderDomainAdapter>
	>
	implements Domain.Contexts.Procurement.PurchaseOrder.PurchaseOrderRepository<PurchaseOrderDomainAdapter>
{
	async getById(id: string): Promise<Domain.Contexts.Procurement.PurchaseOrder.PurchaseOrder<PurchaseOrderDomainAdapter>> {
		const document = await this.model.findById(id).exec();
		if (!document) throw new Error(`PurchaseOrder with id ${id} not found`);
		return this.typeConverter.toDomain(document, this.passport);
	}

	// biome-ignore lint: noRequireAwait
	async getNewInstance(
		organizationId: string,
		supplierId: string,
		warehouseId: string,
		status: Domain.Contexts.Procurement.PurchaseOrder.PurchaseOrderStatus,
		expectedDeliveryDate: Date | null,
	): Promise<Domain.Contexts.Procurement.PurchaseOrder.PurchaseOrder<PurchaseOrderDomainAdapter>> {
		const adapter = this.typeConverter.toAdapter(new this.model());
		return Promise.resolve(
			Domain.Contexts.Procurement.PurchaseOrder.PurchaseOrder.getNewInstance(adapter, organizationId, supplierId, warehouseId, status, expectedDeliveryDate, this.passport),
		);
	}
}
