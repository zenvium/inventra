/** Insert purchaseOrderSeed into the PurchaseOrder collection. One object is the example. A catalog task adds the other rows to this array. Start the application and read them back through the endpoint. Do not copy this document into a handler, a read repository, or an in-memory catalog. */
export const purchaseOrderSeed = [
	{
		_id: '000000000000000000000001',
		schemaVersion: '1.0.0',
		version: 0,
		organizationId: 'Example organizationId',
		supplierId: 'Example supplierId',
		warehouseId: 'Example warehouseId',
		status: 'DRAFT',
		items: [
			{
				productId: 'Example productId',
				quantityOrdered: 1,
				quantityReceived: 1,
				unitCost: 1,
			},
		],
		expectedDeliveryDate: null,
		createdAt: new Date('2024-01-01T00:00:00.000Z'),
		updatedAt: new Date('2024-01-01T00:00:00.000Z'),
	},
];
