import { ApolloServer, type BaseContext } from '@apollo/server';
import type { ServiceBase } from '@cellix/api-services-spec';
import type { GraphQLSchema } from 'graphql';

export interface ServiceApolloServerOptions {
	schema: GraphQLSchema;
	introspection?: boolean;
}

export class ServiceApolloServer<TContext extends BaseContext = BaseContext> implements ServiceBase<ApolloServer<TContext>> {
	private serverInternal: ApolloServer<TContext> | undefined;
	private readonly options: ServiceApolloServerOptions;

	constructor(options: ServiceApolloServerOptions) {
		this.options = options;
	}

	public async startUp(): Promise<ApolloServer<TContext>> {
		this.serverInternal = new ApolloServer<TContext>({
			schema: this.options.schema,
			introspection: this.options.introspection ?? process.env['NODE_ENV'] !== 'production',
		});
		await this.serverInternal.start();
		return this.serverInternal;
	}

	public async shutDown(): Promise<void> {
		if (!this.serverInternal) throw new Error('ServiceApolloServer is not started');
		await this.serverInternal.stop();
		this.serverInternal = undefined;
	}

	public get server(): ApolloServer<TContext> {
		if (!this.serverInternal) throw new Error('ServiceApolloServer is not started');
		return this.serverInternal;
	}
}
