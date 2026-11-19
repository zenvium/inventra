import { InProcEventBusInstance, NodeEventBusInstance } from '@cellix/event-bus-seedwork-node';
import type { SupplierModelType } from '@invt/data-sources-mongoose-models';
import { MongooseSeedwork } from '@cellix/mongoose-seedwork';
import type { Domain } from '@invt/domain';
import { SupplierConverter } from './supplier.domain-adapter.ts';
import { SupplierRepository } from './supplier.repository.ts';

export const getSupplierUnitOfWork = (model: SupplierModelType, passport: Domain.Passport): Domain.Contexts.Partner.Supplier.SupplierUnitOfWork => {
	const unitOfWork = new MongooseSeedwork.MongoUnitOfWork(InProcEventBusInstance, NodeEventBusInstance, model, new SupplierConverter(), SupplierRepository);
	return MongooseSeedwork.getInitializedUnitOfWork(unitOfWork, passport);
};
