import type { Domain } from '@invt/domain';
import type { DataSources } from '@invt/persistence';

export interface SupplierQueryByIdCommand {
	id: string;
}

export const queryById = (dataSources: DataSources) => {
	return async (command: SupplierQueryByIdCommand): Promise<Domain.Contexts.Partner.Supplier.SupplierEntityReference | null> => {
		return await dataSources.readonlyDataSource.Partner.Supplier.SupplierReadRepo.getById(command.id);
	};
};
