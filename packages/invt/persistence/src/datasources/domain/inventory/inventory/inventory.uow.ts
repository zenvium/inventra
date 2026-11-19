import { InProcEventBusInstance, NodeEventBusInstance } from '@cellix/event-bus-seedwork-node';
import type { InventoryModelType } from '@invt/data-sources-mongoose-models';
import { MongooseSeedwork } from '@cellix/mongoose-seedwork';
import type { Domain } from '@invt/domain';
import { InventoryConverter } from './inventory.domain-adapter.ts';
import { InventoryRepository } from './inventory.repository.ts';

export const getInventoryUnitOfWork = (model: InventoryModelType, passport: Domain.Passport): Domain.Contexts.Inventory.Inventory.InventoryUnitOfWork => {
	const unitOfWork = new MongooseSeedwork.MongoUnitOfWork(InProcEventBusInstance, NodeEventBusInstance, model, new InventoryConverter(), InventoryRepository);
	return MongooseSeedwork.getInitializedUnitOfWork(unitOfWork, passport);
};
