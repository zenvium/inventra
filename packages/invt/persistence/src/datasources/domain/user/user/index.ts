import type { Domain } from '@invt/domain';
import type { ModelsContext } from '../../../../index.ts';
import { getUserUnitOfWork } from './user.uow.ts';

export const UserPersistence = (models: ModelsContext, passport: Domain.Passport) => ({
	UserUnitOfWork: getUserUnitOfWork(models.User, passport),
});
