import type { Domain } from '@invt/domain';
import type { DataSources } from '@invt/persistence';

export interface UserQueryByIdCommand {
	id: string;
}

export const queryById = (dataSources: DataSources) => {
	return async (command: UserQueryByIdCommand): Promise<Domain.Contexts.User.User.UserEntityReference | null> => {
		return await dataSources.readonlyDataSource.User.User.UserReadRepo.getById(command.id);
	};
};
