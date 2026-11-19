import type { CustomerModelType } from '@invt/data-sources-mongoose-models';
import type { Domain } from '@invt/domain';
import { CustomerConverter } from '../../../domain/partner/customer/customer.domain-adapter.ts';
import type { FindOneOptions, FindOptions } from '../../mongo-data-source.ts';
import { CustomerDataSourceImpl, type CustomerDataSource } from './customer.data.ts';

export interface CustomerReadRepository {
	getAll: (options?: FindOptions) => Promise<Domain.Contexts.Partner.Customer.CustomerEntityReference[]>;
	getById: (id: string, options?: FindOneOptions) => Promise<Domain.Contexts.Partner.Customer.CustomerEntityReference | null>;
}

class CustomerReadRepositoryImpl implements CustomerReadRepository {
	private readonly mongoDataSource: CustomerDataSource;
	private readonly converter: CustomerConverter;
	private readonly passport: Domain.Passport;

	constructor(models: { Customer: CustomerModelType }, passport: Domain.Passport) {
		this.mongoDataSource = new CustomerDataSourceImpl(models.Customer);
		this.converter = new CustomerConverter();
		this.passport = passport;
	}

	async getAll(options?: FindOptions): Promise<Domain.Contexts.Partner.Customer.CustomerEntityReference[]> {
		const result = await this.mongoDataSource.find({}, options);
		return result.map((doc) => this.converter.toDomain(doc, this.passport));
	}

	async getById(id: string, options?: FindOneOptions): Promise<Domain.Contexts.Partner.Customer.CustomerEntityReference | null> {
		const result = await this.mongoDataSource.findById(id, options);
		if (!result) return null;
		return this.converter.toDomain(result, this.passport);
	}
}

export const getCustomerReadRepository = (models: { Customer: CustomerModelType }, passport: Domain.Passport): CustomerReadRepository => {
	return new CustomerReadRepositoryImpl(models, passport);
};
