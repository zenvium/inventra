import type { Domain } from '@invt/domain';
import type { DataSources } from '@invt/persistence';
import { type SalesOrderQueryByIdCommand, queryById } from './query-by-id.ts';

export interface SalesOrderApplicationService {
	queryById: (command: SalesOrderQueryByIdCommand) => Promise<Domain.Contexts.Sale.SalesOrder.SalesOrderEntityReference | null>;
}

export const SalesOrder = (dataSources: DataSources): SalesOrderApplicationService => ({
	queryById: queryById(dataSources),
});
