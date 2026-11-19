import type { Repository } from '@cellix/domain-seedwork/repository';
import type { Organization, OrganizationProps } from './organization.aggregate.ts';

export interface OrganizationRepository<props extends OrganizationProps> extends Repository<Organization<props>> {
	getNewInstance(name: string, slug: string): Promise<Organization<props>>;
	getById(id: string): Promise<Organization<props>>;
}
