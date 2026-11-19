import type { OrganizationModelType } from '@invt/data-sources-mongoose-models';
import type { Domain } from '@invt/domain';
import { OrganizationConverter } from '../../../domain/organization/organization/organization.domain-adapter.ts';
import type { FindOneOptions, FindOptions } from '../../mongo-data-source.ts';
import { OrganizationDataSourceImpl, type OrganizationDataSource } from './organization.data.ts';

export interface OrganizationReadRepository {
	getAll: (options?: FindOptions) => Promise<Domain.Contexts.Organization.Organization.OrganizationEntityReference[]>;
	getById: (id: string, options?: FindOneOptions) => Promise<Domain.Contexts.Organization.Organization.OrganizationEntityReference | null>;
}

class OrganizationReadRepositoryImpl implements OrganizationReadRepository {
	private readonly mongoDataSource: OrganizationDataSource;
	private readonly converter: OrganizationConverter;
	private readonly passport: Domain.Passport;

	constructor(models: { Organization: OrganizationModelType }, passport: Domain.Passport) {
		this.mongoDataSource = new OrganizationDataSourceImpl(models.Organization);
		this.converter = new OrganizationConverter();
		this.passport = passport;
	}

	async getAll(options?: FindOptions): Promise<Domain.Contexts.Organization.Organization.OrganizationEntityReference[]> {
		const result = await this.mongoDataSource.find({}, options);
		return result.map((doc) => this.converter.toDomain(doc, this.passport));
	}

	async getById(id: string, options?: FindOneOptions): Promise<Domain.Contexts.Organization.Organization.OrganizationEntityReference | null> {
		const result = await this.mongoDataSource.findById(id, options);
		if (!result) {
			return null;
		}
		return this.converter.toDomain(result, this.passport);
	}
}

export const getOrganizationReadRepository = (models: { Organization: OrganizationModelType }, passport: Domain.Passport): OrganizationReadRepository => {
	return new OrganizationReadRepositoryImpl(models, passport);
};
