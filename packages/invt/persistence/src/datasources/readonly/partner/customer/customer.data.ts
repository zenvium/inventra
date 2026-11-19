import type { Customer as CustomerDoc } from '@invt/data-sources-mongoose-models';
import { MongoDataSourceImpl, type MongoDataSource } from '../../mongo-data-source.ts';

export interface CustomerDataSource extends MongoDataSource<CustomerDoc> {}

export class CustomerDataSourceImpl extends MongoDataSourceImpl<CustomerDoc> implements CustomerDataSource {}
