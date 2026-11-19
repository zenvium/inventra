import type { PurchaseOrder } from '@invt/data-sources-mongoose-models';
import { MongoDataSourceImpl, type MongoDataSource } from '../../mongo-data-source.ts';

export interface PurchaseOrderDataSource extends MongoDataSource<PurchaseOrder> {}

export class PurchaseOrderDataSourceImpl extends MongoDataSourceImpl<PurchaseOrder> implements PurchaseOrderDataSource {}
