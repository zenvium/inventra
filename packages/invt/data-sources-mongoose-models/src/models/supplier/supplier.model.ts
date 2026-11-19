import { MongooseSeedwork } from '@cellix/mongoose-seedwork';
import { type Model, Schema } from 'mongoose';

export interface AddressDoc {
	street: string;
	city: string;
	state: string | null;
	postalCode: string;
	country: string;
}

export interface Supplier extends MongooseSeedwork.Base {
	organizationId: string;
	name: string;
	contactName: string | null;
	email: string | null;
	phone: string | null;
	address: AddressDoc | null;
	isActive: boolean;
}

const AddressSchema = new Schema<AddressDoc, Model<AddressDoc>, AddressDoc>(
	{
		street: { type: String, required: true },
		city: { type: String, required: true },
		state: { type: String, required: false, default: null },
		postalCode: { type: String, required: true },
		country: { type: String, required: true },
	},
	{ _id: false, timestamps: true, versionKey: 'version' },
);

const SupplierSchema = new Schema<Supplier, Model<Supplier>, Supplier>(
	{
		schemaVersion: { type: String, default: '1.0.0' },
		organizationId: { type: String, required: true },
		name: { type: String, required: true },
		contactName: { type: String, required: false, default: null },
		email: { type: String, required: false, default: null },
		phone: { type: String, required: false, default: null },
		address: { type: AddressSchema, required: false, default: null },
		isActive: { type: Boolean, required: true },
	},
	{ timestamps: true, versionKey: 'version', collection: 'supplier' },
);

export const SupplierModelName = 'Supplier';
export const SupplierModelFactory = MongooseSeedwork.modelFactory<Supplier>(SupplierModelName, SupplierSchema);
export type SupplierModelType = ReturnType<typeof SupplierModelFactory>;
