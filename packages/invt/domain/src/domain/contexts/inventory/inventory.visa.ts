import type { Visa } from '@cellix/domain-seedwork/visa';
import type { InventoryDomainPermissions } from './inventory.domain-permissions.ts';

export interface InventoryVisa extends Visa<InventoryDomainPermissions> {}
