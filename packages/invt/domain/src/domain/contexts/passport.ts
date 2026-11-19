import type { OrganizationPassport } from './organization/organization.passport.ts';
import type { UserPassport } from './user/user.passport.ts';
import type { CatalogPassport } from './catalog/catalog.passport.ts';
import type { PartnerPassport } from './partner/partner.passport.ts';
import type { InventoryPassport } from './inventory/inventory.passport.ts';
import type { ProcurementPassport } from './procurement/procurement.passport.ts';
import type { SalePassport } from './sale/sale.passport.ts';

export interface Passport {
	organization: OrganizationPassport;
	user: UserPassport;
	catalog: CatalogPassport;
	partner: PartnerPassport;
	inventory: InventoryPassport;
	procurement: ProcurementPassport;
	sale: SalePassport;
}

export const PassportFactory = {
	forSystem(): Passport {
		return {
			organization: {
				forOrganization: () => ({ determineIf: (check) => check({ canManageOrganization: true }) }),
			},
			user: {
				forUser: () => ({ determineIf: (check) => check({ canManageUser: true }) }),
			},
			catalog: {
				forProduct: () => ({ determineIf: (check) => check({ canManageProduct: true }) }),
			},
			partner: {
				forCustomer: () => ({ determineIf: (check) => check({ canManageCustomer: true, canManageSupplier: true }) }),
				forSupplier: () => ({ determineIf: (check) => check({ canManageCustomer: true, canManageSupplier: true }) }),
			},
			inventory: {
				forInventory: () => ({ determineIf: (check) => check({ canManageInventory: true, canManageStockMovement: true, canManageWarehouse: true }) }),
				forStockMovement: () => ({ determineIf: (check) => check({ canManageInventory: true, canManageStockMovement: true, canManageWarehouse: true }) }),
				forWarehouse: () => ({ determineIf: (check) => check({ canManageInventory: true, canManageStockMovement: true, canManageWarehouse: true }) }),
			},
			procurement: {
				forPurchaseOrder: () => ({ determineIf: (check) => check({ canManagePurchaseOrder: true }) }),
			},
			sale: {
				forSalesOrder: () => ({ determineIf: (check) => check({ canManageSalesOrder: true }) }),
			},
		};
	},
};
