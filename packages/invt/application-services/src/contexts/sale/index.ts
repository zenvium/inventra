import type { DataSources } from '@invt/persistence';
import { SalesOrder as SalesOrderApi, type SalesOrderApplicationService } from './sales-order/index.ts';

export interface SaleContextApplicationService {
	SalesOrder: SalesOrderApplicationService;
}

export const Sale = (dataSources: DataSources): SaleContextApplicationService => ({
	SalesOrder: SalesOrderApi(dataSources),
});
