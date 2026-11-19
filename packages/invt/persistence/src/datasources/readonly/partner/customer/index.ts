import type { Domain } from '@invt/domain';
import type { ModelsContext } from '../../../index.ts';
import { getCustomerReadRepository } from './customer.read-repository.ts';

export const CustomerReadRepositoryImpl = (models: ModelsContext, passport: Domain.Passport) => ({
	CustomerReadRepo: getCustomerReadRepository(models, passport),
});
