import type { UserEntityReference } from './user/user.aggregate.ts';
import type { UserVisa } from './user.visa.ts';

export interface UserPassport {
	forUser(root: UserEntityReference): UserVisa;
}
