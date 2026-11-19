import type { ServiceMongooseOptions } from '@cellix/service-mongoose';

const nodeEnv = process.env['NODE_ENV'];

export const mongooseConnectionString = process.env['MONGODB_URI'] ?? '';

export const mongooseConnectOptions: ServiceMongooseOptions = {
	autoIndex: true,
	autoCreate: true,
	debug: nodeEnv !== 'production',
};
