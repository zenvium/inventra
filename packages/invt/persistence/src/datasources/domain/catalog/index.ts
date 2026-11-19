import type { Domain } from '@invt/domain';
import type { ModelsContext } from '../../../index.ts';
import * as Product from './product/index.ts';

export const CatalogContextPersistence = (models: ModelsContext, passport: Domain.Passport) => ({
	Product: Product.ProductPersistence(models, passport),
});
