import type { Visa } from '@cellix/domain-seedwork/visa';
import type { SaleDomainPermissions } from './sale.domain-permissions.ts';

export interface SaleVisa extends Visa<SaleDomainPermissions> {}
