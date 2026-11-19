import type { Domain } from '@invt/domain';
import type { DataSources } from '@invt/persistence';
import { type ProductQueryByIdCommand, queryById } from './query-by-id.ts';

export interface ProductApplicationService {
	queryById: (command: ProductQueryByIdCommand) => Promise<Domain.Contexts.Catalog.Product.ProductEntityReference | null>;
}

export const Product = (dataSources: DataSources): ProductApplicationService => ({
	queryById: queryById(dataSources),
});
