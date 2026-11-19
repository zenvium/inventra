import type { Repository } from '@cellix/domain-seedwork/repository';
import type { StockMovement, StockMovementProps, StockMovementType } from './stock-movement.aggregate.ts';

export interface StockMovementRepository<props extends StockMovementProps> extends Repository<StockMovement<props>> {
	getNewInstance(
		organizationId: string,
		productId: string,
		warehouseId: string,
		type: StockMovementType,
		quantityChange: number,
		referenceId: string | null,
		reason: string | null,
		performedBy: string | null,
	): Promise<StockMovement<props>>;
	getById(id: string): Promise<StockMovement<props>>;
}
