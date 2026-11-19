import type { Domain } from '@invt/domain';
import type { ModelsContext } from '../../../index.ts';
import { OrganizationReadRepositoryImpl } from './organization/index.ts';

export const OrganizationContext = (models: ModelsContext, passport: Domain.Passport) => ({
	Organization: OrganizationReadRepositoryImpl(models, passport),
});
