import type { SupplierModelType } from '@invt/data-sources-mongoose-models';
import type { Domain } from '@invt/domain';
import { SupplierConverter } from '../../../domain/partner/supplier/supplier.domain-adapter.ts';
import type { FindOneOptions, FindOptions } from '../../mongo-data-source.ts';
import { SupplierDataSourceImpl, type SupplierDataSource } from './supplier.data.ts';

export interface SupplierReadRepository {
	getAll: (options?: FindOptions) => Promise<Domain.Contexts.Partner.Supplier.SupplierEntityReference[]>;
	getById: (id: string, options?: FindOneOptions) => Promise<Domain.Contexts.Partner.Supplier.SupplierEntityReference | null>;
}

class SupplierReadRepositoryImpl implements SupplierReadRepository {
	private readonly mongoDataSource: SupplierDataSource;
	private readonly converter: SupplierConverter;
	private readonly passport: Domain.Passport;

	constructor(models: { Supplier: SupplierModelType }, passport: Domain.Passport) {
		this.mongoDataSource = new SupplierDataSourceImpl(models.Supplier);
		this.converter = new SupplierConverter();
		this.passport = passport;
	}

	async getAll(options?: FindOptions): Promise<Domain.Contexts.Partner.Supplier.SupplierEntityReference[]> {
		const result = await this.mongoDataSource.find({}, options);
		return result.map((doc) => this.converter.toDomain(doc, this.passport));
	}

	async getById(id: string, options?: FindOneOptions): Promise<Domain.Contexts.Partner.Supplier.SupplierEntityReference | null> {
		const result = await this.mongoDataSource.findById(id, options);
		if (!result) return null;
		return this.converter.toDomain(result, this.passport);
	}
}

export const getSupplierReadRepository = (models: { Supplier: SupplierModelType }, passport: Domain.Passport): SupplierReadRepository => {
	return new SupplierReadRepositoryImpl(models, passport);
};
