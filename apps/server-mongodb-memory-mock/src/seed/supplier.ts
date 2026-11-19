/** Insert supplierSeed into the Supplier collection. One object is the example. A catalog task adds the other rows to this array. Start the application and read them back through the endpoint. Do not copy this document into a handler, a read repository, or an in-memory catalog. */
export const supplierSeed = [
	{
		_id: '000000000000000000000001',
		schemaVersion: '1.0.0',
		version: 0,
		organizationId: 'Example organizationId',
		name: 'Example name',
		contactName: null,
		email: null,
		phone: null,
		address: {
			street: 'Example street',
			city: 'Example city',
			state: null,
			postalCode: 'Example postalCode',
			country: 'Example country',
		},
		isActive: false,
		createdAt: new Date('2024-01-01T00:00:00.000Z'),
		updatedAt: new Date('2024-01-01T00:00:00.000Z'),
	},
];
