import type { Domain } from '@invt/domain';
import type { ModelsContext } from '../../../index.ts';
import { getSalesOrderReadRepository } from './sales-order.read-repository.ts';

export const SalesOrderReadRepositoryImpl = (models: ModelsContext, passport: Domain.Passport) => ({
	SalesOrderReadRepo: getSalesOrderReadRepository(models, passport),
});
