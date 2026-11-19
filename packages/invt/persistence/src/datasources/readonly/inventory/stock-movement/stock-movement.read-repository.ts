import type { StockMovementModelType } from '@invt/data-sources-mongoose-models';
import type { Domain } from '@invt/domain';
import { StockMovementConverter } from '../../../domain/inventory/stock-movement/stock-movement.domain-adapter.ts';
import type { FindOneOptions, FindOptions } from '../../mongo-data-source.ts';
import { StockMovementDataSourceImpl, type StockMovementDataSource } from './stock-movement.data.ts';

export interface StockMovementReadRepository {
	getAll: (options?: FindOptions) => Promise<Domain.Contexts.Inventory.StockMovement.StockMovementEntityReference[]>;
	getById: (id: string, options?: FindOneOptions) => Promise<Domain.Contexts.Inventory.StockMovement.StockMovementEntityReference | null>;
}

class StockMovementReadRepositoryImpl implements StockMovementReadRepository {
	private readonly mongoDataSource: StockMovementDataSource;
	private readonly converter: StockMovementConverter;
	private readonly passport: Domain.Passport;

	constructor(models: { StockMovement: StockMovementModelType }, passport: Domain.Passport) {
		this.mongoDataSource = new StockMovementDataSourceImpl(models.StockMovement);
		this.converter = new StockMovementConverter();
		this.passport = passport;
	}

	async getAll(options?: FindOptions): Promise<Domain.Contexts.Inventory.StockMovement.StockMovementEntityReference[]> {
		const result = await this.mongoDataSource.find({}, options);
		return result.map((doc) => this.converter.toDomain(doc, this.passport));
	}

	async getById(id: string, options?: FindOneOptions): Promise<Domain.Contexts.Inventory.StockMovement.StockMovementEntityReference | null> {
		const result = await this.mongoDataSource.findById(id, options);
		if (!result) {
			return null;
		}
		return this.converter.toDomain(result, this.passport);
	}
}

export const getStockMovementReadRepository = (models: { StockMovement: StockMovementModelType }, passport: Domain.Passport): StockMovementReadRepository => {
	return new StockMovementReadRepositoryImpl(models, passport);
};
