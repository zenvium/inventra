import type { Contexts } from './domain/index.ts';

export * as Domain from './domain/index.ts';

export interface DomainDataSource {
	Organization: {
		Organization: { OrganizationUnitOfWork: Contexts.Organization.Organization.OrganizationUnitOfWork };
	};
	User: {
		User: { UserUnitOfWork: Contexts.User.User.UserUnitOfWork };
	};
	Catalog: {
		Product: { ProductUnitOfWork: Contexts.Catalog.Product.ProductUnitOfWork };
	};
	Partner: {
		Customer: { CustomerUnitOfWork: Contexts.Partner.Customer.CustomerUnitOfWork };
		Supplier: { SupplierUnitOfWork: Contexts.Partner.Supplier.SupplierUnitOfWork };
	};
	Inventory: {
		Inventory: { InventoryUnitOfWork: Contexts.Inventory.Inventory.InventoryUnitOfWork };
		StockMovement: { StockMovementUnitOfWork: Contexts.Inventory.StockMovement.StockMovementUnitOfWork };
		Warehouse: { WarehouseUnitOfWork: Contexts.Inventory.Warehouse.WarehouseUnitOfWork };
	};
	Procurement: {
		PurchaseOrder: { PurchaseOrderUnitOfWork: Contexts.Procurement.PurchaseOrder.PurchaseOrderUnitOfWork };
	};
	Sale: {
		SalesOrder: { SalesOrderUnitOfWork: Contexts.Sale.SalesOrder.SalesOrderUnitOfWork };
	};
}
