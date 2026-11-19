import type { ProductEntityReference } from './product/product.aggregate.ts';
import type { CatalogVisa } from './catalog.visa.ts';

export interface CatalogPassport {
	forProduct(root: ProductEntityReference): CatalogVisa;
}
