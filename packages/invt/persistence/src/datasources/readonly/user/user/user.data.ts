import type { User } from '@invt/data-sources-mongoose-models';
import { MongoDataSourceImpl, type MongoDataSource } from '../../mongo-data-source.ts';

export interface UserDataSource extends MongoDataSource<User> {}

export class UserDataSourceImpl extends MongoDataSourceImpl<User> implements UserDataSource {}
