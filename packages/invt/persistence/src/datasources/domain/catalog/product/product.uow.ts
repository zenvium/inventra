import { InProcEventBusInstance, NodeEventBusInstance } from '@cellix/event-bus-seedwork-node';
import type { ProductModelType } from '@invt/data-sources-mongoose-models';
import { MongooseSeedwork } from '@cellix/mongoose-seedwork';
import type { Domain } from '@invt/domain';
import { ProductConverter } from './product.domain-adapter.ts';
import { ProductRepository } from './product.repository.ts';

export const getProductUnitOfWork = (model: ProductModelType, passport: Domain.Passport): Domain.Contexts.Catalog.Product.ProductUnitOfWork => {
	const unitOfWork = new MongooseSeedwork.MongoUnitOfWork(InProcEventBusInstance, NodeEventBusInstance, model, new ProductConverter(), ProductRepository);
	return MongooseSeedwork.getInitializedUnitOfWork(unitOfWork, passport);
};
