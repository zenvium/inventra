import type { InitializedUnitOfWork, UnitOfWork } from '@cellix/domain-seedwork/unit-of-work';
import type { Passport } from '../../passport.ts';
import type { PurchaseOrder, PurchaseOrderProps } from './purchase-order.aggregate.ts';
import type { PurchaseOrderRepository } from './purchase-order.repository.ts';

export interface PurchaseOrderUnitOfWork
	 extends UnitOfWork<Passport, PurchaseOrderProps, PurchaseOrder<PurchaseOrderProps>, PurchaseOrderRepository<PurchaseOrderProps>>,
		InitializedUnitOfWork<Passport, PurchaseOrderProps, PurchaseOrder<PurchaseOrderProps>, PurchaseOrderRepository<PurchaseOrderProps>> {}
