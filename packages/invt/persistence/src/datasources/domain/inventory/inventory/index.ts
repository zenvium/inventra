import type { Domain } from '@invt/domain';
import type { ModelsContext } from '../../../../index.ts';
import { getInventoryUnitOfWork } from './inventory.uow.ts';

export const InventoryPersistence = (models: ModelsContext, passport: Domain.Passport) => ({
	InventoryUnitOfWork: getInventoryUnitOfWork(models.Inventory, passport),
});
