import type { DataSources } from '@invt/persistence';
import { PurchaseOrder as PurchaseOrderApi, type PurchaseOrderApplicationService } from './purchase-order/index.ts';

export interface ProcurementContextApplicationService {
	PurchaseOrder: PurchaseOrderApplicationService;
}

export const Procurement = (dataSources: DataSources): ProcurementContextApplicationService => ({
	PurchaseOrder: PurchaseOrderApi(dataSources),
});
