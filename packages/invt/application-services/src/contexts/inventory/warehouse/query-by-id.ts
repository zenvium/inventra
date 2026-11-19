import type { Domain } from '@invt/domain';
import type { DataSources } from '@invt/persistence';

export interface WarehouseQueryByIdCommand {
	id: string;
}

export const queryById = (dataSources: DataSources) => {
	return async (command: WarehouseQueryByIdCommand): Promise<Domain.Contexts.Inventory.Warehouse.WarehouseEntityReference | null> => {
		return await dataSources.readonlyDataSource.Inventory.Warehouse.WarehouseReadRepo.getById(command.id);
	};
};
