import { MongooseSeedwork } from '@cellix/mongoose-seedwork';
import type { User as UserDoc } from '@invt/data-sources-mongoose-models';
import { Domain } from '@invt/domain';

export class UserDomainAdapter extends MongooseSeedwork.MongooseDomainAdapter<UserDoc> implements Domain.Contexts.User.User.UserProps {
	get organizationId(): string {
		return this.doc.organizationId;
	}
	set organizationId(organizationId: string) {
		this.doc.organizationId = organizationId;
	}
	get name(): string {
		return this.doc.name;
	}
	set name(name: string) {
		this.doc.name = name;
	}
	get email(): string {
		return this.doc.email;
	}
	set email(email: string) {
		this.doc.email = email;
	}
	get role(): Domain.Contexts.User.User.UserRole {
		return this.doc.role;
	}
	set role(role: Domain.Contexts.User.User.UserRole) {
		this.doc.role = role;
	}
	get isActive(): boolean {
		return this.doc.isActive;
	}
	set isActive(isActive: boolean) {
		this.doc.isActive = isActive;
	}
}

export class UserConverter extends MongooseSeedwork.MongoTypeConverter<
	UserDoc,
	UserDomainAdapter,
	Domain.Passport,
	Domain.Contexts.User.User.User<UserDomainAdapter>
> {
	constructor() {
		super(UserDomainAdapter, Domain.Contexts.User.User.User);
	}
}
