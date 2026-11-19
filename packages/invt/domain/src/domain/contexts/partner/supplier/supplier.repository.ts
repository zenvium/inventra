import type { Repository } from '@cellix/domain-seedwork/repository';
import type { Supplier, SupplierProps } from './supplier.aggregate.ts';

export interface SupplierRepository<props extends SupplierProps> extends Repository<Supplier<props>> {
	getNewInstance(
		organizationId: string,
		name: string,
		contactName: string | null,
		email: string | null,
		phone: string | null,
		isActive: boolean,
	): Promise<Supplier<props>>;
	getById(id: string): Promise<Supplier<props>>;
}
