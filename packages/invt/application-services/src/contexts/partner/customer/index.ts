import type { Domain } from '@invt/domain';
import type { DataSources } from '@invt/persistence';
import { type CustomerQueryByIdCommand, queryById } from './query-by-id.ts';

export interface CustomerApplicationService {
	queryById: (command: CustomerQueryByIdCommand) => Promise<Domain.Contexts.Partner.Customer.CustomerEntityReference | null>;
}

export const Customer = (dataSources: DataSources): CustomerApplicationService => ({
	queryById: queryById(dataSources),
});
