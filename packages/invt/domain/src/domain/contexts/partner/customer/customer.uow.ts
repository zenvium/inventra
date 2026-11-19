import type { InitializedUnitOfWork, UnitOfWork } from '@cellix/domain-seedwork/unit-of-work';
import type { Passport } from '../../passport.ts';
import type { Customer, CustomerProps } from './customer.aggregate.ts';
import type { CustomerRepository } from './customer.repository.ts';

export interface CustomerUnitOfWork
	 extends UnitOfWork<Passport, CustomerProps, Customer<CustomerProps>, CustomerRepository<CustomerProps>>,
		InitializedUnitOfWork<Passport, CustomerProps, Customer<CustomerProps>, CustomerRepository<CustomerProps>> {}
