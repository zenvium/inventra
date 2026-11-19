import type { Product as ProductDoc } from '@invt/data-sources-mongoose-models';
import { Domain } from '@invt/domain';
import { MongooseSeedwork } from '@cellix/mongoose-seedwork';
import type { ProductDomainAdapter } from './product.domain-adapter.ts';

export class ProductRepository
	extends MongooseSeedwork.MongoRepositoryBase<
		ProductDoc,
		ProductDomainAdapter,
		Domain.Passport,
		Domain.Contexts.Catalog.Product.Product<ProductDomainAdapter>
	>
	implements Domain.Contexts.Catalog.Product.ProductRepository<ProductDomainAdapter>
{
	async getById(id: string): Promise<Domain.Contexts.Catalog.Product.Product<ProductDomainAdapter>> {
		const document = await this.model.findById(id).exec();
		if (!document) {
			throw new Error(`Product with id ${id} not found`);
		}
		return this.typeConverter.toDomain(document, this.passport);
	}

	// biome-ignore lint: noRequireAwait
	async getNewInstance(
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
	): Promise<Domain.Contexts.Catalog.Product.Product<ProductDomainAdapter>> {
		const adapter = this.typeConverter.toAdapter(new this.model());
		return Promise.resolve(
			Domain.Contexts.Catalog.Product.Product.getNewInstance(
				adapter,
				organizationId,
				sku,
				name,
				description,
				category,
				price,
				cost,
				unit,
				reorderPoint,
				isActive,
				this.passport,
			),
		);
	}
}
