import type { Domain } from '@invt/domain';
import type { DataSources } from '@invt/persistence';
import { type StockMovementQueryByIdCommand, queryById } from './query-by-id.ts';

export interface StockMovementApplicationService {
	queryById: (command: StockMovementQueryByIdCommand) => Promise<Domain.Contexts.Inventory.StockMovement.StockMovementEntityReference | null>;
}

export const StockMovement = (dataSources: DataSources): StockMovementApplicationService => ({
	queryById: queryById(dataSources),
});
