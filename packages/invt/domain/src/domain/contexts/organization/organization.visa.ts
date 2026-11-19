import type { Visa } from '@cellix/domain-seedwork/visa';
import type { OrganizationDomainPermissions } from './organization.domain-permissions.ts';

export interface OrganizationVisa extends Visa<OrganizationDomainPermissions> {}
