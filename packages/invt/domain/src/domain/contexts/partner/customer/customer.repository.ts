import type { Repository } from '@cellix/domain-seedwork/repository';
import type { Customer, CustomerProps } from './customer.aggregate.ts';

export interface CustomerRepository<props extends CustomerProps> extends Repository<Customer<props>> {
	getNewInstance(organizationId: string, name: string, email: string | null, phone: string | null): Promise<Customer<props>>;
	getById(id: string): Promise<Customer<props>>;
}
