import type { User as UserDoc } from '@invt/data-sources-mongoose-models';
import { Domain } from '@invt/domain';
import { MongooseSeedwork } from '@cellix/mongoose-seedwork';
import type { UserDomainAdapter } from './user.domain-adapter.ts';

export class UserRepository
		extends MongooseSeedwork.MongoRepositoryBase<UserDoc, UserDomainAdapter, Domain.Passport, Domain.Contexts.User.User.User<UserDomainAdapter>>
		implements Domain.Contexts.User.User.UserRepository<UserDomainAdapter>
{
	async getById(id: string): Promise<Domain.Contexts.User.User.User<UserDomainAdapter>> {
		const document = await this.model.findById(id).exec();
		if (!document) {
			throw new Error(`User with id ${id} not found`);
		}
		return this.typeConverter.toDomain(document, this.passport);
	}

	// biome-ignore lint:noRequireAwait
	async getNewInstance(
		organizationId: string,
		name: string,
		email: string,
		role: Domain.Contexts.User.User.UserRole,
		isActive: boolean,
	): Promise<Domain.Contexts.User.User.User<UserDomainAdapter>> {
		const adapter = this.typeConverter.toAdapter(new this.model());
		return Promise.resolve(
			Domain.Contexts.User.User.User.getNewInstance(adapter, organizationId, name, email, role, isActive, this.passport),
		);
	}
}
