import { InProcEventBusInstance, NodeEventBusInstance } from '@cellix/event-bus-seedwork-node';
import type { SalesOrderModelType } from '@invt/data-sources-mongoose-models';
import { MongooseSeedwork } from '@cellix/mongoose-seedwork';
import type { Domain } from '@invt/domain';
import { SalesOrderConverter } from './sales-order.domain-adapter.ts';
import { SalesOrderRepository } from './sales-order.repository.ts';

export const getSalesOrderUnitOfWork = (model: SalesOrderModelType, passport: Domain.Passport): Domain.Contexts.Sale.SalesOrder.SalesOrderUnitOfWork => {
	const unitOfWork = new MongooseSeedwork.MongoUnitOfWork(InProcEventBusInstance, NodeEventBusInstance, model, new SalesOrderConverter(), SalesOrderRepository);
	return MongooseSeedwork.getInitializedUnitOfWork(unitOfWork, passport);
};
