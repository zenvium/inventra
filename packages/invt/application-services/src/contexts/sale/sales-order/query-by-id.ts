import type { Domain } from '@invt/domain';
import type { DataSources } from '@invt/persistence';

export interface SalesOrderQueryByIdCommand {
	id: string;
}

export const queryById = (dataSources: DataSources) => {
	return async (command: SalesOrderQueryByIdCommand): Promise<Domain.Contexts.Sale.SalesOrder.SalesOrderEntityReference | null> => {
		return await dataSources.readonlyDataSource.Sale.SalesOrder.SalesOrderReadRepo.getById(command.id);
	};
};
