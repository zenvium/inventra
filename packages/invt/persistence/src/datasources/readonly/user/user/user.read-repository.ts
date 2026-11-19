import type { UserModelType } from '@invt/data-sources-mongoose-models';
import type { Domain } from '@invt/domain';
import { UserConverter } from '../../../domain/user/user/user.domain-adapter.ts';
import type { FindOneOptions, FindOptions } from '../../mongo-data-source.ts';
import { UserDataSourceImpl, type UserDataSource } from './user.data.ts';

export interface UserReadRepository {
	getAll: (options?: FindOptions) => Promise<Domain.Contexts.User.User.UserEntityReference[]>;
	getById: (id: string, options?: FindOneOptions) => Promise<Domain.Contexts.User.User.UserEntityReference | null>;
}

class UserReadRepositoryImpl implements UserReadRepository {
	private readonly mongoDataSource: UserDataSource;
	private readonly converter: UserConverter;
	private readonly passport: Domain.Passport;

	constructor(models: { User: UserModelType }, passport: Domain.Passport) {
		this.mongoDataSource = new UserDataSourceImpl(models.User);
		this.converter = new UserConverter();
		this.passport = passport;
	}

	async getAll(options?: FindOptions): Promise<Domain.Contexts.User.User.UserEntityReference[]> {
		const result = await this.mongoDataSource.find({}, options);
		return result.map((doc) => this.converter.toDomain(doc, this.passport));
	}

	async getById(id: string, options?: FindOneOptions): Promise<Domain.Contexts.User.User.UserEntityReference | null> {
		const result = await this.mongoDataSource.findById(id, options);
		if (!result) {
			return null;
		}
		return this.converter.toDomain(result, this.passport);
	}
}

export const getUserReadRepository = (models: { User: UserModelType }, passport: Domain.Passport): UserReadRepository => {
	return new UserReadRepositoryImpl(models, passport);
};
