import { MongooseSeedwork } from '@cellix/mongoose-seedwork';
import { type Model, Schema } from 'mongoose';

export interface StockMovement extends MongooseSeedwork.Base {
	organizationId: string;
	productId: string;
	warehouseId: string;
	type: 'RECEIPT' | 'SALE' | 'ADJUSTMENT' | 'TRANSFER_IN' | 'TRANSFER_OUT';
	quantityChange: number;
	referenceId: string | null;
	reason: string | null;
	performedBy: string | null;
}

const StockMovementSchema = new Schema<StockMovement, Model<StockMovement>, StockMovement>(
	{
		schemaVersion: { type: String, default: '1.0.0' },
		organizationId: { type: String, required: true },
		productId: { type: String, required: true },
		warehouseId: { type: String, required: true },
		type: { type: String, required: true },
		quantityChange: { type: Number, required: true },
		referenceId: { type: String, required: false, default: null },
		reason: { type: String, required: false, default: null },
		performedBy: { type: String, required: false, default: null },
	},
	{ timestamps: true, versionKey: 'version', collection: 'stockMovement' },
);

export const StockMovementModelName = 'StockMovement';
export const StockMovementModelFactory = MongooseSeedwork.modelFactory<StockMovement>(StockMovementModelName, StockMovementSchema);
export type StockMovementModelType = ReturnType<typeof StockMovementModelFactory>;
