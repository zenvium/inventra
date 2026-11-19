import type { DataSources } from '@invt/persistence';
import { Organization as OrganizationApi, type OrganizationApplicationService } from './organization/index.ts';

export interface OrganizationContextApplicationService {
	Organization: OrganizationApplicationService;
}

export const Organization = (dataSources: DataSources): OrganizationContextApplicationService => ({
	Organization: OrganizationApi(dataSources),
});
