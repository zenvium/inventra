import type { Domain } from '@invt/domain';
import type { DataSources } from '@invt/persistence';
import { type OrganizationQueryByIdCommand, queryById } from './query-by-id.ts';

export interface OrganizationApplicationService {
	queryById: (command: OrganizationQueryByIdCommand) => Promise<Domain.Contexts.Organization.Organization.OrganizationEntityReference | null>;
}

export const Organization = (dataSources: DataSources): OrganizationApplicationService => ({
	queryById: queryById(dataSources),
});
