import type { Domain } from '@invt/domain';
import type { ModelsContext } from '../../../index.ts';
import { getPurchaseOrderReadRepository } from './purchase-order.read-repository.ts';

export const PurchaseOrderReadRepositoryImpl = (models: ModelsContext, passport: Domain.Passport) => ({
	PurchaseOrderReadRepo: getPurchaseOrderReadRepository(models, passport),
});
