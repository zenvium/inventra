import type { Domain } from '@invt/domain';
import type { DataSources } from '@invt/persistence';

export interface InventoryQueryByIdCommand {
	id: string;
}

export const queryById = (dataSources: DataSources) => {
	return async (command: InventoryQueryByIdCommand): Promise<Domain.Contexts.Inventory.Inventory.InventoryEntityReference | null> => {
		return await dataSources.readonlyDataSource.Inventory.Inventory.InventoryReadRepo.getById(command.id);
	};
};
