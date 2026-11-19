import { type MongoMemoryServerConfig, startMockMongoDB } from '@cellix/server-mongodb-memory-mock-seedwork';
import { seedDatabase } from './seed/seed.ts';

const port = Number(process.env['PORT'] ?? 50000);
const config: MongoMemoryServerConfig = {
	port,
	dbName: process.env['DB_NAME'] ?? 'inventra',
	replSetName: process.env['REPL_SET_NAME'] ?? 'inventra',
	collectionsToSeed: [],
	seedDatabase,
};

startMockMongoDB(config).catch((error: unknown) => {
	console.error('Failed to start Inventra mock MongoDB:', error);
	process.exit(1);
});
