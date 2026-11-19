import type { SalesOrderModelType } from '@invt/data-sources-mongoose-models';
import type { Domain } from '@invt/domain';
import { SalesOrderConverter } from '../../../domain/sale/sales-order/sales-order.domain-adapter.ts';
import type { FindOneOptions, FindOptions } from '../../mongo-data-source.ts';
import { SalesOrderDataSourceImpl, type SalesOrderDataSource } from './sales-order.data.ts';

export interface SalesOrderReadRepository {
	getAll: (options?: FindOptions) => Promise<Domain.Contexts.Sale.SalesOrder.SalesOrderEntityReference[]>;
	getById: (id: string, options?: FindOneOptions) => Promise<Domain.Contexts.Sale.SalesOrder.SalesOrderEntityReference | null>;
}

class SalesOrderReadRepositoryImpl implements SalesOrderReadRepository {
	private readonly mongoDataSource: SalesOrderDataSource;
	private readonly converter: SalesOrderConverter;
	private readonly passport: Domain.Passport;

	constructor(models: { SalesOrder: SalesOrderModelType }, passport: Domain.Passport) {
		this.mongoDataSource = new SalesOrderDataSourceImpl(models.SalesOrder);
		this.converter = new SalesOrderConverter();
		this.passport = passport;
	}

	async getAll(options?: FindOptions): Promise<Domain.Contexts.Sale.SalesOrder.SalesOrderEntityReference[]> {
		const result = await this.mongoDataSource.find({}, options);
		return result.map((doc) => this.converter.toDomain(doc, this.passport));
	}

	async getById(id: string, options?: FindOneOptions): Promise<Domain.Contexts.Sale.SalesOrder.SalesOrderEntityReference | null> {
		const result = await this.mongoDataSource.findById(id, options);
		return result ? this.converter.toDomain(result, this.passport) : null;
	}
}

export const getSalesOrderReadRepository = (models: { SalesOrder: SalesOrderModelType }, passport: Domain.Passport): SalesOrderReadRepository => {
	return new SalesOrderReadRepositoryImpl(models, passport);
};
