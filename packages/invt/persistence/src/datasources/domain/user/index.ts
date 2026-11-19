import type { Domain } from '@invt/domain';
import type { ModelsContext } from '../../../index.ts';
import * as User from './user/index.ts';

export const UserContextPersistence = (models: ModelsContext, passport: Domain.Passport) => ({
	User: User.UserPersistence(models, passport),
});
