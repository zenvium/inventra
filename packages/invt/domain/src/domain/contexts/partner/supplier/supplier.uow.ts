import type { InitializedUnitOfWork, UnitOfWork } from '@cellix/domain-seedwork/unit-of-work';
import type { Passport } from '../../passport.ts';
import type { Supplier, SupplierProps } from './supplier.aggregate.ts';
import type { SupplierRepository } from './supplier.repository.ts';

export interface SupplierUnitOfWork extends UnitOfWork<Passport, SupplierProps, Supplier<SupplierProps>, SupplierRepository<SupplierProps>>, InitializedUnitOfWork<Passport, SupplierProps, Supplier<SupplierProps>, SupplierRepository<SupplierProps>> {}
