import { Domain, type DomainDataSource } from '@invt/domain';
import type { MongooseSeedwork } from '@cellix/mongoose-seedwork';
import { mongooseContextBuilder } from '@invt/data-sources-mongoose-models';
import { DomainDataSourceImplementation } from './domain/index.ts';
import { type ReadonlyDataSource, ReadonlyDataSourceImplementation } from './readonly/index.ts';

export type ModelsContext = ReturnType<typeof mongooseContextBuilder>;
export type { DomainDataSource, ReadonlyDataSource };
export type DataSources = { domainDataSource: DomainDataSource; readonlyDataSource: ReadonlyDataSource };
export type DataSourcesFactory = {
	withPassport: (passport: Domain.Passport) => DataSources;
	withSystemPassport: () => DataSources;
};

export const DataSourcesFactoryImpl = (models: ModelsContext): DataSourcesFactory => {
	const withPassport = (passport: Domain.Passport): DataSources => ({
		domainDataSource: DomainDataSourceImplementation(models, passport),
		readonlyDataSource: ReadonlyDataSourceImplementation(models, passport),
	});
	return {
		withPassport,
		withSystemPassport: () => withPassport(Domain.PassportFactory.forSystem()),
	};
};

export const createModelsContext = (initializedService: MongooseSeedwork.MongooseContextFactory): ModelsContext => mongooseContextBuilder(initializedService);
