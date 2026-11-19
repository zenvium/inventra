import type { WarehouseModelType } from '@invt/data-sources-mongoose-models';
import type { Domain } from '@invt/domain';
import { WarehouseConverter } from '../../../domain/inventory/warehouse/warehouse.domain-adapter.ts';
import type { FindOneOptions, FindOptions } from '../../mongo-data-source.ts';
import { WarehouseDataSourceImpl, type WarehouseDataSource } from './warehouse.data.ts';

export interface WarehouseReadRepository {
	getAll: (options?: FindOptions) => Promise<Domain.Contexts.Inventory.Warehouse.WarehouseEntityReference[]>;
	getById: (id: string, options?: FindOneOptions) => Promise<Domain.Contexts.Inventory.Warehouse.WarehouseEntityReference | null>;
}

class WarehouseReadRepositoryImpl implements WarehouseReadRepository {
	private readonly mongoDataSource: WarehouseDataSource;
	private readonly converter: WarehouseConverter;
	private readonly passport: Domain.Passport;

	constructor(models: { Warehouse: WarehouseModelType }, passport: Domain.Passport) {
		this.mongoDataSource = new WarehouseDataSourceImpl(models.Warehouse);
		this.converter = new WarehouseConverter();
		this.passport = passport;
	}

	async getAll(options?: FindOptions): Promise<Domain.Contexts.Inventory.Warehouse.WarehouseEntityReference[]> {
		const result = await this.mongoDataSource.find({}, options);
		return result.map((doc) => this.converter.toDomain(doc, this.passport));
	}

	async getById(id: string, options?: FindOneOptions): Promise<Domain.Contexts.Inventory.Warehouse.WarehouseEntityReference | null> {
		const result = await this.mongoDataSource.findById(id, options);
		if (!result) {
			return null;
		}
		return this.converter.toDomain(result, this.passport);
	}
}

export const getWarehouseReadRepository = (models: { Warehouse: WarehouseModelType }, passport: Domain.Passport): WarehouseReadRepository => {
	return new WarehouseReadRepositoryImpl(models, passport);
};
