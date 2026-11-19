import type { Domain } from '@invt/domain';
import type { DataSources } from '@invt/persistence';
import { type SupplierQueryByIdCommand, queryById } from './query-by-id.ts';

export interface SupplierApplicationService {
	queryById: (command: SupplierQueryByIdCommand) => Promise<Domain.Contexts.Partner.Supplier.SupplierEntityReference | null>;
}

export const Supplier = (dataSources: DataSources): SupplierApplicationService => ({
	queryById: queryById(dataSources),
});
