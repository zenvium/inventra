import type { InitializedUnitOfWork, UnitOfWork } from '@cellix/domain-seedwork/unit-of-work';
import type { Passport } from '../../passport.ts';
import type { Inventory, InventoryProps } from './inventory.aggregate.ts';
import type { InventoryRepository } from './inventory.repository.ts';

export interface InventoryUnitOfWork
		 extends UnitOfWork<Passport, InventoryProps, Inventory<InventoryProps>, InventoryRepository<InventoryProps>>,
			InitializedUnitOfWork<Passport, InventoryProps, Inventory<InventoryProps>, InventoryRepository<InventoryProps>> {}
