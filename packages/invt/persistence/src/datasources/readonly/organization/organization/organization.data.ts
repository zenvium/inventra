import type { Organization } from '@invt/data-sources-mongoose-models';
import { MongoDataSourceImpl, type MongoDataSource } from '../../mongo-data-source.ts';

export interface OrganizationDataSource extends MongoDataSource<Organization> {}

export class OrganizationDataSourceImpl extends MongoDataSourceImpl<Organization> implements OrganizationDataSource {}
