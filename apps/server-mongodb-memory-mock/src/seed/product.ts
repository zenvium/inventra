/** Insert productSeed into the Product collection. One object is the example. A catalog task adds the other rows to this array. Start the application and read them back through the endpoint. Do not copy this document into a handler, a read repository, or an in-memory catalog. */
export const productSeed = [
	{
		_id: '000000000000000000000001',
		schemaVersion: '1.0.0',
		version: 0,
		organizationId: 'Example organizationId',
		sku: 'Example sku',
		name: 'Example name',
		description: null,
		category: null,
		price: 1,
		cost: 1,
		unit: 'Example unit',
		reorderPoint: 1,
		isActive: false,
		createdAt: new Date('2024-01-01T00:00:00.000Z'),
		updatedAt: new Date('2024-01-01T00:00:00.000Z'),
	},
];
