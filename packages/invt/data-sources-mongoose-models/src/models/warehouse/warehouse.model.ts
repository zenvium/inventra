import { MongooseSeedwork } from '@cellix/mongoose-seedwork';
import { type Model, Schema } from 'mongoose';

export interface AddressDoc {
	street: string;
	city: string;
	state: string | null;
	postalCode: string;
	country: string;
}

export interface Warehouse extends MongooseSeedwork.Base {
	organizationId: string;
	name: string;
	code: string;
	address: AddressDoc | null;
	isActive: boolean;
}

const AddressSchema = new Schema<AddressDoc>(
	{
		street: { type: String, required: true },
		city: { type: String, required: true },
		state: { type: String, required: false, default: null },
		postalCode: { type: String, required: true },
		country: { type: String, required: true },
	},
	{ _id: false, timestamps: true, versionKey: 'version' },
);

const WarehouseSchema = new Schema<Warehouse, Model<Warehouse>, Warehouse>(
	{
		schemaVersion: { type: String, default: '1.0.0' },
		organizationId: { type: String, required: true },
		name: { type: String, required: true },
		code: { type: String, required: true },
		address: { type: AddressSchema, required: false, default: null },
		isActive: { type: Boolean, required: true },
	},
	{ timestamps: true, versionKey: 'version', collection: 'warehouse' },
);

export const WarehouseModelName = 'Warehouse';
export const WarehouseModelFactory = MongooseSeedwork.modelFactory<Warehouse>(WarehouseModelName, WarehouseSchema);
export type WarehouseModelType = ReturnType<typeof WarehouseModelFactory>;
