import type { Domain } from '@invt/domain';
import type { ModelsContext } from '../../../index.ts';
import * as Inventory from './inventory/index.ts';
import * as StockMovement from './stock-movement/index.ts';
import * as Warehouse from './warehouse/index.ts';

export const InventoryContextPersistence = (models: ModelsContext, passport: Domain.Passport) => ({
	Inventory: Inventory.InventoryPersistence(models, passport),
	StockMovement: StockMovement.StockMovementPersistence(models, passport),
	Warehouse: Warehouse.WarehousePersistence(models, passport),
});
