import { Domain } from '@invt/domain';
import { type DataSourcesFactory, Persistence } from '@invt/persistence';
import type { MongooseSeedwork } from '@cellix/mongoose-seedwork';
import { Organization, type OrganizationContextApplicationService } from './contexts/organization/index.ts';
import { User, type UserContextApplicationService } from './contexts/user/index.ts';
import { Catalog, type CatalogContextApplicationService } from './contexts/catalog/index.ts';
import { Partner, type PartnerContextApplicationService } from './contexts/partner/index.ts';
import { Inventory, type InventoryContextApplicationService } from './contexts/inventory/index.ts';
import { Procurement, type ProcurementContextApplicationService } from './contexts/procurement/index.ts';
import { Sale, type SaleContextApplicationService } from './contexts/sale/index.ts';

export interface ApplicationServices {
	Organization: OrganizationContextApplicationService;
	User: UserContextApplicationService;
	Catalog: CatalogContextApplicationService;
	Partner: PartnerContextApplicationService;
	Inventory: InventoryContextApplicationService;
	Procurement: ProcurementContextApplicationService;
	Sale: SaleContextApplicationService;
}

export type ApplicationServicesFactory = {
	forRequest: () => Promise<ApplicationServices>;
	forSystem: () => Promise<ApplicationServices>;
};

function buildApplicationServices(dataSources: ReturnType<DataSourcesFactory['withSystemPassport']>): ApplicationServices {
	return {
		Organization: Organization(dataSources),
		User: User(dataSources),
		Catalog: Catalog(dataSources),
		Partner: Partner(dataSources),
		Inventory: Inventory(dataSources),
		Procurement: Procurement(dataSources),
		Sale: Sale(dataSources),
	};
}

export const buildApplicationServicesFactory = (mongooseService: MongooseSeedwork.MongooseContextFactory): ApplicationServicesFactory => {
	const dataSourcesFactory = Persistence(mongooseService);
	const forRequest = async (): Promise<ApplicationServices> => {
		const passport: Domain.Passport = Domain.PassportFactory.forSystem();
		return buildApplicationServices(dataSourcesFactory.withPassport(passport));
	};
	return {
		forRequest,
		forSystem: async () => buildApplicationServices(dataSourcesFactory.withSystemPassport()),
	};
};

export type { OrganizationContextApplicationService } from './contexts/organization/index.ts';
export type { UserContextApplicationService } from './contexts/user/index.ts';
export type { CatalogContextApplicationService } from './contexts/catalog/index.ts';
export type { PartnerContextApplicationService } from './contexts/partner/index.ts';
export type { InventoryContextApplicationService } from './contexts/inventory/index.ts';
export type { ProcurementContextApplicationService } from './contexts/procurement/index.ts';
export type { SaleContextApplicationService } from './contexts/sale/index.ts';
