import { InProcEventBusInstance, NodeEventBusInstance } from '@cellix/event-bus-seedwork-node';
import type { OrganizationModelType } from '@invt/data-sources-mongoose-models';
import { MongooseSeedwork } from '@cellix/mongoose-seedwork';
import type { Domain } from '@invt/domain';
import { OrganizationConverter } from './organization.domain-adapter.ts';
import { OrganizationRepository } from './organization.repository.ts';

export const getOrganizationUnitOfWork = (model: OrganizationModelType, passport: Domain.Passport): Domain.Contexts.Organization.Organization.OrganizationUnitOfWork => {
	const unitOfWork = new MongooseSeedwork.MongoUnitOfWork(InProcEventBusInstance, NodeEventBusInstance, model, new OrganizationConverter(), OrganizationRepository);
	return MongooseSeedwork.getInitializedUnitOfWork(unitOfWork, passport);
};
