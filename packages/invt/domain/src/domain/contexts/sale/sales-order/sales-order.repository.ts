import type { Repository } from '@cellix/domain-seedwork/repository';
import type { SalesOrder, SalesOrderProps, SalesOrderStatus } from './sales-order.aggregate.ts';

export interface SalesOrderRepository<props extends SalesOrderProps> extends Repository<SalesOrder<props>> {
	getNewInstance(organizationId: string, customerId: string, status: SalesOrderStatus): Promise<SalesOrder<props>>;
	getById(id: string): Promise<SalesOrder<props>>;
}
