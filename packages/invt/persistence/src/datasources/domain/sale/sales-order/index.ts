import type { Domain } from '@invt/domain';
import type { ModelsContext } from '../../../../index.ts';
import { getSalesOrderUnitOfWork } from './sales-order.uow.ts';

export const SalesOrderPersistence = (models: ModelsContext, passport: Domain.Passport) => ({
	SalesOrderUnitOfWork: getSalesOrderUnitOfWork(models.SalesOrder, passport),
});
