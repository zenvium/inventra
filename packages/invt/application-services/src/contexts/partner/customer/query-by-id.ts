import type { Domain } from '@invt/domain';
import type { DataSources } from '@invt/persistence';

export interface CustomerQueryByIdCommand {
	id: string;
}

export const queryById = (dataSources: DataSources) => {
	return async (command: CustomerQueryByIdCommand): Promise<Domain.Contexts.Partner.Customer.CustomerEntityReference | null> => {
		return await dataSources.readonlyDataSource.Partner.Customer.CustomerReadRepo.getById(command.id);
	};
};
