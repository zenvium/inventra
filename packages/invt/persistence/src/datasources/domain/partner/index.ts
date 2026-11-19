import type { Domain } from '@invt/domain';
import type { ModelsContext } from '../../../index.ts';
import * as Customer from './customer/index.ts';
import * as Supplier from './supplier/index.ts';

export const PartnerContextPersistence = (models: ModelsContext, passport: Domain.Passport) => ({
	Customer: Customer.CustomerPersistence(models, passport),
	Supplier: Supplier.SupplierPersistence(models, passport),
});
