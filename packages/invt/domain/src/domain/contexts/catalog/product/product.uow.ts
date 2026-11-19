import type { InitializedUnitOfWork, UnitOfWork } from '@cellix/domain-seedwork/unit-of-work';
import type { Passport } from '../../passport.ts';
import type { Product, ProductProps } from './product.aggregate.ts';
import type { ProductRepository } from './product.repository.ts';

export interface ProductUnitOfWork
	 extends UnitOfWork<Passport, ProductProps, Product<ProductProps>, ProductRepository<ProductProps>>,
		InitializedUnitOfWork<Passport, ProductProps, Product<ProductProps>, ProductRepository<ProductProps>> {}
