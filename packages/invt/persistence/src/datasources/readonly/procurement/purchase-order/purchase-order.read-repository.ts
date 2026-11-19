import type { PurchaseOrderModelType } from '@invt/data-sources-mongoose-models';
import type { Domain } from '@invt/domain';
import { PurchaseOrderConverter } from '../../../domain/procurement/purchase-order/purchase-order.domain-adapter.ts';
import type { FindOneOptions, FindOptions } from '../../mongo-data-source.ts';
import { PurchaseOrderDataSourceImpl, type PurchaseOrderDataSource } from './purchase-order.data.ts';

export interface PurchaseOrderReadRepository {
	getAll: (options?: FindOptions) => Promise<Domain.Contexts.Procurement.PurchaseOrder.PurchaseOrderEntityReference[]>;
	getById: (id: string, options?: FindOneOptions) => Promise<Domain.Contexts.Procurement.PurchaseOrder.PurchaseOrderEntityReference | null>;
}

class PurchaseOrderReadRepositoryImpl implements PurchaseOrderReadRepository {
	private readonly mongoDataSource: PurchaseOrderDataSource;
	private readonly converter: PurchaseOrderConverter;
	private readonly passport: Domain.Passport;

	constructor(models: { PurchaseOrder: PurchaseOrderModelType }, passport: Domain.Passport) {
		this.mongoDataSource = new PurchaseOrderDataSourceImpl(models.PurchaseOrder);
		this.converter = new PurchaseOrderConverter();
		this.passport = passport;
	}

	async getAll(options?: FindOptions): Promise<Domain.Contexts.Procurement.PurchaseOrder.PurchaseOrderEntityReference[]> {
		const result = await this.mongoDataSource.find({}, options);
		return result.map((doc) => this.converter.toDomain(doc, this.passport));
	}

	async getById(id: string, options?: FindOneOptions): Promise<Domain.Contexts.Procurement.PurchaseOrder.PurchaseOrderEntityReference | null> {
		const result = await this.mongoDataSource.findById(id, options);
		if (!result) return null;
		return this.converter.toDomain(result, this.passport);
	}
}

export const getPurchaseOrderReadRepository = (models: { PurchaseOrder: PurchaseOrderModelType }, passport: Domain.Passport): PurchaseOrderReadRepository => {
	return new PurchaseOrderReadRepositoryImpl(models, passport);
};
