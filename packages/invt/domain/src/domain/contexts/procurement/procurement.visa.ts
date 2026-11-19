import type { Visa } from '@cellix/domain-seedwork/visa';
import type { ProcurementDomainPermissions } from './procurement.domain-permissions.ts';

export interface ProcurementVisa extends Visa<ProcurementDomainPermissions> {}
