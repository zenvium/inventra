import type { Domain } from '@invt/domain';
import type { DataSources } from '@invt/persistence';

export interface OrganizationQueryByIdCommand {
	id: string;
}

export const queryById = (dataSources: DataSources) => {
	return async (command: OrganizationQueryByIdCommand): Promise<Domain.Contexts.Organization.Organization.OrganizationEntityReference | null> => {
		return await dataSources.readonlyDataSource.Organization.Organization.OrganizationReadRepo.getById(command.id);
	};
};
