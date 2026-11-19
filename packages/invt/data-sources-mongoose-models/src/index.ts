import type { MongooseSeedwork } from '@cellix/mongoose-seedwork';
import { CustomerModelFactory } from './models/customer/customer.model.ts';
import { InventoryModelFactory } from './models/inventory/inventory.model.ts';
import { OrganizationModelFactory } from './models/organization/organization.model.ts';
import { ProductModelFactory } from './models/product/product.model.ts';
import { PurchaseOrderModelFactory } from './models/purchase-order/purchase-order.model.ts';
import { SalesOrderModelFactory } from './models/sales-order/sales-order.model.ts';
import { StockMovementModelFactory } from './models/stock-movement/stock-movement.model.ts';
import { SupplierModelFactory } from './models/supplier/supplier.model.ts';
import { UserModelFactory } from './models/user/user.model.ts';
import { WarehouseModelFactory } from './models/warehouse/warehouse.model.ts';

export type { Customer, CustomerModelType } from './models/customer/customer.model.ts';
export type { AddressDoc as CustomerAddressDoc } from './models/customer/customer.model.ts';
export { CustomerModelName } from './models/customer/customer.model.ts';
export type { Inventory, InventoryModelType } from './models/inventory/inventory.model.ts';
export { InventoryModelName } from './models/inventory/inventory.model.ts';
export type { Organization, OrganizationModelType } from './models/organization/organization.model.ts';
export { OrganizationModelName } from './models/organization/organization.model.ts';
export type { Product, ProductModelType } from './models/product/product.model.ts';
export { ProductModelName } from './models/product/product.model.ts';
export type { PurchaseOrder, PurchaseOrderItemDoc, PurchaseOrderModelType } from './models/purchase-order/purchase-order.model.ts';
export { PurchaseOrderModelName } from './models/purchase-order/purchase-order.model.ts';
export type { SalesOrder, SalesOrderItemDoc, SalesOrderModelType } from './models/sales-order/sales-order.model.ts';
export { SalesOrderModelName } from './models/sales-order/sales-order.model.ts';
export type { StockMovement, StockMovementModelType } from './models/stock-movement/stock-movement.model.ts';
export { StockMovementModelName } from './models/stock-movement/stock-movement.model.ts';
export type { Supplier, SupplierModelType } from './models/supplier/supplier.model.ts';
export type { AddressDoc as SupplierAddressDoc } from './models/supplier/supplier.model.ts';
export { SupplierModelName } from './models/supplier/supplier.model.ts';
export type { User, UserModelType } from './models/user/user.model.ts';
export { UserModelName } from './models/user/user.model.ts';
export type { Warehouse, WarehouseModelType } from './models/warehouse/warehouse.model.ts';
export type { AddressDoc as WarehouseAddressDoc } from './models/warehouse/warehouse.model.ts';
export { WarehouseModelName } from './models/warehouse/warehouse.model.ts';

export const mongooseContextBuilder = (initializedService: MongooseSeedwork.MongooseContextFactory) => ({
	Customer: CustomerModelFactory(initializedService),
	Inventory: InventoryModelFactory(initializedService),
	Organization: OrganizationModelFactory(initializedService),
	Product: ProductModelFactory(initializedService),
	PurchaseOrder: PurchaseOrderModelFactory(initializedService),
	SalesOrder: SalesOrderModelFactory(initializedService),
	StockMovement: StockMovementModelFactory(initializedService),
	Supplier: SupplierModelFactory(initializedService),
	User: UserModelFactory(initializedService),
	Warehouse: WarehouseModelFactory(initializedService),
});
