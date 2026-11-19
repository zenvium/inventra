import type { InitializedUnitOfWork, UnitOfWork } from '@cellix/domain-seedwork/unit-of-work';
import type { Passport } from '../../passport.ts';
import type { Warehouse, WarehouseProps } from './warehouse.aggregate.ts';
import type { WarehouseRepository } from './warehouse.repository.ts';

export interface WarehouseUnitOfWork
	 extends UnitOfWork<Passport, WarehouseProps, Warehouse<WarehouseProps>, WarehouseRepository<WarehouseProps>>,
		InitializedUnitOfWork<Passport, WarehouseProps, Warehouse<WarehouseProps>, WarehouseRepository<WarehouseProps>> {}
