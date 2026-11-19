import { MongooseSeedwork } from '@cellix/mongoose-seedwork';
import { type Model, Schema } from 'mongoose';

export interface PurchaseOrderItemDoc {
	productId: string;
	quantityOrdered: number;
	quantityReceived: number;
	unitCost: number;
}

export interface PurchaseOrder extends MongooseSeedwork.Base {
	organizationId: string;
	supplierId: string;
	warehouseId: string;
	status: 'DRAFT' | 'SUBMITTED' | 'PARTIALLY_RECEIVED' | 'RECEIVED' | 'CANCELLED';
	items: PurchaseOrderItemDoc[];
	expectedDeliveryDate: Date | null;
}

const PurchaseOrderItemSchema = new Schema<PurchaseOrderItemDoc>(
	{
		productId: { type: String, required: true },
		quantityOrdered: { type: Number, required: true },
		quantityReceived: { type: Number, required: true },
		unitCost: { type: Number, required: true },
	},
	{ _id: false, timestamps: true, versionKey: 'version' },
);

const PurchaseOrderSchema = new Schema<PurchaseOrder, Model<PurchaseOrder>, PurchaseOrder>(
	{
		schemaVersion: { type: String, default: '1.0.0' },
		organizationId: { type: String, required: true },
		supplierId: { type: String, required: true },
		warehouseId: { type: String, required: true },
		status: { type: String, required: true },
		items: { type: [PurchaseOrderItemSchema], required: true },
		expectedDeliveryDate: { type: Date, required: false, default: null },
	},
	{ timestamps: true, versionKey: 'version', collection: 'purchaseOrder' },
);

export const PurchaseOrderModelName = 'PurchaseOrder';
export const PurchaseOrderModelFactory = MongooseSeedwork.modelFactory<PurchaseOrder>(PurchaseOrderModelName, PurchaseOrderSchema);
export type PurchaseOrderModelType = ReturnType<typeof PurchaseOrderModelFactory>;
