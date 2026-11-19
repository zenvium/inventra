import { InProcEventBusInstance, NodeEventBusInstance } from '@cellix/event-bus-seedwork-node';
import type { StockMovementModelType } from '@invt/data-sources-mongoose-models';
import { MongooseSeedwork } from '@cellix/mongoose-seedwork';
import type { Domain } from '@invt/domain';
import { StockMovementConverter } from './stock-movement.domain-adapter.ts';
import { StockMovementRepository } from './stock-movement.repository.ts';

export const getStockMovementUnitOfWork = (
	model: StockMovementModelType,
	passport: Domain.Passport,
): Domain.Contexts.Inventory.StockMovement.StockMovementUnitOfWork => {
	const unitOfWork = new MongooseSeedwork.MongoUnitOfWork(
		InProcEventBusInstance,
		NodeEventBusInstance,
		model,
		new StockMovementConverter(),
		StockMovementRepository,
	);
	return MongooseSeedwork.getInitializedUnitOfWork(unitOfWork, passport);
};
