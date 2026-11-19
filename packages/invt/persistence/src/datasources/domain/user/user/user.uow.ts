import { InProcEventBusInstance, NodeEventBusInstance } from '@cellix/event-bus-seedwork-node';
import type { UserModelType } from '@invt/data-sources-mongoose-models';
import { MongooseSeedwork } from '@cellix/mongoose-seedwork';
import type { Domain } from '@invt/domain';
import { UserConverter } from './user.domain-adapter.ts';
import { UserRepository } from './user.repository.ts';

export const getUserUnitOfWork = (model: UserModelType, passport: Domain.Passport): Domain.Contexts.User.User.UserUnitOfWork => {
	const unitOfWork = new MongooseSeedwork.MongoUnitOfWork(InProcEventBusInstance, NodeEventBusInstance, model, new UserConverter(), UserRepository);
	return MongooseSeedwork.getInitializedUnitOfWork(unitOfWork, passport);
};
