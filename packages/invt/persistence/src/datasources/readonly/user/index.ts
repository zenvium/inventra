import type { Domain } from '@invt/domain';
import type { ModelsContext } from '../../../index.ts';
import { UserReadRepositoryImpl } from './user/index.ts';

export const UserContext = (models: ModelsContext, passport: Domain.Passport) => ({
	User: UserReadRepositoryImpl(models, passport),
});
