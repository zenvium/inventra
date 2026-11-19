import { InProcEventBusInstance, NodeEventBusInstance } from '@cellix/event-bus-seedwork-node';
import type { CustomerModelType } from '@invt/data-sources-mongoose-models';
import { MongooseSeedwork } from '@cellix/mongoose-seedwork';
import type { Domain } from '@invt/domain';
import { CustomerConverter } from './customer.domain-adapter.ts';
import { CustomerRepository } from './customer.repository.ts';

export const getCustomerUnitOfWork = (model: CustomerModelType, passport: Domain.Passport): Domain.Contexts.Partner.Customer.CustomerUnitOfWork => {
	const unitOfWork = new MongooseSeedwork.MongoUnitOfWork(InProcEventBusInstance, NodeEventBusInstance, model, new CustomerConverter(), CustomerRepository);
	return MongooseSeedwork.getInitializedUnitOfWork(unitOfWork, passport);
};
