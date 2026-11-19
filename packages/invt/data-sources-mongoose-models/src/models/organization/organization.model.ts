import { MongooseSeedwork } from '@cellix/mongoose-seedwork';
import { type Model, Schema } from 'mongoose';

export interface Organization extends MongooseSeedwork.Base {
	name: string;
	slug: string;
}

const OrganizationSchema = new Schema<Organization, Model<Organization>, Organization>(
	{
		schemaVersion: { type: String, default: '1.0.0' },
		name: { type: String, required: true, minlength: 1, maxlength: 200 },
		slug: { type: String, required: true, minlength: 1, maxlength: 200 },
	},
	{ timestamps: true, versionKey: 'version', collection: 'organization' },
);

export const OrganizationModelName = 'Organization';
export const OrganizationModelFactory = MongooseSeedwork.modelFactory<Organization>(OrganizationModelName, OrganizationSchema);
export type OrganizationModelType = ReturnType<typeof OrganizationModelFactory>;
