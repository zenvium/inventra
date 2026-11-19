import type { Domain } from '@invt/domain';
import type { ModelsContext } from '../../../index.ts';
import { getUserReadRepository } from './user.read-repository.ts';

export const UserReadRepositoryImpl = (models: ModelsContext, passport: Domain.Passport) => ({
	UserReadRepo: getUserReadRepository(models, passport),
});
