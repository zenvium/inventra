import type { Domain } from '@invt/domain';
import type { ModelsContext } from '../../../index.ts';
import { InventoryReadRepositoryImpl } from './inventory/index.ts';
import { StockMovementReadRepositoryImpl } from './stock-movement/index.ts';
import { WarehouseReadRepositoryImpl } from './warehouse/index.ts';

export const InventoryContext = (models: ModelsContext, passport: Domain.Passport) => ({
	Inventory: InventoryReadRepositoryImpl(models, passport),
	StockMovement: StockMovementReadRepositoryImpl(models, passport),
	Warehouse: WarehouseReadRepositoryImpl(models, passport),
});
