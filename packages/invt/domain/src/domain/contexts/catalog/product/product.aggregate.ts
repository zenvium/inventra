import { AggregateRoot } from '@cellix/domain-seedwork/aggregate-root';
import { PermissionError } from '@cellix/domain-seedwork/domain-entity';
import type { DomainEntityProps } from '@cellix/domain-seedwork/domain-entity';
import type { Passport } from '../../passport.ts';
import type { CatalogVisa } from '../catalog.visa.ts';

export interface ProductProps extends DomainEntityProps {
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
	readonly createdAt: Date;
	readonly updatedAt: Date;
	readonly schemaVersion: string;
}

export interface ProductEntityReference extends Readonly<ProductProps> {}

export class Product<props extends ProductProps> extends AggregateRoot<props, Passport> implements ProductEntityReference {
	private isNew = false;
	private readonly visa: CatalogVisa;

	constructor(props: props, passport: Passport) {
		super(props, passport);
		this.visa = passport.catalog.forProduct(this);
	}

	public static getNewInstance<props extends ProductProps>(
		newProps: props,
		organizationId: string,
		sku: string,
		name: string,
		description: string | null,
		category: string | null,
		price: number,
		cost: number,
		unit: string,
		reorderPoint: number,
		isActive: boolean,
		passport: Passport,
	): Product<props> {
		const product = new Product(newProps, passport);
		product.markAsNew();
		product.organizationId = organizationId;
		product.sku = sku;
		product.name = name;
		product.description = description;
		product.category = category;
		product.price = price;
		product.cost = cost;
		product.unit = unit;
		product.reorderPoint = reorderPoint;
		product.isActive = isActive;
		product.isNew = false;
		return product;
	}

	private markAsNew(): void {
		this.isNew = true;
	}

	get organizationId(): string {
		return this.props.organizationId;
	}
	set organizationId(organizationId: string) {
		this.ensureCanManage();
		this.props.organizationId = organizationId;
	}
	get sku(): string {
		return this.props.sku;
	}
	set sku(sku: string) {
		this.ensureCanManage();
		this.props.sku = sku;
	}
	get name(): string {
		return this.props.name;
	}
	set name(name: string) {
		this.ensureCanManage();
		this.props.name = name;
	}
	get description(): string | null {
		return this.props.description;
	}
	set description(description: string | null) {
		this.ensureCanManage();
		this.props.description = description;
	}
	get category(): string | null {
		return this.props.category;
	}
	set category(category: string | null) {
		this.ensureCanManage();
		this.props.category = category;
	}
	get price(): number {
		return this.props.price;
	}
	set price(price: number) {
		this.ensureCanManage();
		this.props.price = price;
	}
	get cost(): number {
		return this.props.cost;
	}
	set cost(cost: number) {
		this.ensureCanManage();
		this.props.cost = cost;
	}
	get unit(): string {
		return this.props.unit;
	}
	set unit(unit: string) {
		this.ensureCanManage();
		this.props.unit = unit;
	}
	get reorderPoint(): number {
		return this.props.reorderPoint;
	}
	set reorderPoint(reorderPoint: number) {
		this.ensureCanManage();
		this.props.reorderPoint = reorderPoint;
	}
	get isActive(): boolean {
		return this.props.isActive;
	}
	set isActive(isActive: boolean) {
		this.ensureCanManage();
		this.props.isActive = isActive;
	}
	get createdAt(): Date {
		return this.props.createdAt;
	}
	get updatedAt(): Date {
		return this.props.updatedAt;
	}
	get schemaVersion(): string {
		return this.props.schemaVersion;
	}
	private ensureCanManage(): void {
		if (!this.isNew && !this.visa.determineIf((permissions) => permissions.canManageProduct)) {
			throw new PermissionError('Cannot update product: insufficient permissions');
		}
	}

}
