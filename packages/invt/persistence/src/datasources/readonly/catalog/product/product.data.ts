import type { Product as ProductDoc } from '@invt/data-sources-mongoose-models';
import { MongoDataSourceImpl, type MongoDataSource } from '../../mongo-data-source.ts';

export interface ProductDataSource extends MongoDataSource<ProductDoc> {}

export class ProductDataSourceImpl extends MongoDataSourceImpl<ProductDoc> implements ProductDataSource {}
