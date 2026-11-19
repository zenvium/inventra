import type { Domain } from '@invt/domain';
import type { ModelsContext } from '../../../index.ts';
import { PurchaseOrderReadRepositoryImpl } from './purchase-order/index.ts';

export const ProcurementContext = (models: ModelsContext, passport: Domain.Passport) => ({
	PurchaseOrder: PurchaseOrderReadRepositoryImpl(models, passport),
});
