import type { DataSources } from '@invt/persistence';
import { Inventory as InventoryApi, type InventoryApplicationService } from './inventory/index.ts';
import { StockMovement as StockMovementApi, type StockMovementApplicationService } from './stock-movement/index.ts';
import { Warehouse as WarehouseApi, type WarehouseApplicationService } from './warehouse/index.ts';

export interface InventoryContextApplicationService {
	Inventory: InventoryApplicationService;
	StockMovement: StockMovementApplicationService;
	Warehouse: WarehouseApplicationService;
}

export const Inventory = (dataSources: DataSources): InventoryContextApplicationService => ({
	Inventory: InventoryApi(dataSources),
	StockMovement: StockMovementApi(dataSources),
	Warehouse: WarehouseApi(dataSources),
});
