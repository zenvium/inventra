import { MongooseSeedwork } from '@cellix/mongoose-seedwork';
import { type Model, Schema } from 'mongoose';

export interface SalesOrderItemDoc {
	productId: string;
	warehouseId: string;
	quantity: number;
	unitPrice: number;
}

export interface SalesOrder extends MongooseSeedwork.Base {
	organizationId: string;
	customerId: string;
	status: 'DRAFT' | 'CONFIRMED' | 'FULFILLED' | 'CANCELLED';
	items: SalesOrderItemDoc[];
}

const SalesOrderItemSchema = new Schema<SalesOrderItemDoc>(
	{
		productId: { type: String, required: true },
		warehouseId: { type: String, required: true },
		quantity: { type: Number, required: true },
		unitPrice: { type: Number, required: true },
	},
	{ _id: false, timestamps: true, versionKey: 'version' },
);

const SalesOrderSchema = new Schema<SalesOrder, Model<SalesOrder>, SalesOrder>(
	{
		schemaVersion: { type: String, default: '1.0.0' },
		organizationId: { type: String, required: true },
		customerId: { type: String, required: true },
		status: { type: String, required: true },
		items: { type: [SalesOrderItemSchema], required: true },
	},
	{ timestamps: true, versionKey: 'version', collection: 'salesOrder' },
);

export const SalesOrderModelName = 'SalesOrder';
export const SalesOrderModelFactory = MongooseSeedwork.modelFactory<SalesOrder>(SalesOrderModelName, SalesOrderSchema);
export type SalesOrderModelType = ReturnType<typeof SalesOrderModelFactory>;
