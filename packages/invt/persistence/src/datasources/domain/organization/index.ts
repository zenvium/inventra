import type { Domain } from '@invt/domain';
import type { ModelsContext } from '../../../index.ts';
import * as Organization from './organization/index.ts';

export const OrganizationContextPersistence = (models: ModelsContext, passport: Domain.Passport) => ({
	Organization: Organization.OrganizationPersistence(models, passport),
});
