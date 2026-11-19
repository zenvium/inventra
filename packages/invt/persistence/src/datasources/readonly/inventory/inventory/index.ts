import type { Domain } from '@invt/domain';
import type { ModelsContext } from '../../../index.ts';
import { getInventoryReadRepository } from './inventory.read-repository.ts';

export const InventoryReadRepositoryImpl = (models: ModelsContext, passport: Domain.Passport) => ({
	InventoryReadRepo: getInventoryReadRepository(models, passport),
});
