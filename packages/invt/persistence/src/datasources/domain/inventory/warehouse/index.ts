import type { Domain } from '@invt/domain';
import type { ModelsContext } from '../../../../index.ts';
import { getWarehouseUnitOfWork } from './warehouse.uow.ts';

export const WarehousePersistence = (models: ModelsContext, passport: Domain.Passport) => ({
	WarehouseUnitOfWork: getWarehouseUnitOfWork(models.Warehouse, passport),
});
