import type { Domain } from '@invt/domain';
import type { ModelsContext } from '../../../../index.ts';
import { getStockMovementUnitOfWork } from './stock-movement.uow.ts';

export const StockMovementPersistence = (models: ModelsContext, passport: Domain.Passport) => ({
	StockMovementUnitOfWork: getStockMovementUnitOfWork(models.StockMovement, passport),
});
