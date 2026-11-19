import { ObjectId, type Document } from 'mongodb';
import type { Connection } from 'mongoose';
import { customerSeed } from './customer.ts';
import { inventorySeed } from './inventory.ts';
import { organizationSeed } from './organization.ts';
import { productSeed } from './product.ts';
import { purchaseOrderSeed } from './purchase-order.ts';
import { salesOrderSeed } from './sales-order.ts';
import { stockMovementSeed } from './stock-movement.ts';
import { supplierSeed } from './supplier.ts';
import { userSeed } from './user.ts';
import { warehouseSeed } from './warehouse.ts';

function asMongoDocuments(seed: readonly Record<string, unknown>[]): Document[] {
	return seed.map(({ _id, ...fields }) => ({ _id: new ObjectId(String(_id)), ...fields }));
}

export async function seedDatabase(connection: Connection): Promise<void> {
	const seeds = [
		['organization', organizationSeed],
		['user', userSeed],
		['product', productSeed],
		['warehouse', warehouseSeed],
		['inventory', inventorySeed],
		['supplier', supplierSeed],
		['customer', customerSeed],
		['purchaseOrder', purchaseOrderSeed],
		['salesOrder', salesOrderSeed],
		['stockMovement', stockMovementSeed],
	] as const;

	for (const [collection, seed] of seeds) {
		await connection.collection(collection).insertMany(asMongoDocuments(seed));
	}
}
