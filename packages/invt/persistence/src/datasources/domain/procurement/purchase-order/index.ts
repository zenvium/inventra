import type { Domain } from '@invt/domain';
import type { ModelsContext } from '../../../../index.ts';
import { getPurchaseOrderUnitOfWork } from './purchase-order.uow.ts';

export const PurchaseOrderPersistence = (models: ModelsContext, passport: Domain.Passport) => ({
	PurchaseOrderUnitOfWork: getPurchaseOrderUnitOfWork(models.PurchaseOrder, passport),
});
