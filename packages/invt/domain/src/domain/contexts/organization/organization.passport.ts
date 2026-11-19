import type { OrganizationEntityReference } from './organization/organization.aggregate.ts';
import type { OrganizationVisa } from './organization.visa.ts';

export interface OrganizationPassport {
	forOrganization(root: OrganizationEntityReference): OrganizationVisa;
}
