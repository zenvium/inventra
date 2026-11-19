import type { Domain } from '@invt/domain';
import type { ModelsContext } from '../../../index.ts';
import { getProductReadRepository } from './product.read-repository.ts';

export const ProductReadRepositoryImpl = (models: ModelsContext, passport: Domain.Passport) => ({
	ProductReadRepo: getProductReadRepository(models, passport),
});
