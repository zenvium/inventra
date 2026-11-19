import type { Domain } from '@invt/domain';
import type { DataSources } from '@invt/persistence';

export interface StockMovementQueryByIdCommand {
	id: string;
}

export const queryById = (dataSources: DataSources) => {
	return async (command: StockMovementQueryByIdCommand): Promise<Domain.Contexts.Inventory.StockMovement.StockMovementEntityReference | null> => {
		return await dataSources.readonlyDataSource.Inventory.StockMovement.StockMovementReadRepo.getById(command.id);
	};
};
