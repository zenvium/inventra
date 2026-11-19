import type { Domain } from '@invt/domain';
import type { ModelsContext } from '../../../../index.ts';
import { getProductUnitOfWork } from './product.uow.ts';

export const ProductPersistence = (models: ModelsContext, passport: Domain.Passport) => ({
	ProductUnitOfWork: getProductUnitOfWork(models.Product, passport),
});
