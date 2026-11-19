import { InProcEventBusInstance, NodeEventBusInstance } from '@cellix/event-bus-seedwork-node';
import type { PurchaseOrderModelType } from '@invt/data-sources-mongoose-models';
import { MongooseSeedwork } from '@cellix/mongoose-seedwork';
import type { Domain } from '@invt/domain';
import { PurchaseOrderConverter } from './purchase-order.domain-adapter.ts';
import { PurchaseOrderRepository } from './purchase-order.repository.ts';

export const getPurchaseOrderUnitOfWork = (model: PurchaseOrderModelType, passport: Domain.Passport): Domain.Contexts.Procurement.PurchaseOrder.PurchaseOrderUnitOfWork => {
	const unitOfWork = new MongooseSeedwork.MongoUnitOfWork(InProcEventBusInstance, NodeEventBusInstance, model, new PurchaseOrderConverter(), PurchaseOrderRepository);
	return MongooseSeedwork.getInitializedUnitOfWork(unitOfWork, passport);
};
