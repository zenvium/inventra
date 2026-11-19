import type { Repository } from '@cellix/domain-seedwork/repository';
import type { User, UserProps } from './user.aggregate.ts';

export interface UserRepository<props extends UserProps> extends Repository<User<props>> {
	getNewInstance(organizationId: string, name: string, email: string, role: UserProps['role'], isActive: boolean): Promise<User<props>>;
	getById(id: string): Promise<User<props>>;
}
