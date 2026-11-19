import type { Domain } from '@invt/domain';
import type { ModelsContext } from '../index.ts';
import type { OrganizationReadRepository } from './organization/organization/organization.read-repository.ts';
import type { UserReadRepository } from './user/user/user.read-repository.ts';
import type { ProductReadRepository } from './catalog/product/product.read-repository.ts';
import type { CustomerReadRepository } from './partner/customer/customer.read-repository.ts';
import type { SupplierReadRepository } from './partner/supplier/supplier.read-repository.ts';
import type { InventoryReadRepository } from './inventory/inventory/inventory.read-repository.ts';
import type { StockMovementReadRepository } from './inventory/stock-movement/stock-movement.read-repository.ts';
import type { WarehouseReadRepository } from './inventory/warehouse/warehouse.read-repository.ts';
import type { PurchaseOrderReadRepository } from './procurement/purchase-order/purchase-order.read-repository.ts';
import type { SalesOrderReadRepository } from './sale/sales-order/sales-order.read-repository.ts';
import { OrganizationContext } from './organization/index.ts';
import { UserContext } from './user/index.ts';
import { CatalogContext } from './catalog/index.ts';
import { PartnerContext } from './partner/index.ts';
import { InventoryContext } from './inventory/index.ts';
import { ProcurementContext } from './procurement/index.ts';
import { SaleContext } from './sale/index.ts';

export interface ReadonlyDataSource {
	Organization: {
		Organization: { OrganizationReadRepo: OrganizationReadRepository };
	};
	User: {
		User: { UserReadRepo: UserReadRepository };
	};
	Catalog: {
		Product: { ProductReadRepo: ProductReadRepository };
	};
	Partner: {
		Customer: { CustomerReadRepo: CustomerReadRepository };
		Supplier: { SupplierReadRepo: SupplierReadRepository };
	};
	Inventory: {
		Inventory: { InventoryReadRepo: InventoryReadRepository };
		StockMovement: { StockMovementReadRepo: StockMovementReadRepository };
		Warehouse: { WarehouseReadRepo: WarehouseReadRepository };
	};
	Procurement: {
		PurchaseOrder: { PurchaseOrderReadRepo: PurchaseOrderReadRepository };
	};
	Sale: {
		SalesOrder: { SalesOrderReadRepo: SalesOrderReadRepository };
	};
}

export const ReadonlyDataSourceImplementation = (models: ModelsContext, passport: Domain.Passport): ReadonlyDataSource => ({
	Organization: OrganizationContext(models, passport),
	User: UserContext(models, passport),
	Catalog: CatalogContext(models, passport),
	Partner: PartnerContext(models, passport),
	Inventory: InventoryContext(models, passport),
	Procurement: ProcurementContext(models, passport),
	Sale: SaleContext(models, passport),
});
