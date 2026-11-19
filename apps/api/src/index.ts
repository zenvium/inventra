import { Cellix } from '@cellix/api-core';
import type { ApplicationServices } from '@invt/application-services';
import { buildApplicationServicesFactory } from '@invt/application-services';
import { ServiceMongoose } from '@cellix/service-mongoose';
import { ServiceApolloServer } from '@cellix/service-apollo-server';
import type { GraphContext } from '@invt/graphql';
import { combinedSchema } from '@invt/graphql';
import { graphHandlerCreator } from '@invt/graphql-handler';
import { healthHandler } from './functions/health.ts';
import * as MongooseConfig from './service-config/mongoose/index.ts';

interface ApiContext {
	mongooseService: ServiceMongoose;
	apolloServerService: ServiceApolloServer<GraphContext>;
}

Cellix.initializeInfrastructureServices<ApiContext, ApplicationServices>((serviceRegistry) => {
	serviceRegistry
		.registerInfrastructureService(new ServiceMongoose(MongooseConfig.mongooseConnectionString, MongooseConfig.mongooseConnectOptions))
		.registerInfrastructureService(new ServiceApolloServer<GraphContext>({ schema: combinedSchema }));
})
	.setContext((serviceRegistry) => ({
		mongooseService: serviceRegistry.getInfrastructureService(ServiceMongoose),
		apolloServerService: serviceRegistry.getInfrastructureService(ServiceApolloServer),
	}))
	.initializeApplicationServices((context) => buildApplicationServicesFactory(context.mongooseService))
	.registerAzureFunctionHttpHandler('graphql', { methods: ['GET', 'POST', 'OPTIONS', 'HEAD'], authLevel: 'anonymous', route: 'graphql/{*segments}' }, (applicationServices, infrastructureRegistry) =>
		graphHandlerCreator(infrastructureRegistry.getInfrastructureService(ServiceApolloServer), applicationServices),
	)
	.registerAzureFunctionHttpHandler('health', { methods: ['GET'], authLevel: 'anonymous', route: 'health' }, (applicationServices) => healthHandler(applicationServices))
	.startUp();
