import type { Repository } from '@cellix/domain-seedwork/repository';
import type { Product, ProductProps } from './product.aggregate.ts';

export interface ProductRepository<props extends ProductProps> extends Repository<Product<props>> {
	getNewInstance(
		organizationId: string,
		sku: string,
		name: string,
		description: string | null,
		category: string | null,
		price: number,
		cost: number,
		unit: string,
		reorderPoint: number,
		isActive: boolean,
	): Promise<Product<props>>;
	getById(id: string): Promise<Product<props>>;
}
