import type { SalesOrderEntityReference } from './sales-order/sales-order.aggregate.ts';
import type { SaleVisa } from './sale.visa.ts';

export interface SalePassport {
	forSalesOrder(root: SalesOrderEntityReference): SaleVisa;
}
