import mongoose, { type ConnectOptions, type Mongoose } from 'mongoose';
import type { ServiceBase } from '@cellix/api-services-spec';
import type { MongooseSeedwork } from '@cellix/mongoose-seedwork';

export type ServiceMongooseOptions = ConnectOptions & { debug?: boolean };

export class ServiceMongoose implements ServiceBase<MongooseSeedwork.MongooseContextFactory>, MongooseSeedwork.MongooseContextFactory {
	private serviceInternal: Mongoose | undefined;
	private readonly uri: string;
	private readonly options: ServiceMongooseOptions;

	public constructor(uri: string, options: ServiceMongooseOptions = {}) {
		this.uri = uri;
		this.options = options;
		if (!uri.trim()) throw new Error('MongoDB uri is required');
	}

	public async startUp(): Promise<MongooseSeedwork.MongooseContextFactory> {
		const { debug, ...connectionOptions } = this.options;
		this.serviceInternal = await mongoose.connect(this.uri, connectionOptions);
		if (debug) this.serviceInternal.set('debug', true);
		return this;
	}

	public async shutDown(): Promise<void> {
		if (!this.serviceInternal) return;
		await this.serviceInternal.disconnect();
		this.serviceInternal = undefined;
	}

	public get service(): Mongoose {
		if (!this.serviceInternal) throw new Error('ServiceMongoose is not started - cannot access service');
		return this.serviceInternal;
	}
}
