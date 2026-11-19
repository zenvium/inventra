import type { Domain } from '@invt/domain';
import type { DataSources } from '@invt/persistence';
import { type InventoryQueryByIdCommand, queryById } from './query-by-id.ts';

export interface InventoryApplicationService {
	queryById: (command: InventoryQueryByIdCommand) => Promise<Domain.Contexts.Inventory.Inventory.InventoryEntityReference | null>;
}

export const Inventory = (dataSources: DataSources): InventoryApplicationService => ({
	queryById: queryById(dataSources),
});
