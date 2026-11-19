import type { InventoryModelType } from '@invt/data-sources-mongoose-models';
import type { Domain } from '@invt/domain';
import { InventoryConverter } from '../../../domain/inventory/inventory/inventory.domain-adapter.ts';
import type { FindOneOptions, FindOptions } from '../../mongo-data-source.ts';
import { InventoryDataSourceImpl, type InventoryDataSource } from './inventory.data.ts';

export interface InventoryReadRepository {
	getAll: (options?: FindOptions) => Promise<Domain.Contexts.Inventory.Inventory.InventoryEntityReference[]>;
	getById: (id: string, options?: FindOneOptions) => Promise<Domain.Contexts.Inventory.Inventory.InventoryEntityReference | null>;
}

class InventoryReadRepositoryImpl implements InventoryReadRepository {
	private readonly mongoDataSource: InventoryDataSource;
	private readonly converter: InventoryConverter;
	private readonly passport: Domain.Passport;

	constructor(models: { Inventory: InventoryModelType }, passport: Domain.Passport) {
		this.mongoDataSource = new InventoryDataSourceImpl(models.Inventory);
		this.converter = new InventoryConverter();
		this.passport = passport;
	}

	async getAll(options?: FindOptions): Promise<Domain.Contexts.Inventory.Inventory.InventoryEntityReference[]> {
		const result = await this.mongoDataSource.find({}, options);
		return result.map((doc) => this.converter.toDomain(doc, this.passport));
	}

	async getById(id: string, options?: FindOneOptions): Promise<Domain.Contexts.Inventory.Inventory.InventoryEntityReference | null> {
		const result = await this.mongoDataSource.findById(id, options);
		if (!result) {
			return null;
		}
		return this.converter.toDomain(result, this.passport);
	}
}

export const getInventoryReadRepository = (models: { Inventory: InventoryModelType }, passport: Domain.Passport): InventoryReadRepository => {
	return new InventoryReadRepositoryImpl(models, passport);
};
