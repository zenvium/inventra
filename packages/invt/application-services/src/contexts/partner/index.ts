import type { DataSources } from '@invt/persistence';
import { Customer as CustomerApi, type CustomerApplicationService } from './customer/index.ts';
import { Supplier as SupplierApi, type SupplierApplicationService } from './supplier/index.ts';

export interface PartnerContextApplicationService {
	Customer: CustomerApplicationService;
	Supplier: SupplierApplicationService;
}

export const Partner = (dataSources: DataSources): PartnerContextApplicationService => ({
	Customer: CustomerApi(dataSources),
	Supplier: SupplierApi(dataSources),
});
