import type { Domain } from '@invt/domain';
import type { ModelsContext } from '../../../../index.ts';
import { getSupplierUnitOfWork } from './supplier.uow.ts';

export const SupplierPersistence = (models: ModelsContext, passport: Domain.Passport) => ({
	SupplierUnitOfWork: getSupplierUnitOfWork(models.Supplier, passport),
});
