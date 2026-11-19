import type { Domain } from '@invt/domain';
import type { ModelsContext } from '../../../index.ts';
import * as PurchaseOrder from './purchase-order/index.ts';

export const ProcurementContextPersistence = (models: ModelsContext, passport: Domain.Passport) => ({
	PurchaseOrder: PurchaseOrder.PurchaseOrderPersistence(models, passport),
});
