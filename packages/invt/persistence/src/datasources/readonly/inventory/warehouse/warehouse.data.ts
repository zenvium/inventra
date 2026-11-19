import type { Warehouse } from '@invt/data-sources-mongoose-models';
import { MongoDataSourceImpl, type MongoDataSource } from '../../mongo-data-source.ts';

export interface WarehouseDataSource extends MongoDataSource<Warehouse> {}

export class WarehouseDataSourceImpl extends MongoDataSourceImpl<Warehouse> implements WarehouseDataSource {}
