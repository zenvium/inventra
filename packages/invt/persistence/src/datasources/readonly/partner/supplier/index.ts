import type { Domain } from '@invt/domain';
import type { ModelsContext } from '../../../index.ts';
import { getSupplierReadRepository } from './supplier.read-repository.ts';

export const SupplierReadRepositoryImpl = (models: ModelsContext, passport: Domain.Passport) => ({
	SupplierReadRepo: getSupplierReadRepository(models, passport),
});
