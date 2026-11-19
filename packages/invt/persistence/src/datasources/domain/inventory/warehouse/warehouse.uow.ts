import { InProcEventBusInstance, NodeEventBusInstance } from '@cellix/event-bus-seedwork-node';
import type { WarehouseModelType } from '@invt/data-sources-mongoose-models';
import { MongooseSeedwork } from '@cellix/mongoose-seedwork';
import type { Domain } from '@invt/domain';
import { WarehouseConverter } from './warehouse.domain-adapter.ts';
import { WarehouseRepository } from './warehouse.repository.ts';

export const getWarehouseUnitOfWork = (model: WarehouseModelType, passport: Domain.Passport): Domain.Contexts.Inventory.Warehouse.WarehouseUnitOfWork => {
	const unitOfWork = new MongooseSeedwork.MongoUnitOfWork(InProcEventBusInstance, NodeEventBusInstance, model, new WarehouseConverter(), WarehouseRepository);
	return MongooseSeedwork.getInitializedUnitOfWork(unitOfWork, passport);
};
