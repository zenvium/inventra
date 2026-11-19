import type { Domain } from '@invt/domain';
import type { DataSources } from '@invt/persistence';
import { type WarehouseQueryByIdCommand, queryById } from './query-by-id.ts';

export interface WarehouseApplicationService {
	queryById: (command: WarehouseQueryByIdCommand) => Promise<Domain.Contexts.Inventory.Warehouse.WarehouseEntityReference | null>;
}

export const Warehouse = (dataSources: DataSources): WarehouseApplicationService => ({
	queryById: queryById(dataSources),
});
