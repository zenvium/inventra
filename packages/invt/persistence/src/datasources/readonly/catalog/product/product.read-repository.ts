import type { ProductModelType } from '@invt/data-sources-mongoose-models';
import type { Domain } from '@invt/domain';
import { ProductConverter } from '../../../domain/catalog/product/product.domain-adapter.ts';
import type { FindOneOptions, FindOptions } from '../../mongo-data-source.ts';
import { ProductDataSourceImpl, type ProductDataSource } from './product.data.ts';

export interface ProductReadRepository {
	getAll: (options?: FindOptions) => Promise<Domain.Contexts.Catalog.Product.ProductEntityReference[]>;
	getById: (id: string, options?: FindOneOptions) => Promise<Domain.Contexts.Catalog.Product.ProductEntityReference | null>;
}

class ProductReadRepositoryImpl implements ProductReadRepository {
	private readonly mongoDataSource: ProductDataSource;
	private readonly converter: ProductConverter;
	private readonly passport: Domain.Passport;

	constructor(models: { Product: ProductModelType }, passport: Domain.Passport) {
		this.mongoDataSource = new ProductDataSourceImpl(models.Product);
		this.converter = new ProductConverter();
		this.passport = passport;
	}

	async getAll(options?: FindOptions): Promise<Domain.Contexts.Catalog.Product.ProductEntityReference[]> {
		const result = await this.mongoDataSource.find({}, options);
		return result.map((doc) => this.converter.toDomain(doc, this.passport));
	}

	async getById(id: string, options?: FindOneOptions): Promise<Domain.Contexts.Catalog.Product.ProductEntityReference | null> {
		const result = await this.mongoDataSource.findById(id, options);
		if (!result) {
			return null;
		}
		return this.converter.toDomain(result, this.passport);
	}
}

export const getProductReadRepository = (models: { Product: ProductModelType }, passport: Domain.Passport): ProductReadRepository => {
	return new ProductReadRepositoryImpl(models, passport);
};
