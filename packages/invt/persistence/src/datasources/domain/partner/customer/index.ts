import type { Domain } from '@invt/domain';
import type { ModelsContext } from '../../../../index.ts';
import { getCustomerUnitOfWork } from './customer.uow.ts';

export const CustomerPersistence = (models: ModelsContext, passport: Domain.Passport) => ({
	CustomerUnitOfWork: getCustomerUnitOfWork(models.Customer, passport),
});
