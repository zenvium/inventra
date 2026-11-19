import type { Repository } from '@cellix/domain-seedwork/repository';
import type { PurchaseOrder, PurchaseOrderProps, PurchaseOrderStatus } from './purchase-order.aggregate.ts';

export interface PurchaseOrderRepository<props extends PurchaseOrderProps> extends Repository<PurchaseOrder<props>> {
	getNewInstance(
		organizationId: string,
		supplierId: string,
		warehouseId: string,
		status: PurchaseOrderStatus,
		expectedDeliveryDate: Date | null,
	): Promise<PurchaseOrder<props>>;
	getById(id: string): Promise<PurchaseOrder<props>>;
}
