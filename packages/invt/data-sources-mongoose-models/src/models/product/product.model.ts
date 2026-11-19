import { MongooseSeedwork } from '@cellix/mongoose-seedwork';
import { type Model, Schema } from 'mongoose';

export interface Product extends MongooseSeedwork.Base {
	organizationId: string;
	sku: string;
	name: string;
	description: string | null;
	category: string | null;
	price: number;
	cost: number;
	unit: string;
	reorderPoint: number;
	isActive: boolean;
}

const ProductSchema = new Schema<Product, Model<Product>, Product>(
	{
		schemaVersion: { type: String, default: '1.0.0' },
		organizationId: { type: String, required: true },
		sku: { type: String, required: true },
		name: { type: String, required: true },
		description: { type: String, required: false, default: null },
		category: { type: String, required: false, default: null },
		price: { type: Number, required: true },
		cost: { type: Number, required: true },
		unit: { type: String, required: true },
		reorderPoint: { type: Number, required: true },
		isActive: { type: Boolean, required: true },
	},
	{ timestamps: true, versionKey: 'version', collection: 'product' },
);

export const ProductModelName = 'Product';
export const ProductModelFactory = MongooseSeedwork.modelFactory<Product>(ProductModelName, ProductSchema);
export type ProductModelType = ReturnType<typeof ProductModelFactory>;
