import type { Domain } from '@invt/domain';
import type { DataSources } from '@invt/persistence';

export interface PurchaseOrderQueryByIdCommand {
	id: string;
}

export const queryById = (dataSources: DataSources) => {
	return async (command: PurchaseOrderQueryByIdCommand): Promise<Domain.Contexts.Procurement.PurchaseOrder.PurchaseOrderEntityReference | null> => {
		return await dataSources.readonlyDataSource.Procurement.PurchaseOrder.PurchaseOrderReadRepo.getById(command.id);
	};
};
