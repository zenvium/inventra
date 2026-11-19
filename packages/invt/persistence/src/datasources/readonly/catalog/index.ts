import type { Domain } from '@invt/domain';
import type { ModelsContext } from '../../../index.ts';
import { ProductReadRepositoryImpl } from './product/index.ts';

export const CatalogContext = (models: ModelsContext, passport: Domain.Passport) => ({
	Product: ProductReadRepositoryImpl(models, passport),
});
