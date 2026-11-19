import type { Domain } from '@invt/domain';
import type { ModelsContext } from '../../../index.ts';
import { getWarehouseReadRepository } from './warehouse.read-repository.ts';

export const WarehouseReadRepositoryImpl = (models: ModelsContext, passport: Domain.Passport) => ({
	WarehouseReadRepo: getWarehouseReadRepository(models, passport),
});
