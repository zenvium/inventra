import type { Visa } from '@cellix/domain-seedwork/visa';
import type { PartnerDomainPermissions } from './partner.domain-permissions.ts';

export interface PartnerVisa extends Visa<PartnerDomainPermissions> {}
