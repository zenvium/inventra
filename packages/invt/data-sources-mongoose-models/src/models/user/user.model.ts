import { MongooseSeedwork } from '@cellix/mongoose-seedwork';
import { type Model, Schema } from 'mongoose';

export interface User extends MongooseSeedwork.Base {
	organizationId: string;
	name: string;
	email: string;
	role: 'ADMIN' | 'MANAGER' | 'EMPLOYEE' | 'VIEWER';
	isActive: boolean;
}

const UserSchema = new Schema<User, Model<User>, User>(
	{
		schemaVersion: { type: String, default: '1.0.0' },
		organizationId: { type: String, required: true },
		name: { type: String, required: true },
		email: { type: String, required: true },
		role: { type: String, required: true, enum: ['ADMIN', 'MANAGER', 'EMPLOYEE', 'VIEWER'] },
		isActive: { type: Boolean, required: true },
	},
	{ timestamps: true, versionKey: 'version', collection: 'user' },
);

export const UserModelName = 'User';
export const UserModelFactory = MongooseSeedwork.modelFactory<User>(UserModelName, UserSchema);
export type UserModelType = ReturnType<typeof UserModelFactory>;
