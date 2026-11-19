import type { Domain } from '@invt/domain';
import type { DataSources } from '@invt/persistence';
import { type UserQueryByIdCommand, queryById } from './query-by-id.ts';

export interface UserApplicationService {
	queryById: (command: UserQueryByIdCommand) => Promise<Domain.Contexts.User.User.UserEntityReference | null>;
}

export const User = (dataSources: DataSources): UserApplicationService => ({
	queryById: queryById(dataSources),
});
