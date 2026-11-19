import { MongooseSeedwork } from '@cellix/mongoose-seedwork';
import { type Model, Schema } from 'mongoose';

export interface Inventory extends MongooseSeedwork.Base {
	organizationId: string;
	productId: string;
	warehouseId: string;
	quantityOnHand: number;
	quantityReserved: number;
}

const InventorySchema = new Schema<Inventory, Model<Inventory>, Inventory>(
	{
		schemaVersion: { type: String, default: '1.0.0' },
		organizationId: { type: String, required: true },
		productId: { type: String, required: true },
		warehouseId: { type: String, required: true },
		quantityOnHand: { type: Number, required: true },
		quantityReserved: { type: Number, required: true },
	},
	{ timestamps: true, versionKey: 'version', collection: 'inventory' },
);

export const InventoryModelName = 'Inventory';
export const InventoryModelFactory = MongooseSeedwork.modelFactory<Inventory>(InventoryModelName, InventorySchema);
export type InventoryModelType = ReturnType<typeof InventoryModelFactory>;
