import type { StockMovement as StockMovementDoc } from '@invt/data-sources-mongoose-models';
import { MongoDataSourceImpl, type MongoDataSource } from '../../mongo-data-source.ts';

export interface StockMovementDataSource extends MongoDataSource<StockMovementDoc> {}

export class StockMovementDataSourceImpl extends MongoDataSourceImpl<StockMovementDoc> implements StockMovementDataSource {}
