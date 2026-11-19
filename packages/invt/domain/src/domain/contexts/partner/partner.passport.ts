import type { CustomerEntityReference } from './customer/customer.aggregate.ts';
import type { SupplierEntityReference } from './supplier/supplier.aggregate.ts';
import type { PartnerVisa } from './partner.visa.ts';

export interface PartnerPassport {
	forCustomer(root: CustomerEntityReference): PartnerVisa;
	forSupplier(root: SupplierEntityReference): PartnerVisa;
}
