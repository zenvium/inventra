import type { Domain } from '@invt/domain';
import type { ModelsContext } from '../../../index.ts';
import { getOrganizationReadRepository } from './organization.read-repository.ts';

export const OrganizationReadRepositoryImpl = (models: ModelsContext, passport: Domain.Passport) => ({
	OrganizationReadRepo: getOrganizationReadRepository(models, passport),
});
