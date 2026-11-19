import type { Domain } from '@invt/domain';
import type { ModelsContext } from '../../../index.ts';
import { CustomerReadRepositoryImpl } from './customer/index.ts';
import { SupplierReadRepositoryImpl } from './supplier/index.ts';

export const PartnerContext = (models: ModelsContext, passport: Domain.Passport) => ({
	Customer: CustomerReadRepositoryImpl(models, passport),
	Supplier: SupplierReadRepositoryImpl(models, passport),
});
