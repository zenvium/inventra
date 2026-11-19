import type { Repository } from '@cellix/domain-seedwork/repository';
import type { Warehouse, WarehouseProps } from './warehouse.aggregate.ts';

export interface WarehouseRepository<props extends WarehouseProps> extends Repository<Warehouse<props>> {
	getNewInstance(organizationId: string, name: string, code: string, isActive: boolean): Promise<Warehouse<props>>;
	getById(id: string): Promise<Warehouse<props>>;
}
