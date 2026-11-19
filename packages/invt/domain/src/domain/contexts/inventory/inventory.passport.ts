import type { InventoryEntityReference } from './inventory/inventory.aggregate.ts';
import type { StockMovementEntityReference } from './stock-movement/stock-movement.aggregate.ts';
import type { WarehouseEntityReference } from './warehouse/warehouse.aggregate.ts';
import type { InventoryVisa } from './inventory.visa.ts';

export interface InventoryPassport {
	forInventory(root: InventoryEntityReference): InventoryVisa;
	forStockMovement(root: StockMovementEntityReference): InventoryVisa;
	forWarehouse(root: WarehouseEntityReference): InventoryVisa;
}
