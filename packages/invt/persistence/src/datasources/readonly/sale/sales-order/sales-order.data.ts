import type { SalesOrder } from '@invt/data-sources-mongoose-models';
import { MongoDataSourceImpl, type MongoDataSource } from '../../mongo-data-source.ts';

export interface SalesOrderDataSource extends MongoDataSource<SalesOrder> {}

export class SalesOrderDataSourceImpl extends MongoDataSourceImpl<SalesOrder> implements SalesOrderDataSource {}
