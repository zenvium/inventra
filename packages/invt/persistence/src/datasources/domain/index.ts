import type { Domain, DomainDataSource } from '@invt/domain';
import type { ModelsContext } from '../index.ts';
import { OrganizationContextPersistence } from './organization/index.ts';
import { UserContextPersistence } from './user/index.ts';
import { CatalogContextPersistence } from './catalog/index.ts';
import { PartnerContextPersistence } from './partner/index.ts';
import { InventoryContextPersistence } from './inventory/index.ts';
import { ProcurementContextPersistence } from './procurement/index.ts';
import { SaleContextPersistence } from './sale/index.ts';

export const DomainDataSourceImplementation = (models: ModelsContext, passport: Domain.Passport): DomainDataSource => ({
	Organization: OrganizationContextPersistence(models, passport),
	User: UserContextPersistence(models, passport),
	Catalog: CatalogContextPersistence(models, passport),
	Partner: PartnerContextPersistence(models, passport),
	Inventory: InventoryContextPersistence(models, passport),
	Procurement: ProcurementContextPersistence(models, passport),
	Sale: SaleContextPersistence(models, passport),
});
