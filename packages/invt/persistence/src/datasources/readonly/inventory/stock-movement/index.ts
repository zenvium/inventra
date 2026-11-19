import type { Domain } from '@invt/domain';
import type { ModelsContext } from '../../../index.ts';
import { getStockMovementReadRepository } from './stock-movement.read-repository.ts';

export const StockMovementReadRepositoryImpl = (models: ModelsContext, passport: Domain.Passport) => ({
	StockMovementReadRepo: getStockMovementReadRepository(models, passport),
});
