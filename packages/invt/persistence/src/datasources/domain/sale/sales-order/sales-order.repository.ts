import type { SalesOrder as SalesOrderDoc } from '@invt/data-sources-mongoose-models';
import { Domain } from '@invt/domain';
import { MongooseSeedwork } from '@cellix/mongoose-seedwork';
import type { SalesOrderDomainAdapter } from './sales-order.domain-adapter.ts';

export class SalesOrderRepository
	 extends MongooseSeedwork.MongoRepositoryBase<
		SalesOrderDoc,
		SalesOrderDomainAdapter,
		Domain.Passport,
		Domain.Contexts.Sale.SalesOrder.SalesOrder<SalesOrderDomainAdapter>
	 >
	 implements Domain.Contexts.Sale.SalesOrder.SalesOrderRepository<SalesOrderDomainAdapter>
{
	async getById(id: string): Promise<Domain.Contexts.Sale.SalesOrder.SalesOrder<SalesOrderDomainAdapter>> {
		const document = await this.model.findById(id).exec();
		if (!document) throw new Error(`SalesOrder with id ${id} not found`);
		return this.typeConverter.toDomain(document, this.passport);
	}

	// biome-ignore lint:noRequireAwait
	async getNewInstance(
		organizationId: string,
		customerId: string,
		status: Domain.Contexts.Sale.SalesOrder.SalesOrderStatus,
	): Promise<Domain.Contexts.Sale.SalesOrder.SalesOrder<SalesOrderDomainAdapter>> {
		const adapter = this.typeConverter.toAdapter(new this.model());
		return Promise.resolve(Domain.Contexts.Sale.SalesOrder.SalesOrder.getNewInstance(adapter, organizationId, customerId, status, this.passport));
	}
}
