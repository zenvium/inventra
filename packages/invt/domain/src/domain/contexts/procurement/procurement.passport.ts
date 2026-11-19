import type { PurchaseOrderEntityReference } from './purchase-order/purchase-order.aggregate.ts';
import type { ProcurementVisa } from './procurement.visa.ts';

export interface ProcurementPassport {
	forPurchaseOrder(root: PurchaseOrderEntityReference): ProcurementVisa;
}
