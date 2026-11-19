import type { InitializedUnitOfWork, UnitOfWork } from '@cellix/domain-seedwork/unit-of-work';
import type { Passport } from '../../passport.ts';
import type { SalesOrder, SalesOrderProps } from './sales-order.aggregate.ts';
import type { SalesOrderRepository } from './sales-order.repository.ts';

export interface SalesOrderUnitOfWork
	 extends UnitOfWork<Passport, SalesOrderProps, SalesOrder<SalesOrderProps>, SalesOrderRepository<SalesOrderProps>>,
		InitializedUnitOfWork<Passport, SalesOrderProps, SalesOrder<SalesOrderProps>, SalesOrderRepository<SalesOrderProps>> {}
