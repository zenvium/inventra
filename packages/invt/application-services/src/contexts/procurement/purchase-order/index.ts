import type { Domain } from '@invt/domain';
import type { DataSources } from '@invt/persistence';
import { type PurchaseOrderQueryByIdCommand, queryById } from './query-by-id.ts';

export interface PurchaseOrderApplicationService {
	queryById: (command: PurchaseOrderQueryByIdCommand) => Promise<Domain.Contexts.Procurement.PurchaseOrder.PurchaseOrderEntityReference | null>;
}

export const PurchaseOrder = (dataSources: DataSources): PurchaseOrderApplicationService => ({
	queryById: queryById(dataSources),
});
