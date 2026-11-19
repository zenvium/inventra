import type { Repository } from '@cellix/domain-seedwork/repository';
import type { Inventory, InventoryProps } from './inventory.aggregate.ts';

export interface InventoryRepository<props extends InventoryProps> extends Repository<Inventory<props>> {
	getNewInstance(organizationId: string, productId: string, warehouseId: string, quantityOnHand: number, quantityReserved: number): Promise<Inventory<props>>;
	getById(id: string): Promise<Inventory<props>>;
}
