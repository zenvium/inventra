import { MongooseSeedwork } from '@cellix/mongoose-seedwork';
import { type Model, Schema } from 'mongoose';

export interface AddressDoc {
	street: string;
	city: string;
	state: string | null;
	postalCode: string;
	country: string;
}

export interface Customer extends MongooseSeedwork.Base {
	organizationId: string;
	name: string;
	email: string | null;
	phone: string | null;
	address: AddressDoc | null;
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

const CustomerSchema = new Schema<Customer, Model<Customer>, Customer>(
	{
		schemaVersion: { type: String, default: '1.0.0' },
		organizationId: { type: String, required: true },
		name: { type: String, required: true },
		email: { type: String, required: false, default: null },
		phone: { type: String, required: false, default: null },
		address: { type: AddressSchema, required: false, default: null },
	},
	{ timestamps: true, versionKey: 'version', collection: 'customer' },
);

export const CustomerModelName = 'Customer';
export const CustomerModelFactory = MongooseSeedwork.modelFactory<Customer>(CustomerModelName, CustomerSchema);
export type CustomerModelType = ReturnType<typeof CustomerModelFactory>;
