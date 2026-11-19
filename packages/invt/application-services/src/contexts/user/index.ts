import type { DataSources } from '@invt/persistence';
import { User as UserApi, type UserApplicationService } from './user/index.ts';

export interface UserContextApplicationService {
	User: UserApplicationService;
}

export const User = (dataSources: DataSources): UserContextApplicationService => ({
	User: UserApi(dataSources),
});
