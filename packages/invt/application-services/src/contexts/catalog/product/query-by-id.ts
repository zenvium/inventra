import type { Domain } from '@invt/domain';
import type { DataSources } from '@invt/persistence';

export interface ProductQueryByIdCommand {
	id: string;
}

export const queryById = (dataSources: DataSources) => {
	return async (command: ProductQueryByIdCommand): Promise<Domain.Contexts.Catalog.Product.ProductEntityReference | null> => {
		return await dataSources.readonlyDataSource.Catalog.Product.ProductReadRepo.getById(command.id);
	};
};
