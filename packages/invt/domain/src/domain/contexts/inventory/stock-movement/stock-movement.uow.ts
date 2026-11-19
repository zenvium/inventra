import type { InitializedUnitOfWork, UnitOfWork } from '@cellix/domain-seedwork/unit-of-work';
import type { Passport } from '../../passport.ts';
import type { StockMovement, StockMovementProps } from './stock-movement.aggregate.ts';
import type { StockMovementRepository } from './stock-movement.repository.ts';

export interface StockMovementUnitOfWork
	extends UnitOfWork<Passport, StockMovementProps, StockMovement<StockMovementProps>, StockMovementRepository<StockMovementProps>>,
		InitializedUnitOfWork<Passport, StockMovementProps, StockMovement<StockMovementProps>, StockMovementRepository<StockMovementProps>> {}
