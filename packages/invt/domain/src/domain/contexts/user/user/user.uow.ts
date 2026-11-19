import type { InitializedUnitOfWork, UnitOfWork } from '@cellix/domain-seedwork/unit-of-work';
import type { Passport } from '../../passport.ts';
import type { User, UserProps } from './user.aggregate.ts';
import type { UserRepository } from './user.repository.ts';

export interface UserUnitOfWork
		extends UnitOfWork<Passport, UserProps, User<UserProps>, UserRepository<UserProps>>,
			InitializedUnitOfWork<Passport, UserProps, User<UserProps>, UserRepository<UserProps>> {}
