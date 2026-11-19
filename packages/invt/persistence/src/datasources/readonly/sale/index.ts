import type { Domain } from '@invt/domain';
import type { ModelsContext } from '../../../index.ts';
import { SalesOrderReadRepositoryImpl } from './sales-order/index.ts';

export const SaleContext = (models: ModelsContext, passport: Domain.Passport) => ({
	SalesOrder: SalesOrderReadRepositoryImpl(models, passport),
});
