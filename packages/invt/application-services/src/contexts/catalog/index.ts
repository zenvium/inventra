import type { DataSources } from '@invt/persistence';
import { Product as ProductApi, type ProductApplicationService } from './product/index.ts';

export interface CatalogContextApplicationService {
	Product: ProductApplicationService;
}

export const Catalog = (dataSources: DataSources): CatalogContextApplicationService => ({
	Product: ProductApi(dataSources),
});
