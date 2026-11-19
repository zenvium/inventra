import type { MongooseSeedwork } from '@cellix/mongoose-seedwork';
import { mongooseContextBuilder } from '@invt/data-sources-mongoose-models';
import { DataSourcesFactoryImpl } from './datasources/index.ts';

export type { DomainDataSource, DataSources, DataSourcesFactory, ReadonlyDataSource } from './datasources/index.ts';
export type ModelsContext = ReturnType<typeof mongooseContextBuilder>;

export const Persistence = (initializedService: MongooseSeedwork.MongooseContextFactory) => {
	if (!initializedService?.service) throw new Error('MongooseSeedwork.MongooseContextFactory is required');
	return DataSourcesFactoryImpl(mongooseContextBuilder(initializedService));
};
