import type { Supplier as SupplierDoc } from '@invt/data-sources-mongoose-models';
import { MongoDataSourceImpl, type MongoDataSource } from '../../mongo-data-source.ts';

export interface SupplierDataSource extends MongoDataSource<SupplierDoc> {}

export class SupplierDataSourceImpl extends MongoDataSourceImpl<SupplierDoc> implements SupplierDataSource {}
