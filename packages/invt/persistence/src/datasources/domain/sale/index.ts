import type { Domain } from '@invt/domain';
import type { ModelsContext } from '../../../index.ts';
import * as SalesOrder from './sales-order/index.ts';

export const SaleContextPersistence = (models: ModelsContext, passport: Domain.Passport) => ({
	SalesOrder: SalesOrder.SalesOrderPersistence(models, passport),
});
