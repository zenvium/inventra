import type { Inventory as InventoryDoc } from '@invt/data-sources-mongoose-models';
import { MongoDataSourceImpl, type MongoDataSource } from '../../mongo-data-source.ts';

export interface InventoryDataSource extends MongoDataSource<InventoryDoc> {}

export class InventoryDataSourceImpl extends MongoDataSourceImpl<InventoryDoc> implements InventoryDataSource {}
