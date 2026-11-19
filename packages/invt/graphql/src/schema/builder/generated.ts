import type { GraphQLResolveInfo, GraphQLScalarType, GraphQLScalarTypeConfig } from 'graphql';
import type { GraphContext } from '../context.ts';
export type Maybe<T> = T | null;
export type InputMaybe<T> = Maybe<T>;
export type Exact<T extends { [key: string]: unknown }> = { [K in keyof T]: T[K] };
export type MakeOptional<T, K extends keyof T> = Omit<T, K> & { [SubKey in K]?: Maybe<T[SubKey]> };
export type MakeMaybe<T, K extends keyof T> = Omit<T, K> & { [SubKey in K]: Maybe<T[SubKey]> };
export type MakeEmpty<T extends { [key: string]: unknown }, K extends keyof T> = { [_ in K]?: never };
export type Incremental<T> = T | { [P in keyof T]?: P extends ' $fragmentName' | '__typename' ? T[P] : never };
export type RequireFields<T, K extends keyof T> = Omit<T, K> & { [P in K]-?: NonNullable<T[P]> };
/** All built-in and custom scalars, mapped to their actual values */
export type Scalars = {
  ID: { input: string; output: string; }
  String: { input: string; output: string; }
  Boolean: { input: boolean; output: boolean; }
  Int: { input: number; output: number; }
  Float: { input: number; output: number; }
  AccountNumber: { input: any; output: any; }
  BigInt: { input: any; output: any; }
  Byte: { input: any; output: any; }
  CountryCode: { input: any; output: any; }
  CountryName: { input: any; output: any; }
  Cuid: { input: any; output: any; }
  Cuid2: { input: any; output: any; }
  Currency: { input: any; output: any; }
  DID: { input: any; output: any; }
  Date: { input: any; output: any; }
  DateTime: { input: Date; output: Date; }
  DateTimeISO: { input: any; output: any; }
  DeweyDecimal: { input: any; output: any; }
  Duration: { input: any; output: any; }
  EmailAddress: { input: any; output: any; }
  GUID: { input: any; output: any; }
  GeoJSON: { input: any; output: any; }
  HSL: { input: any; output: any; }
  HSLA: { input: any; output: any; }
  HexColorCode: { input: any; output: any; }
  Hexadecimal: { input: any; output: any; }
  IBAN: { input: any; output: any; }
  IP: { input: any; output: any; }
  IPCPatent: { input: any; output: any; }
  IPv4: { input: any; output: any; }
  IPv6: { input: any; output: any; }
  ISBN: { input: any; output: any; }
  ISO8601Duration: { input: any; output: any; }
  JSON: { input: any; output: any; }
  JSONObject: { input: any; output: any; }
  JWT: { input: any; output: any; }
  LCCSubclass: { input: any; output: any; }
  Latitude: { input: any; output: any; }
  LocalDate: { input: any; output: any; }
  LocalDateTime: { input: any; output: any; }
  LocalEndTime: { input: any; output: any; }
  LocalTime: { input: any; output: any; }
  Locale: { input: any; output: any; }
  Long: { input: any; output: any; }
  Longitude: { input: any; output: any; }
  MAC: { input: any; output: any; }
  NegativeFloat: { input: any; output: any; }
  NegativeInt: { input: any; output: any; }
  NonEmptyString: { input: any; output: any; }
  NonNegativeFloat: { input: any; output: any; }
  NonNegativeInt: { input: any; output: any; }
  NonPositiveFloat: { input: any; output: any; }
  NonPositiveInt: { input: any; output: any; }
  ObjectID: { input: string; output: string; }
  PhoneNumber: { input: any; output: any; }
  Port: { input: any; output: any; }
  PositiveFloat: { input: any; output: any; }
  PositiveInt: { input: any; output: any; }
  PostalCode: { input: any; output: any; }
  RGB: { input: any; output: any; }
  RGBA: { input: any; output: any; }
  RoutingNumber: { input: any; output: any; }
  SESSN: { input: any; output: any; }
  SafeInt: { input: any; output: any; }
  SemVer: { input: any; output: any; }
  Time: { input: any; output: any; }
  TimeZone: { input: any; output: any; }
  Timestamp: { input: any; output: any; }
  ULID: { input: any; output: any; }
  URL: { input: any; output: any; }
  USCurrency: { input: any; output: any; }
  UUID: { input: any; output: any; }
  UnsignedFloat: { input: any; output: any; }
  UnsignedInt: { input: any; output: any; }
  UtcOffset: { input: any; output: any; }
  Void: { input: any; output: any; }
};

export type Address = {
  readonly __typename?: 'Address';
  readonly city: Scalars['String']['output'];
  readonly country: Scalars['String']['output'];
  readonly postalCode: Scalars['String']['output'];
  readonly state?: Maybe<Scalars['String']['output']>;
  readonly street: Scalars['String']['output'];
};

export type BlobAuthHeader = {
  readonly __typename?: 'BlobAuthHeader';
  readonly authHeader?: Maybe<Scalars['String']['output']>;
  readonly blobName?: Maybe<Scalars['String']['output']>;
  readonly blobPath?: Maybe<Scalars['String']['output']>;
  readonly indexTags?: Maybe<ReadonlyArray<Maybe<BlobIndexTag>>>;
  readonly metadataFields?: Maybe<ReadonlyArray<Maybe<BlobMetadataField>>>;
  readonly requestDate?: Maybe<Scalars['String']['output']>;
};

export type BlobIndexTag = {
  readonly __typename?: 'BlobIndexTag';
  readonly name: Scalars['String']['output'];
  readonly value: Scalars['String']['output'];
};

export type BlobMetadataField = {
  readonly __typename?: 'BlobMetadataField';
  readonly name: Scalars['String']['output'];
  readonly value: Scalars['String']['output'];
};

/** Required to enable Apollo Cache Control */
export type CacheControlScope =
  | 'PRIVATE'
  | 'PUBLIC';

export type Customer = MongoBase & {
  readonly __typename?: 'Customer';
  readonly address?: Maybe<Address>;
  readonly createdAt?: Maybe<Scalars['DateTime']['output']>;
  readonly email?: Maybe<Scalars['String']['output']>;
  readonly id: Scalars['ObjectID']['output'];
  readonly name: Scalars['String']['output'];
  readonly organizationId: Scalars['ObjectID']['output'];
  readonly phone?: Maybe<Scalars['String']['output']>;
  readonly schemaVersion?: Maybe<Scalars['String']['output']>;
  readonly updatedAt?: Maybe<Scalars['DateTime']['output']>;
};

export type Inventory = MongoBase & {
  readonly __typename?: 'Inventory';
  readonly createdAt?: Maybe<Scalars['DateTime']['output']>;
  readonly id: Scalars['ObjectID']['output'];
  readonly organizationId: Scalars['ObjectID']['output'];
  readonly productId: Scalars['ObjectID']['output'];
  readonly quantityOnHand: Scalars['Float']['output'];
  readonly quantityReserved: Scalars['Float']['output'];
  readonly schemaVersion?: Maybe<Scalars['String']['output']>;
  readonly updatedAt?: Maybe<Scalars['DateTime']['output']>;
  readonly warehouseId: Scalars['ObjectID']['output'];
};

/** Base type for all models in mongo. */
export type MongoBase = {
  readonly createdAt?: Maybe<Scalars['DateTime']['output']>;
  /** The ID of the object. */
  readonly id: Scalars['ObjectID']['output'];
  readonly schemaVersion?: Maybe<Scalars['String']['output']>;
  /** Automatically generated timestamp, updated on every save. */
  readonly updatedAt?: Maybe<Scalars['DateTime']['output']>;
};

/** Base type for all models in mongo. */
export type MongoSubdocument = {
  readonly createdAt?: Maybe<Scalars['DateTime']['output']>;
  /** The ID of the object. */
  readonly id: Scalars['ObjectID']['output'];
  /** Automatically generated timestamp, updated on every save. */
  readonly updatedAt?: Maybe<Scalars['DateTime']['output']>;
};

/** Base Mutation Type definition - all mutations will be defined in separate files extending this type */
export type Mutation = {
  readonly __typename?: 'Mutation';
  /** IGNORE: Dummy field necessary for the Mutation type to be valid */
  readonly _empty?: Maybe<Scalars['String']['output']>;
};

export type MutationResult = {
  readonly status: MutationStatus;
};

export type MutationStatus = {
  readonly __typename?: 'MutationStatus';
  readonly errorMessage?: Maybe<Scalars['String']['output']>;
  readonly success: Scalars['Boolean']['output'];
};

export type Organization = MongoBase & {
  readonly __typename?: 'Organization';
  readonly createdAt?: Maybe<Scalars['DateTime']['output']>;
  readonly id: Scalars['ObjectID']['output'];
  readonly name: Scalars['String']['output'];
  readonly schemaVersion?: Maybe<Scalars['String']['output']>;
  readonly slug: Scalars['String']['output'];
  readonly updatedAt?: Maybe<Scalars['DateTime']['output']>;
};

export type Product = MongoBase & {
  readonly __typename?: 'Product';
  readonly category?: Maybe<Scalars['String']['output']>;
  readonly cost: Scalars['Float']['output'];
  readonly createdAt?: Maybe<Scalars['DateTime']['output']>;
  readonly description?: Maybe<Scalars['String']['output']>;
  readonly id: Scalars['ObjectID']['output'];
  readonly isActive: Scalars['Boolean']['output'];
  readonly name: Scalars['String']['output'];
  readonly organizationId: Scalars['ObjectID']['output'];
  readonly price: Scalars['Float']['output'];
  readonly reorderPoint: Scalars['Float']['output'];
  readonly schemaVersion?: Maybe<Scalars['String']['output']>;
  readonly sku: Scalars['String']['output'];
  readonly unit: Scalars['String']['output'];
  readonly updatedAt?: Maybe<Scalars['DateTime']['output']>;
};

export type PurchaseOrder = MongoBase & {
  readonly __typename?: 'PurchaseOrder';
  readonly createdAt?: Maybe<Scalars['DateTime']['output']>;
  readonly expectedDeliveryDate?: Maybe<Scalars['DateTime']['output']>;
  readonly id: Scalars['ObjectID']['output'];
  readonly items: ReadonlyArray<PurchaseOrderItem>;
  readonly organizationId: Scalars['ObjectID']['output'];
  readonly schemaVersion?: Maybe<Scalars['String']['output']>;
  readonly status: PurchaseOrderStatus;
  readonly supplierId: Scalars['ObjectID']['output'];
  readonly updatedAt?: Maybe<Scalars['DateTime']['output']>;
  readonly warehouseId: Scalars['ObjectID']['output'];
};

export type PurchaseOrderItem = {
  readonly __typename?: 'PurchaseOrderItem';
  readonly productId: Scalars['ObjectID']['output'];
  readonly quantityOrdered: Scalars['Float']['output'];
  readonly quantityReceived: Scalars['Float']['output'];
  readonly unitCost: Scalars['Float']['output'];
};

export type PurchaseOrderStatus =
  | 'CANCELLED'
  | 'DRAFT'
  | 'PARTIALLY_RECEIVED'
  | 'RECEIVED'
  | 'SUBMITTED';

/** Base Query Type definition - , all mutations will be defined in separate files extending this type */
export type Query = {
  readonly __typename?: 'Query';
  /** IGNORE: Dummy field necessary for the Query type to be valid */
  readonly _empty?: Maybe<Scalars['String']['output']>;
  readonly customerById?: Maybe<Customer>;
  readonly inventoryById?: Maybe<Inventory>;
  readonly organizationById?: Maybe<Organization>;
  readonly productById?: Maybe<Product>;
  readonly purchaseOrderById?: Maybe<PurchaseOrder>;
  readonly salesOrderById?: Maybe<SalesOrder>;
  readonly stockMovementById?: Maybe<StockMovement>;
  readonly supplierById?: Maybe<Supplier>;
  readonly userById?: Maybe<User>;
  readonly warehouseById?: Maybe<Warehouse>;
};


/** Base Query Type definition - , all mutations will be defined in separate files extending this type */
export type QueryCustomerByIdArgs = {
  id: Scalars['ObjectID']['input'];
};


/** Base Query Type definition - , all mutations will be defined in separate files extending this type */
export type QueryInventoryByIdArgs = {
  id: Scalars['ObjectID']['input'];
};


/** Base Query Type definition - , all mutations will be defined in separate files extending this type */
export type QueryOrganizationByIdArgs = {
  id: Scalars['ObjectID']['input'];
};


/** Base Query Type definition - , all mutations will be defined in separate files extending this type */
export type QueryProductByIdArgs = {
  id: Scalars['ObjectID']['input'];
};


/** Base Query Type definition - , all mutations will be defined in separate files extending this type */
export type QueryPurchaseOrderByIdArgs = {
  id: Scalars['ObjectID']['input'];
};


/** Base Query Type definition - , all mutations will be defined in separate files extending this type */
export type QuerySalesOrderByIdArgs = {
  id: Scalars['ObjectID']['input'];
};


/** Base Query Type definition - , all mutations will be defined in separate files extending this type */
export type QueryStockMovementByIdArgs = {
  id: Scalars['ObjectID']['input'];
};


/** Base Query Type definition - , all mutations will be defined in separate files extending this type */
export type QuerySupplierByIdArgs = {
  id: Scalars['ObjectID']['input'];
};


/** Base Query Type definition - , all mutations will be defined in separate files extending this type */
export type QueryUserByIdArgs = {
  id: Scalars['ObjectID']['input'];
};


/** Base Query Type definition - , all mutations will be defined in separate files extending this type */
export type QueryWarehouseByIdArgs = {
  id: Scalars['ObjectID']['input'];
};

export type SalesOrder = MongoBase & {
  readonly __typename?: 'SalesOrder';
  readonly createdAt?: Maybe<Scalars['DateTime']['output']>;
  readonly customerId: Scalars['ObjectID']['output'];
  readonly id: Scalars['ObjectID']['output'];
  readonly items: ReadonlyArray<SalesOrderItem>;
  readonly organizationId: Scalars['ObjectID']['output'];
  readonly schemaVersion?: Maybe<Scalars['String']['output']>;
  readonly status: SalesOrderStatus;
  readonly updatedAt?: Maybe<Scalars['DateTime']['output']>;
};

export type SalesOrderItem = {
  readonly __typename?: 'SalesOrderItem';
  readonly productId: Scalars['ObjectID']['output'];
  readonly quantity: Scalars['Float']['output'];
  readonly unitPrice: Scalars['Float']['output'];
  readonly warehouseId: Scalars['ObjectID']['output'];
};

export type SalesOrderStatus =
  | 'CANCELLED'
  | 'CONFIRMED'
  | 'DRAFT'
  | 'FULFILLED';

export type StockMovement = MongoBase & {
  readonly __typename?: 'StockMovement';
  readonly createdAt?: Maybe<Scalars['DateTime']['output']>;
  readonly id: Scalars['ObjectID']['output'];
  readonly organizationId: Scalars['ObjectID']['output'];
  readonly performedBy?: Maybe<Scalars['ObjectID']['output']>;
  readonly productId: Scalars['ObjectID']['output'];
  readonly quantityChange: Scalars['Float']['output'];
  readonly reason?: Maybe<Scalars['String']['output']>;
  readonly referenceId?: Maybe<Scalars['ObjectID']['output']>;
  readonly schemaVersion?: Maybe<Scalars['String']['output']>;
  readonly type: StockMovementType;
  readonly updatedAt?: Maybe<Scalars['DateTime']['output']>;
  readonly warehouseId: Scalars['ObjectID']['output'];
};

export type StockMovementType =
  | 'ADJUSTMENT'
  | 'RECEIPT'
  | 'SALE'
  | 'TRANSFER_IN'
  | 'TRANSFER_OUT';

export type Supplier = MongoBase & {
  readonly __typename?: 'Supplier';
  readonly address?: Maybe<Address>;
  readonly contactName?: Maybe<Scalars['String']['output']>;
  readonly createdAt?: Maybe<Scalars['DateTime']['output']>;
  readonly email?: Maybe<Scalars['String']['output']>;
  readonly id: Scalars['ObjectID']['output'];
  readonly isActive: Scalars['Boolean']['output'];
  readonly name: Scalars['String']['output'];
  readonly organizationId: Scalars['ObjectID']['output'];
  readonly phone?: Maybe<Scalars['String']['output']>;
  readonly schemaVersion?: Maybe<Scalars['String']['output']>;
  readonly updatedAt?: Maybe<Scalars['DateTime']['output']>;
};

export type User = MongoBase & {
  readonly __typename?: 'User';
  readonly createdAt?: Maybe<Scalars['DateTime']['output']>;
  readonly email: Scalars['String']['output'];
  readonly id: Scalars['ObjectID']['output'];
  readonly isActive: Scalars['Boolean']['output'];
  readonly name: Scalars['String']['output'];
  readonly organizationId: Scalars['ObjectID']['output'];
  readonly role: UserRole;
  readonly schemaVersion?: Maybe<Scalars['String']['output']>;
  readonly updatedAt?: Maybe<Scalars['DateTime']['output']>;
};

export type UserRole =
  | 'ADMIN'
  | 'EMPLOYEE'
  | 'MANAGER'
  | 'VIEWER';

export type Warehouse = MongoBase & {
  readonly __typename?: 'Warehouse';
  readonly address?: Maybe<Address>;
  readonly code: Scalars['String']['output'];
  readonly createdAt?: Maybe<Scalars['DateTime']['output']>;
  readonly id: Scalars['ObjectID']['output'];
  readonly isActive: Scalars['Boolean']['output'];
  readonly name: Scalars['String']['output'];
  readonly organizationId: Scalars['ObjectID']['output'];
  readonly schemaVersion?: Maybe<Scalars['String']['output']>;
  readonly updatedAt?: Maybe<Scalars['DateTime']['output']>;
};

export type WithIndex<TObject> = TObject & Record<string, any>;
export type ResolversObject<TObject> = WithIndex<TObject>;

export type ResolverTypeWrapper<T> = Promise<T> | T;


export type ResolverWithResolve<TResult, TParent, TContext, TArgs> = {
  resolve: ResolverFn<TResult, TParent, TContext, TArgs>;
};
export type Resolver<TResult, TParent = {}, TContext = {}, TArgs = {}> = ResolverFn<TResult, TParent, TContext, TArgs> | ResolverWithResolve<TResult, TParent, TContext, TArgs>;

export type ResolverFn<TResult, TParent, TContext, TArgs> = (
  parent: TParent,
  args: TArgs,
  context: TContext,
  info: GraphQLResolveInfo
) => Promise<TResult> | TResult;

export type SubscriptionSubscribeFn<TResult, TParent, TContext, TArgs> = (
  parent: TParent,
  args: TArgs,
  context: TContext,
  info: GraphQLResolveInfo
) => AsyncIterable<TResult> | Promise<AsyncIterable<TResult>>;

export type SubscriptionResolveFn<TResult, TParent, TContext, TArgs> = (
  parent: TParent,
  args: TArgs,
  context: TContext,
  info: GraphQLResolveInfo
) => TResult | Promise<TResult>;

export interface SubscriptionSubscriberObject<TResult, TKey extends string, TParent, TContext, TArgs> {
  subscribe: SubscriptionSubscribeFn<{ [key in TKey]: TResult }, TParent, TContext, TArgs>;
  resolve?: SubscriptionResolveFn<TResult, { [key in TKey]: TResult }, TContext, TArgs>;
}

export interface SubscriptionResolverObject<TResult, TParent, TContext, TArgs> {
  subscribe: SubscriptionSubscribeFn<any, TParent, TContext, TArgs>;
  resolve: SubscriptionResolveFn<TResult, any, TContext, TArgs>;
}

export type SubscriptionObject<TResult, TKey extends string, TParent, TContext, TArgs> =
  | SubscriptionSubscriberObject<TResult, TKey, TParent, TContext, TArgs>
  | SubscriptionResolverObject<TResult, TParent, TContext, TArgs>;

export type SubscriptionResolver<TResult, TKey extends string, TParent = {}, TContext = {}, TArgs = {}> =
  | ((...args: any[]) => SubscriptionObject<TResult, TKey, TParent, TContext, TArgs>)
  | SubscriptionObject<TResult, TKey, TParent, TContext, TArgs>;

export type TypeResolveFn<TTypes, TParent = {}, TContext = {}> = (
  parent: TParent,
  context: TContext,
  info: GraphQLResolveInfo
) => Maybe<TTypes> | Promise<Maybe<TTypes>>;

export type IsTypeOfResolverFn<T = {}, TContext = {}> = (obj: T, context: TContext, info: GraphQLResolveInfo) => boolean | Promise<boolean>;

export type NextResolverFn<T> = () => Promise<T>;

export type DirectiveResolverFn<TResult = {}, TParent = {}, TContext = {}, TArgs = {}> = (
  next: NextResolverFn<TResult>,
  parent: TParent,
  args: TArgs,
  context: TContext,
  info: GraphQLResolveInfo
) => TResult | Promise<TResult>;


/** Mapping of interface types */
export type ResolversInterfaceTypes<_RefType extends Record<string, unknown>> = ResolversObject<{
  MongoBase: ( import('@invt/domain').Domain.Contexts.Partner.Customer.CustomerEntityReference ) | ( import('@invt/domain').Domain.Contexts.Inventory.Inventory.InventoryEntityReference ) | ( import('@invt/domain').Domain.Contexts.Organization.Organization.OrganizationEntityReference ) | ( import('@invt/domain').Domain.Contexts.Catalog.Product.ProductEntityReference ) | ( import('@invt/domain').Domain.Contexts.Procurement.PurchaseOrder.PurchaseOrderEntityReference ) | ( import('@invt/domain').Domain.Contexts.Sale.SalesOrder.SalesOrderEntityReference ) | ( import('@invt/domain').Domain.Contexts.Inventory.StockMovement.StockMovementEntityReference ) | ( import('@invt/domain').Domain.Contexts.Partner.Supplier.SupplierEntityReference ) | ( import('@invt/domain').Domain.Contexts.User.User.UserEntityReference ) | ( import('@invt/domain').Domain.Contexts.Inventory.Warehouse.WarehouseEntityReference );
  MongoSubdocument: never;
  MutationResult: never;
}>;

/** Mapping between all available schema types and the resolvers types */
export type ResolversTypes = ResolversObject<{
  AccountNumber: ResolverTypeWrapper<Scalars['AccountNumber']['output']>;
  Address: ResolverTypeWrapper<Address>;
  BigInt: ResolverTypeWrapper<Scalars['BigInt']['output']>;
  BlobAuthHeader: ResolverTypeWrapper<BlobAuthHeader>;
  BlobIndexTag: ResolverTypeWrapper<BlobIndexTag>;
  BlobMetadataField: ResolverTypeWrapper<BlobMetadataField>;
  Boolean: ResolverTypeWrapper<Scalars['Boolean']['output']>;
  Byte: ResolverTypeWrapper<Scalars['Byte']['output']>;
  CacheControlScope: CacheControlScope;
  CountryCode: ResolverTypeWrapper<Scalars['CountryCode']['output']>;
  CountryName: ResolverTypeWrapper<Scalars['CountryName']['output']>;
  Cuid: ResolverTypeWrapper<Scalars['Cuid']['output']>;
  Cuid2: ResolverTypeWrapper<Scalars['Cuid2']['output']>;
  Currency: ResolverTypeWrapper<Scalars['Currency']['output']>;
  Customer: ResolverTypeWrapper<import('@invt/domain').Domain.Contexts.Partner.Customer.CustomerEntityReference>;
  DID: ResolverTypeWrapper<Scalars['DID']['output']>;
  Date: ResolverTypeWrapper<Scalars['Date']['output']>;
  DateTime: ResolverTypeWrapper<Scalars['DateTime']['output']>;
  DateTimeISO: ResolverTypeWrapper<Scalars['DateTimeISO']['output']>;
  DeweyDecimal: ResolverTypeWrapper<Scalars['DeweyDecimal']['output']>;
  Duration: ResolverTypeWrapper<Scalars['Duration']['output']>;
  EmailAddress: ResolverTypeWrapper<Scalars['EmailAddress']['output']>;
  Float: ResolverTypeWrapper<Scalars['Float']['output']>;
  GUID: ResolverTypeWrapper<Scalars['GUID']['output']>;
  GeoJSON: ResolverTypeWrapper<Scalars['GeoJSON']['output']>;
  HSL: ResolverTypeWrapper<Scalars['HSL']['output']>;
  HSLA: ResolverTypeWrapper<Scalars['HSLA']['output']>;
  HexColorCode: ResolverTypeWrapper<Scalars['HexColorCode']['output']>;
  Hexadecimal: ResolverTypeWrapper<Scalars['Hexadecimal']['output']>;
  IBAN: ResolverTypeWrapper<Scalars['IBAN']['output']>;
  IP: ResolverTypeWrapper<Scalars['IP']['output']>;
  IPCPatent: ResolverTypeWrapper<Scalars['IPCPatent']['output']>;
  IPv4: ResolverTypeWrapper<Scalars['IPv4']['output']>;
  IPv6: ResolverTypeWrapper<Scalars['IPv6']['output']>;
  ISBN: ResolverTypeWrapper<Scalars['ISBN']['output']>;
  ISO8601Duration: ResolverTypeWrapper<Scalars['ISO8601Duration']['output']>;
  Int: ResolverTypeWrapper<Scalars['Int']['output']>;
  Inventory: ResolverTypeWrapper<import('@invt/domain').Domain.Contexts.Inventory.Inventory.InventoryEntityReference>;
  JSON: ResolverTypeWrapper<Scalars['JSON']['output']>;
  JSONObject: ResolverTypeWrapper<Scalars['JSONObject']['output']>;
  JWT: ResolverTypeWrapper<Scalars['JWT']['output']>;
  LCCSubclass: ResolverTypeWrapper<Scalars['LCCSubclass']['output']>;
  Latitude: ResolverTypeWrapper<Scalars['Latitude']['output']>;
  LocalDate: ResolverTypeWrapper<Scalars['LocalDate']['output']>;
  LocalDateTime: ResolverTypeWrapper<Scalars['LocalDateTime']['output']>;
  LocalEndTime: ResolverTypeWrapper<Scalars['LocalEndTime']['output']>;
  LocalTime: ResolverTypeWrapper<Scalars['LocalTime']['output']>;
  Locale: ResolverTypeWrapper<Scalars['Locale']['output']>;
  Long: ResolverTypeWrapper<Scalars['Long']['output']>;
  Longitude: ResolverTypeWrapper<Scalars['Longitude']['output']>;
  MAC: ResolverTypeWrapper<Scalars['MAC']['output']>;
  MongoBase: ResolverTypeWrapper<ResolversInterfaceTypes<ResolversTypes>['MongoBase']>;
  MongoSubdocument: ResolverTypeWrapper<ResolversInterfaceTypes<ResolversTypes>['MongoSubdocument']>;
  Mutation: ResolverTypeWrapper<{}>;
  MutationResult: ResolverTypeWrapper<ResolversInterfaceTypes<ResolversTypes>['MutationResult']>;
  MutationStatus: ResolverTypeWrapper<MutationStatus>;
  NegativeFloat: ResolverTypeWrapper<Scalars['NegativeFloat']['output']>;
  NegativeInt: ResolverTypeWrapper<Scalars['NegativeInt']['output']>;
  NonEmptyString: ResolverTypeWrapper<Scalars['NonEmptyString']['output']>;
  NonNegativeFloat: ResolverTypeWrapper<Scalars['NonNegativeFloat']['output']>;
  NonNegativeInt: ResolverTypeWrapper<Scalars['NonNegativeInt']['output']>;
  NonPositiveFloat: ResolverTypeWrapper<Scalars['NonPositiveFloat']['output']>;
  NonPositiveInt: ResolverTypeWrapper<Scalars['NonPositiveInt']['output']>;
  ObjectID: ResolverTypeWrapper<Scalars['ObjectID']['output']>;
  Organization: ResolverTypeWrapper<import('@invt/domain').Domain.Contexts.Organization.Organization.OrganizationEntityReference>;
  PhoneNumber: ResolverTypeWrapper<Scalars['PhoneNumber']['output']>;
  Port: ResolverTypeWrapper<Scalars['Port']['output']>;
  PositiveFloat: ResolverTypeWrapper<Scalars['PositiveFloat']['output']>;
  PositiveInt: ResolverTypeWrapper<Scalars['PositiveInt']['output']>;
  PostalCode: ResolverTypeWrapper<Scalars['PostalCode']['output']>;
  Product: ResolverTypeWrapper<import('@invt/domain').Domain.Contexts.Catalog.Product.ProductEntityReference>;
  PurchaseOrder: ResolverTypeWrapper<import('@invt/domain').Domain.Contexts.Procurement.PurchaseOrder.PurchaseOrderEntityReference>;
  PurchaseOrderItem: ResolverTypeWrapper<PurchaseOrderItem>;
  PurchaseOrderStatus: PurchaseOrderStatus;
  Query: ResolverTypeWrapper<{}>;
  RGB: ResolverTypeWrapper<Scalars['RGB']['output']>;
  RGBA: ResolverTypeWrapper<Scalars['RGBA']['output']>;
  RoutingNumber: ResolverTypeWrapper<Scalars['RoutingNumber']['output']>;
  SESSN: ResolverTypeWrapper<Scalars['SESSN']['output']>;
  SafeInt: ResolverTypeWrapper<Scalars['SafeInt']['output']>;
  SalesOrder: ResolverTypeWrapper<import('@invt/domain').Domain.Contexts.Sale.SalesOrder.SalesOrderEntityReference>;
  SalesOrderItem: ResolverTypeWrapper<SalesOrderItem>;
  SalesOrderStatus: SalesOrderStatus;
  SemVer: ResolverTypeWrapper<Scalars['SemVer']['output']>;
  StockMovement: ResolverTypeWrapper<import('@invt/domain').Domain.Contexts.Inventory.StockMovement.StockMovementEntityReference>;
  StockMovementType: StockMovementType;
  String: ResolverTypeWrapper<Scalars['String']['output']>;
  Supplier: ResolverTypeWrapper<import('@invt/domain').Domain.Contexts.Partner.Supplier.SupplierEntityReference>;
  Time: ResolverTypeWrapper<Scalars['Time']['output']>;
  TimeZone: ResolverTypeWrapper<Scalars['TimeZone']['output']>;
  Timestamp: ResolverTypeWrapper<Scalars['Timestamp']['output']>;
  ULID: ResolverTypeWrapper<Scalars['ULID']['output']>;
  URL: ResolverTypeWrapper<Scalars['URL']['output']>;
  USCurrency: ResolverTypeWrapper<Scalars['USCurrency']['output']>;
  UUID: ResolverTypeWrapper<Scalars['UUID']['output']>;
  UnsignedFloat: ResolverTypeWrapper<Scalars['UnsignedFloat']['output']>;
  UnsignedInt: ResolverTypeWrapper<Scalars['UnsignedInt']['output']>;
  User: ResolverTypeWrapper<import('@invt/domain').Domain.Contexts.User.User.UserEntityReference>;
  UserRole: UserRole;
  UtcOffset: ResolverTypeWrapper<Scalars['UtcOffset']['output']>;
  Void: ResolverTypeWrapper<Scalars['Void']['output']>;
  Warehouse: ResolverTypeWrapper<import('@invt/domain').Domain.Contexts.Inventory.Warehouse.WarehouseEntityReference>;
}>;

/** Mapping between all available schema types and the resolvers parents */
export type ResolversParentTypes = ResolversObject<{
  AccountNumber: Scalars['AccountNumber']['output'];
  Address: Address;
  BigInt: Scalars['BigInt']['output'];
  BlobAuthHeader: BlobAuthHeader;
  BlobIndexTag: BlobIndexTag;
  BlobMetadataField: BlobMetadataField;
  Boolean: Scalars['Boolean']['output'];
  Byte: Scalars['Byte']['output'];
  CountryCode: Scalars['CountryCode']['output'];
  CountryName: Scalars['CountryName']['output'];
  Cuid: Scalars['Cuid']['output'];
  Cuid2: Scalars['Cuid2']['output'];
  Currency: Scalars['Currency']['output'];
  Customer: import('@invt/domain').Domain.Contexts.Partner.Customer.CustomerEntityReference;
  DID: Scalars['DID']['output'];
  Date: Scalars['Date']['output'];
  DateTime: Scalars['DateTime']['output'];
  DateTimeISO: Scalars['DateTimeISO']['output'];
  DeweyDecimal: Scalars['DeweyDecimal']['output'];
  Duration: Scalars['Duration']['output'];
  EmailAddress: Scalars['EmailAddress']['output'];
  Float: Scalars['Float']['output'];
  GUID: Scalars['GUID']['output'];
  GeoJSON: Scalars['GeoJSON']['output'];
  HSL: Scalars['HSL']['output'];
  HSLA: Scalars['HSLA']['output'];
  HexColorCode: Scalars['HexColorCode']['output'];
  Hexadecimal: Scalars['Hexadecimal']['output'];
  IBAN: Scalars['IBAN']['output'];
  IP: Scalars['IP']['output'];
  IPCPatent: Scalars['IPCPatent']['output'];
  IPv4: Scalars['IPv4']['output'];
  IPv6: Scalars['IPv6']['output'];
  ISBN: Scalars['ISBN']['output'];
  ISO8601Duration: Scalars['ISO8601Duration']['output'];
  Int: Scalars['Int']['output'];
  Inventory: import('@invt/domain').Domain.Contexts.Inventory.Inventory.InventoryEntityReference;
  JSON: Scalars['JSON']['output'];
  JSONObject: Scalars['JSONObject']['output'];
  JWT: Scalars['JWT']['output'];
  LCCSubclass: Scalars['LCCSubclass']['output'];
  Latitude: Scalars['Latitude']['output'];
  LocalDate: Scalars['LocalDate']['output'];
  LocalDateTime: Scalars['LocalDateTime']['output'];
  LocalEndTime: Scalars['LocalEndTime']['output'];
  LocalTime: Scalars['LocalTime']['output'];
  Locale: Scalars['Locale']['output'];
  Long: Scalars['Long']['output'];
  Longitude: Scalars['Longitude']['output'];
  MAC: Scalars['MAC']['output'];
  MongoBase: ResolversInterfaceTypes<ResolversParentTypes>['MongoBase'];
  MongoSubdocument: ResolversInterfaceTypes<ResolversParentTypes>['MongoSubdocument'];
  Mutation: {};
  MutationResult: ResolversInterfaceTypes<ResolversParentTypes>['MutationResult'];
  MutationStatus: MutationStatus;
  NegativeFloat: Scalars['NegativeFloat']['output'];
  NegativeInt: Scalars['NegativeInt']['output'];
  NonEmptyString: Scalars['NonEmptyString']['output'];
  NonNegativeFloat: Scalars['NonNegativeFloat']['output'];
  NonNegativeInt: Scalars['NonNegativeInt']['output'];
  NonPositiveFloat: Scalars['NonPositiveFloat']['output'];
  NonPositiveInt: Scalars['NonPositiveInt']['output'];
  ObjectID: Scalars['ObjectID']['output'];
  Organization: import('@invt/domain').Domain.Contexts.Organization.Organization.OrganizationEntityReference;
  PhoneNumber: Scalars['PhoneNumber']['output'];
  Port: Scalars['Port']['output'];
  PositiveFloat: Scalars['PositiveFloat']['output'];
  PositiveInt: Scalars['PositiveInt']['output'];
  PostalCode: Scalars['PostalCode']['output'];
  Product: import('@invt/domain').Domain.Contexts.Catalog.Product.ProductEntityReference;
  PurchaseOrder: import('@invt/domain').Domain.Contexts.Procurement.PurchaseOrder.PurchaseOrderEntityReference;
  PurchaseOrderItem: PurchaseOrderItem;
  Query: {};
  RGB: Scalars['RGB']['output'];
  RGBA: Scalars['RGBA']['output'];
  RoutingNumber: Scalars['RoutingNumber']['output'];
  SESSN: Scalars['SESSN']['output'];
  SafeInt: Scalars['SafeInt']['output'];
  SalesOrder: import('@invt/domain').Domain.Contexts.Sale.SalesOrder.SalesOrderEntityReference;
  SalesOrderItem: SalesOrderItem;
  SemVer: Scalars['SemVer']['output'];
  StockMovement: import('@invt/domain').Domain.Contexts.Inventory.StockMovement.StockMovementEntityReference;
  String: Scalars['String']['output'];
  Supplier: import('@invt/domain').Domain.Contexts.Partner.Supplier.SupplierEntityReference;
  Time: Scalars['Time']['output'];
  TimeZone: Scalars['TimeZone']['output'];
  Timestamp: Scalars['Timestamp']['output'];
  ULID: Scalars['ULID']['output'];
  URL: Scalars['URL']['output'];
  USCurrency: Scalars['USCurrency']['output'];
  UUID: Scalars['UUID']['output'];
  UnsignedFloat: Scalars['UnsignedFloat']['output'];
  UnsignedInt: Scalars['UnsignedInt']['output'];
  User: import('@invt/domain').Domain.Contexts.User.User.UserEntityReference;
  UtcOffset: Scalars['UtcOffset']['output'];
  Void: Scalars['Void']['output'];
  Warehouse: import('@invt/domain').Domain.Contexts.Inventory.Warehouse.WarehouseEntityReference;
}>;

export type CacheControl22DirectiveArgs = {
  inheritMaxAge?: Maybe<Scalars['Boolean']['input']>;
  maxAge?: Maybe<Scalars['Int']['input']>;
  scope?: Maybe<CacheControlScope>;
};

export type CacheControl22DirectiveResolver<Result, Parent, ContextType = GraphContext, Args = CacheControl22DirectiveArgs> = DirectiveResolverFn<Result, Parent, ContextType, Args>;

export interface AccountNumberScalarConfig extends GraphQLScalarTypeConfig<ResolversTypes['AccountNumber'], any> {
  name: 'AccountNumber';
}

export type AddressResolvers<ContextType = GraphContext, ParentType extends ResolversParentTypes['Address'] = ResolversParentTypes['Address']> = ResolversObject<{
  city?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  country?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  postalCode?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  state?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>;
  street?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
}>;

export interface BigIntScalarConfig extends GraphQLScalarTypeConfig<ResolversTypes['BigInt'], any> {
  name: 'BigInt';
}

export type BlobAuthHeaderResolvers<ContextType = GraphContext, ParentType extends ResolversParentTypes['BlobAuthHeader'] = ResolversParentTypes['BlobAuthHeader']> = ResolversObject<{
  authHeader?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>;
  blobName?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>;
  blobPath?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>;
  indexTags?: Resolver<Maybe<ReadonlyArray<Maybe<ResolversTypes['BlobIndexTag']>>>, ParentType, ContextType>;
  metadataFields?: Resolver<Maybe<ReadonlyArray<Maybe<ResolversTypes['BlobMetadataField']>>>, ParentType, ContextType>;
  requestDate?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
}>;

export type BlobIndexTagResolvers<ContextType = GraphContext, ParentType extends ResolversParentTypes['BlobIndexTag'] = ResolversParentTypes['BlobIndexTag']> = ResolversObject<{
  name?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  value?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
}>;

export type BlobMetadataFieldResolvers<ContextType = GraphContext, ParentType extends ResolversParentTypes['BlobMetadataField'] = ResolversParentTypes['BlobMetadataField']> = ResolversObject<{
  name?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  value?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
}>;

export interface ByteScalarConfig extends GraphQLScalarTypeConfig<ResolversTypes['Byte'], any> {
  name: 'Byte';
}

export interface CountryCodeScalarConfig extends GraphQLScalarTypeConfig<ResolversTypes['CountryCode'], any> {
  name: 'CountryCode';
}

export interface CountryNameScalarConfig extends GraphQLScalarTypeConfig<ResolversTypes['CountryName'], any> {
  name: 'CountryName';
}

export interface CuidScalarConfig extends GraphQLScalarTypeConfig<ResolversTypes['Cuid'], any> {
  name: 'Cuid';
}

export interface Cuid2ScalarConfig extends GraphQLScalarTypeConfig<ResolversTypes['Cuid2'], any> {
  name: 'Cuid2';
}

export interface CurrencyScalarConfig extends GraphQLScalarTypeConfig<ResolversTypes['Currency'], any> {
  name: 'Currency';
}

export type CustomerResolvers<ContextType = GraphContext, ParentType extends ResolversParentTypes['Customer'] = ResolversParentTypes['Customer']> = ResolversObject<{
  address?: Resolver<Maybe<ResolversTypes['Address']>, ParentType, ContextType>;
  createdAt?: Resolver<Maybe<ResolversTypes['DateTime']>, ParentType, ContextType>;
  email?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>;
  id?: Resolver<ResolversTypes['ObjectID'], ParentType, ContextType>;
  name?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  organizationId?: Resolver<ResolversTypes['ObjectID'], ParentType, ContextType>;
  phone?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>;
  schemaVersion?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>;
  updatedAt?: Resolver<Maybe<ResolversTypes['DateTime']>, ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
}>;

export interface DidScalarConfig extends GraphQLScalarTypeConfig<ResolversTypes['DID'], any> {
  name: 'DID';
}

export interface DateScalarConfig extends GraphQLScalarTypeConfig<ResolversTypes['Date'], any> {
  name: 'Date';
}

export interface DateTimeScalarConfig extends GraphQLScalarTypeConfig<ResolversTypes['DateTime'], any> {
  name: 'DateTime';
}

export interface DateTimeIsoScalarConfig extends GraphQLScalarTypeConfig<ResolversTypes['DateTimeISO'], any> {
  name: 'DateTimeISO';
}

export interface DeweyDecimalScalarConfig extends GraphQLScalarTypeConfig<ResolversTypes['DeweyDecimal'], any> {
  name: 'DeweyDecimal';
}

export interface DurationScalarConfig extends GraphQLScalarTypeConfig<ResolversTypes['Duration'], any> {
  name: 'Duration';
}

export interface EmailAddressScalarConfig extends GraphQLScalarTypeConfig<ResolversTypes['EmailAddress'], any> {
  name: 'EmailAddress';
}

export interface GuidScalarConfig extends GraphQLScalarTypeConfig<ResolversTypes['GUID'], any> {
  name: 'GUID';
}

export interface GeoJsonScalarConfig extends GraphQLScalarTypeConfig<ResolversTypes['GeoJSON'], any> {
  name: 'GeoJSON';
}

export interface HslScalarConfig extends GraphQLScalarTypeConfig<ResolversTypes['HSL'], any> {
  name: 'HSL';
}

export interface HslaScalarConfig extends GraphQLScalarTypeConfig<ResolversTypes['HSLA'], any> {
  name: 'HSLA';
}

export interface HexColorCodeScalarConfig extends GraphQLScalarTypeConfig<ResolversTypes['HexColorCode'], any> {
  name: 'HexColorCode';
}

export interface HexadecimalScalarConfig extends GraphQLScalarTypeConfig<ResolversTypes['Hexadecimal'], any> {
  name: 'Hexadecimal';
}

export interface IbanScalarConfig extends GraphQLScalarTypeConfig<ResolversTypes['IBAN'], any> {
  name: 'IBAN';
}

export interface IpScalarConfig extends GraphQLScalarTypeConfig<ResolversTypes['IP'], any> {
  name: 'IP';
}

export interface IpcPatentScalarConfig extends GraphQLScalarTypeConfig<ResolversTypes['IPCPatent'], any> {
  name: 'IPCPatent';
}

export interface IPv4ScalarConfig extends GraphQLScalarTypeConfig<ResolversTypes['IPv4'], any> {
  name: 'IPv4';
}

export interface IPv6ScalarConfig extends GraphQLScalarTypeConfig<ResolversTypes['IPv6'], any> {
  name: 'IPv6';
}

export interface IsbnScalarConfig extends GraphQLScalarTypeConfig<ResolversTypes['ISBN'], any> {
  name: 'ISBN';
}

export interface Iso8601DurationScalarConfig extends GraphQLScalarTypeConfig<ResolversTypes['ISO8601Duration'], any> {
  name: 'ISO8601Duration';
}

export type InventoryResolvers<ContextType = GraphContext, ParentType extends ResolversParentTypes['Inventory'] = ResolversParentTypes['Inventory']> = ResolversObject<{
  createdAt?: Resolver<Maybe<ResolversTypes['DateTime']>, ParentType, ContextType>;
  id?: Resolver<ResolversTypes['ObjectID'], ParentType, ContextType>;
  organizationId?: Resolver<ResolversTypes['ObjectID'], ParentType, ContextType>;
  productId?: Resolver<ResolversTypes['ObjectID'], ParentType, ContextType>;
  quantityOnHand?: Resolver<ResolversTypes['Float'], ParentType, ContextType>;
  quantityReserved?: Resolver<ResolversTypes['Float'], ParentType, ContextType>;
  schemaVersion?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>;
  updatedAt?: Resolver<Maybe<ResolversTypes['DateTime']>, ParentType, ContextType>;
  warehouseId?: Resolver<ResolversTypes['ObjectID'], ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
}>;

export interface JsonScalarConfig extends GraphQLScalarTypeConfig<ResolversTypes['JSON'], any> {
  name: 'JSON';
}

export interface JsonObjectScalarConfig extends GraphQLScalarTypeConfig<ResolversTypes['JSONObject'], any> {
  name: 'JSONObject';
}

export interface JwtScalarConfig extends GraphQLScalarTypeConfig<ResolversTypes['JWT'], any> {
  name: 'JWT';
}

export interface LccSubclassScalarConfig extends GraphQLScalarTypeConfig<ResolversTypes['LCCSubclass'], any> {
  name: 'LCCSubclass';
}

export interface LatitudeScalarConfig extends GraphQLScalarTypeConfig<ResolversTypes['Latitude'], any> {
  name: 'Latitude';
}

export interface LocalDateScalarConfig extends GraphQLScalarTypeConfig<ResolversTypes['LocalDate'], any> {
  name: 'LocalDate';
}

export interface LocalDateTimeScalarConfig extends GraphQLScalarTypeConfig<ResolversTypes['LocalDateTime'], any> {
  name: 'LocalDateTime';
}

export interface LocalEndTimeScalarConfig extends GraphQLScalarTypeConfig<ResolversTypes['LocalEndTime'], any> {
  name: 'LocalEndTime';
}

export interface LocalTimeScalarConfig extends GraphQLScalarTypeConfig<ResolversTypes['LocalTime'], any> {
  name: 'LocalTime';
}

export interface LocaleScalarConfig extends GraphQLScalarTypeConfig<ResolversTypes['Locale'], any> {
  name: 'Locale';
}

export interface LongScalarConfig extends GraphQLScalarTypeConfig<ResolversTypes['Long'], any> {
  name: 'Long';
}

export interface LongitudeScalarConfig extends GraphQLScalarTypeConfig<ResolversTypes['Longitude'], any> {
  name: 'Longitude';
}

export interface MacScalarConfig extends GraphQLScalarTypeConfig<ResolversTypes['MAC'], any> {
  name: 'MAC';
}

export type MongoBaseResolvers<ContextType = GraphContext, ParentType extends ResolversParentTypes['MongoBase'] = ResolversParentTypes['MongoBase']> = ResolversObject<{
  __resolveType: TypeResolveFn<'Customer' | 'Inventory' | 'Organization' | 'Product' | 'PurchaseOrder' | 'SalesOrder' | 'StockMovement' | 'Supplier' | 'User' | 'Warehouse', ParentType, ContextType>;
  createdAt?: Resolver<Maybe<ResolversTypes['DateTime']>, ParentType, ContextType>;
  id?: Resolver<ResolversTypes['ObjectID'], ParentType, ContextType>;
  schemaVersion?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>;
  updatedAt?: Resolver<Maybe<ResolversTypes['DateTime']>, ParentType, ContextType>;
}>;

export type MongoSubdocumentResolvers<ContextType = GraphContext, ParentType extends ResolversParentTypes['MongoSubdocument'] = ResolversParentTypes['MongoSubdocument']> = ResolversObject<{
  __resolveType: TypeResolveFn<null, ParentType, ContextType>;
  createdAt?: Resolver<Maybe<ResolversTypes['DateTime']>, ParentType, ContextType>;
  id?: Resolver<ResolversTypes['ObjectID'], ParentType, ContextType>;
  updatedAt?: Resolver<Maybe<ResolversTypes['DateTime']>, ParentType, ContextType>;
}>;

export type MutationResolvers<ContextType = GraphContext, ParentType extends ResolversParentTypes['Mutation'] = ResolversParentTypes['Mutation']> = ResolversObject<{
  _empty?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>;
}>;

export type MutationResultResolvers<ContextType = GraphContext, ParentType extends ResolversParentTypes['MutationResult'] = ResolversParentTypes['MutationResult']> = ResolversObject<{
  __resolveType: TypeResolveFn<null, ParentType, ContextType>;
  status?: Resolver<ResolversTypes['MutationStatus'], ParentType, ContextType>;
}>;

export type MutationStatusResolvers<ContextType = GraphContext, ParentType extends ResolversParentTypes['MutationStatus'] = ResolversParentTypes['MutationStatus']> = ResolversObject<{
  errorMessage?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>;
  success?: Resolver<ResolversTypes['Boolean'], ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
}>;

export interface NegativeFloatScalarConfig extends GraphQLScalarTypeConfig<ResolversTypes['NegativeFloat'], any> {
  name: 'NegativeFloat';
}

export interface NegativeIntScalarConfig extends GraphQLScalarTypeConfig<ResolversTypes['NegativeInt'], any> {
  name: 'NegativeInt';
}

export interface NonEmptyStringScalarConfig extends GraphQLScalarTypeConfig<ResolversTypes['NonEmptyString'], any> {
  name: 'NonEmptyString';
}

export interface NonNegativeFloatScalarConfig extends GraphQLScalarTypeConfig<ResolversTypes['NonNegativeFloat'], any> {
  name: 'NonNegativeFloat';
}

export interface NonNegativeIntScalarConfig extends GraphQLScalarTypeConfig<ResolversTypes['NonNegativeInt'], any> {
  name: 'NonNegativeInt';
}

export interface NonPositiveFloatScalarConfig extends GraphQLScalarTypeConfig<ResolversTypes['NonPositiveFloat'], any> {
  name: 'NonPositiveFloat';
}

export interface NonPositiveIntScalarConfig extends GraphQLScalarTypeConfig<ResolversTypes['NonPositiveInt'], any> {
  name: 'NonPositiveInt';
}

export interface ObjectIdScalarConfig extends GraphQLScalarTypeConfig<ResolversTypes['ObjectID'], any> {
  name: 'ObjectID';
}

export type OrganizationResolvers<ContextType = GraphContext, ParentType extends ResolversParentTypes['Organization'] = ResolversParentTypes['Organization']> = ResolversObject<{
  createdAt?: Resolver<Maybe<ResolversTypes['DateTime']>, ParentType, ContextType>;
  id?: Resolver<ResolversTypes['ObjectID'], ParentType, ContextType>;
  name?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  schemaVersion?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>;
  slug?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  updatedAt?: Resolver<Maybe<ResolversTypes['DateTime']>, ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
}>;

export interface PhoneNumberScalarConfig extends GraphQLScalarTypeConfig<ResolversTypes['PhoneNumber'], any> {
  name: 'PhoneNumber';
}

export interface PortScalarConfig extends GraphQLScalarTypeConfig<ResolversTypes['Port'], any> {
  name: 'Port';
}

export interface PositiveFloatScalarConfig extends GraphQLScalarTypeConfig<ResolversTypes['PositiveFloat'], any> {
  name: 'PositiveFloat';
}

export interface PositiveIntScalarConfig extends GraphQLScalarTypeConfig<ResolversTypes['PositiveInt'], any> {
  name: 'PositiveInt';
}

export interface PostalCodeScalarConfig extends GraphQLScalarTypeConfig<ResolversTypes['PostalCode'], any> {
  name: 'PostalCode';
}

export type ProductResolvers<ContextType = GraphContext, ParentType extends ResolversParentTypes['Product'] = ResolversParentTypes['Product']> = ResolversObject<{
  category?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>;
  cost?: Resolver<ResolversTypes['Float'], ParentType, ContextType>;
  createdAt?: Resolver<Maybe<ResolversTypes['DateTime']>, ParentType, ContextType>;
  description?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>;
  id?: Resolver<ResolversTypes['ObjectID'], ParentType, ContextType>;
  isActive?: Resolver<ResolversTypes['Boolean'], ParentType, ContextType>;
  name?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  organizationId?: Resolver<ResolversTypes['ObjectID'], ParentType, ContextType>;
  price?: Resolver<ResolversTypes['Float'], ParentType, ContextType>;
  reorderPoint?: Resolver<ResolversTypes['Float'], ParentType, ContextType>;
  schemaVersion?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>;
  sku?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  unit?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  updatedAt?: Resolver<Maybe<ResolversTypes['DateTime']>, ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
}>;

export type PurchaseOrderResolvers<ContextType = GraphContext, ParentType extends ResolversParentTypes['PurchaseOrder'] = ResolversParentTypes['PurchaseOrder']> = ResolversObject<{
  createdAt?: Resolver<Maybe<ResolversTypes['DateTime']>, ParentType, ContextType>;
  expectedDeliveryDate?: Resolver<Maybe<ResolversTypes['DateTime']>, ParentType, ContextType>;
  id?: Resolver<ResolversTypes['ObjectID'], ParentType, ContextType>;
  items?: Resolver<ReadonlyArray<ResolversTypes['PurchaseOrderItem']>, ParentType, ContextType>;
  organizationId?: Resolver<ResolversTypes['ObjectID'], ParentType, ContextType>;
  schemaVersion?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>;
  status?: Resolver<ResolversTypes['PurchaseOrderStatus'], ParentType, ContextType>;
  supplierId?: Resolver<ResolversTypes['ObjectID'], ParentType, ContextType>;
  updatedAt?: Resolver<Maybe<ResolversTypes['DateTime']>, ParentType, ContextType>;
  warehouseId?: Resolver<ResolversTypes['ObjectID'], ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
}>;

export type PurchaseOrderItemResolvers<ContextType = GraphContext, ParentType extends ResolversParentTypes['PurchaseOrderItem'] = ResolversParentTypes['PurchaseOrderItem']> = ResolversObject<{
  productId?: Resolver<ResolversTypes['ObjectID'], ParentType, ContextType>;
  quantityOrdered?: Resolver<ResolversTypes['Float'], ParentType, ContextType>;
  quantityReceived?: Resolver<ResolversTypes['Float'], ParentType, ContextType>;
  unitCost?: Resolver<ResolversTypes['Float'], ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
}>;

export type QueryResolvers<ContextType = GraphContext, ParentType extends ResolversParentTypes['Query'] = ResolversParentTypes['Query']> = ResolversObject<{
  _empty?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>;
  customerById?: Resolver<Maybe<ResolversTypes['Customer']>, ParentType, ContextType, RequireFields<QueryCustomerByIdArgs, 'id'>>;
  inventoryById?: Resolver<Maybe<ResolversTypes['Inventory']>, ParentType, ContextType, RequireFields<QueryInventoryByIdArgs, 'id'>>;
  organizationById?: Resolver<Maybe<ResolversTypes['Organization']>, ParentType, ContextType, RequireFields<QueryOrganizationByIdArgs, 'id'>>;
  productById?: Resolver<Maybe<ResolversTypes['Product']>, ParentType, ContextType, RequireFields<QueryProductByIdArgs, 'id'>>;
  purchaseOrderById?: Resolver<Maybe<ResolversTypes['PurchaseOrder']>, ParentType, ContextType, RequireFields<QueryPurchaseOrderByIdArgs, 'id'>>;
  salesOrderById?: Resolver<Maybe<ResolversTypes['SalesOrder']>, ParentType, ContextType, RequireFields<QuerySalesOrderByIdArgs, 'id'>>;
  stockMovementById?: Resolver<Maybe<ResolversTypes['StockMovement']>, ParentType, ContextType, RequireFields<QueryStockMovementByIdArgs, 'id'>>;
  supplierById?: Resolver<Maybe<ResolversTypes['Supplier']>, ParentType, ContextType, RequireFields<QuerySupplierByIdArgs, 'id'>>;
  userById?: Resolver<Maybe<ResolversTypes['User']>, ParentType, ContextType, RequireFields<QueryUserByIdArgs, 'id'>>;
  warehouseById?: Resolver<Maybe<ResolversTypes['Warehouse']>, ParentType, ContextType, RequireFields<QueryWarehouseByIdArgs, 'id'>>;
}>;

export interface RgbScalarConfig extends GraphQLScalarTypeConfig<ResolversTypes['RGB'], any> {
  name: 'RGB';
}

export interface RgbaScalarConfig extends GraphQLScalarTypeConfig<ResolversTypes['RGBA'], any> {
  name: 'RGBA';
}

export interface RoutingNumberScalarConfig extends GraphQLScalarTypeConfig<ResolversTypes['RoutingNumber'], any> {
  name: 'RoutingNumber';
}

export interface SessnScalarConfig extends GraphQLScalarTypeConfig<ResolversTypes['SESSN'], any> {
  name: 'SESSN';
}

export interface SafeIntScalarConfig extends GraphQLScalarTypeConfig<ResolversTypes['SafeInt'], any> {
  name: 'SafeInt';
}

export type SalesOrderResolvers<ContextType = GraphContext, ParentType extends ResolversParentTypes['SalesOrder'] = ResolversParentTypes['SalesOrder']> = ResolversObject<{
  createdAt?: Resolver<Maybe<ResolversTypes['DateTime']>, ParentType, ContextType>;
  customerId?: Resolver<ResolversTypes['ObjectID'], ParentType, ContextType>;
  id?: Resolver<ResolversTypes['ObjectID'], ParentType, ContextType>;
  items?: Resolver<ReadonlyArray<ResolversTypes['SalesOrderItem']>, ParentType, ContextType>;
  organizationId?: Resolver<ResolversTypes['ObjectID'], ParentType, ContextType>;
  schemaVersion?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>;
  status?: Resolver<ResolversTypes['SalesOrderStatus'], ParentType, ContextType>;
  updatedAt?: Resolver<Maybe<ResolversTypes['DateTime']>, ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
}>;

export type SalesOrderItemResolvers<ContextType = GraphContext, ParentType extends ResolversParentTypes['SalesOrderItem'] = ResolversParentTypes['SalesOrderItem']> = ResolversObject<{
  productId?: Resolver<ResolversTypes['ObjectID'], ParentType, ContextType>;
  quantity?: Resolver<ResolversTypes['Float'], ParentType, ContextType>;
  unitPrice?: Resolver<ResolversTypes['Float'], ParentType, ContextType>;
  warehouseId?: Resolver<ResolversTypes['ObjectID'], ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
}>;

export interface SemVerScalarConfig extends GraphQLScalarTypeConfig<ResolversTypes['SemVer'], any> {
  name: 'SemVer';
}

export type StockMovementResolvers<ContextType = GraphContext, ParentType extends ResolversParentTypes['StockMovement'] = ResolversParentTypes['StockMovement']> = ResolversObject<{
  createdAt?: Resolver<Maybe<ResolversTypes['DateTime']>, ParentType, ContextType>;
  id?: Resolver<ResolversTypes['ObjectID'], ParentType, ContextType>;
  organizationId?: Resolver<ResolversTypes['ObjectID'], ParentType, ContextType>;
  performedBy?: Resolver<Maybe<ResolversTypes['ObjectID']>, ParentType, ContextType>;
  productId?: Resolver<ResolversTypes['ObjectID'], ParentType, ContextType>;
  quantityChange?: Resolver<ResolversTypes['Float'], ParentType, ContextType>;
  reason?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>;
  referenceId?: Resolver<Maybe<ResolversTypes['ObjectID']>, ParentType, ContextType>;
  schemaVersion?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>;
  type?: Resolver<ResolversTypes['StockMovementType'], ParentType, ContextType>;
  updatedAt?: Resolver<Maybe<ResolversTypes['DateTime']>, ParentType, ContextType>;
  warehouseId?: Resolver<ResolversTypes['ObjectID'], ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
}>;

export type SupplierResolvers<ContextType = GraphContext, ParentType extends ResolversParentTypes['Supplier'] = ResolversParentTypes['Supplier']> = ResolversObject<{
  address?: Resolver<Maybe<ResolversTypes['Address']>, ParentType, ContextType>;
  contactName?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>;
  createdAt?: Resolver<Maybe<ResolversTypes['DateTime']>, ParentType, ContextType>;
  email?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>;
  id?: Resolver<ResolversTypes['ObjectID'], ParentType, ContextType>;
  isActive?: Resolver<ResolversTypes['Boolean'], ParentType, ContextType>;
  name?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  organizationId?: Resolver<ResolversTypes['ObjectID'], ParentType, ContextType>;
  phone?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>;
  schemaVersion?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>;
  updatedAt?: Resolver<Maybe<ResolversTypes['DateTime']>, ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
}>;

export interface TimeScalarConfig extends GraphQLScalarTypeConfig<ResolversTypes['Time'], any> {
  name: 'Time';
}

export interface TimeZoneScalarConfig extends GraphQLScalarTypeConfig<ResolversTypes['TimeZone'], any> {
  name: 'TimeZone';
}

export interface TimestampScalarConfig extends GraphQLScalarTypeConfig<ResolversTypes['Timestamp'], any> {
  name: 'Timestamp';
}

export interface UlidScalarConfig extends GraphQLScalarTypeConfig<ResolversTypes['ULID'], any> {
  name: 'ULID';
}

export interface UrlScalarConfig extends GraphQLScalarTypeConfig<ResolversTypes['URL'], any> {
  name: 'URL';
}

export interface UsCurrencyScalarConfig extends GraphQLScalarTypeConfig<ResolversTypes['USCurrency'], any> {
  name: 'USCurrency';
}

export interface UuidScalarConfig extends GraphQLScalarTypeConfig<ResolversTypes['UUID'], any> {
  name: 'UUID';
}

export interface UnsignedFloatScalarConfig extends GraphQLScalarTypeConfig<ResolversTypes['UnsignedFloat'], any> {
  name: 'UnsignedFloat';
}

export interface UnsignedIntScalarConfig extends GraphQLScalarTypeConfig<ResolversTypes['UnsignedInt'], any> {
  name: 'UnsignedInt';
}

export type UserResolvers<ContextType = GraphContext, ParentType extends ResolversParentTypes['User'] = ResolversParentTypes['User']> = ResolversObject<{
  createdAt?: Resolver<Maybe<ResolversTypes['DateTime']>, ParentType, ContextType>;
  email?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  id?: Resolver<ResolversTypes['ObjectID'], ParentType, ContextType>;
  isActive?: Resolver<ResolversTypes['Boolean'], ParentType, ContextType>;
  name?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  organizationId?: Resolver<ResolversTypes['ObjectID'], ParentType, ContextType>;
  role?: Resolver<ResolversTypes['UserRole'], ParentType, ContextType>;
  schemaVersion?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>;
  updatedAt?: Resolver<Maybe<ResolversTypes['DateTime']>, ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
}>;

export interface UtcOffsetScalarConfig extends GraphQLScalarTypeConfig<ResolversTypes['UtcOffset'], any> {
  name: 'UtcOffset';
}

export interface VoidScalarConfig extends GraphQLScalarTypeConfig<ResolversTypes['Void'], any> {
  name: 'Void';
}

export type WarehouseResolvers<ContextType = GraphContext, ParentType extends ResolversParentTypes['Warehouse'] = ResolversParentTypes['Warehouse']> = ResolversObject<{
  address?: Resolver<Maybe<ResolversTypes['Address']>, ParentType, ContextType>;
  code?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  createdAt?: Resolver<Maybe<ResolversTypes['DateTime']>, ParentType, ContextType>;
  id?: Resolver<ResolversTypes['ObjectID'], ParentType, ContextType>;
  isActive?: Resolver<ResolversTypes['Boolean'], ParentType, ContextType>;
  name?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  organizationId?: Resolver<ResolversTypes['ObjectID'], ParentType, ContextType>;
  schemaVersion?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>;
  updatedAt?: Resolver<Maybe<ResolversTypes['DateTime']>, ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
}>;

export type Resolvers<ContextType = GraphContext> = ResolversObject<{
  AccountNumber?: GraphQLScalarType;
  Address?: AddressResolvers<ContextType>;
  BigInt?: GraphQLScalarType;
  BlobAuthHeader?: BlobAuthHeaderResolvers<ContextType>;
  BlobIndexTag?: BlobIndexTagResolvers<ContextType>;
  BlobMetadataField?: BlobMetadataFieldResolvers<ContextType>;
  Byte?: GraphQLScalarType;
  CountryCode?: GraphQLScalarType;
  CountryName?: GraphQLScalarType;
  Cuid?: GraphQLScalarType;
  Cuid2?: GraphQLScalarType;
  Currency?: GraphQLScalarType;
  Customer?: CustomerResolvers<ContextType>;
  DID?: GraphQLScalarType;
  Date?: GraphQLScalarType;
  DateTime?: GraphQLScalarType;
  DateTimeISO?: GraphQLScalarType;
  DeweyDecimal?: GraphQLScalarType;
  Duration?: GraphQLScalarType;
  EmailAddress?: GraphQLScalarType;
  GUID?: GraphQLScalarType;
  GeoJSON?: GraphQLScalarType;
  HSL?: GraphQLScalarType;
  HSLA?: GraphQLScalarType;
  HexColorCode?: GraphQLScalarType;
  Hexadecimal?: GraphQLScalarType;
  IBAN?: GraphQLScalarType;
  IP?: GraphQLScalarType;
  IPCPatent?: GraphQLScalarType;
  IPv4?: GraphQLScalarType;
  IPv6?: GraphQLScalarType;
  ISBN?: GraphQLScalarType;
  ISO8601Duration?: GraphQLScalarType;
  Inventory?: InventoryResolvers<ContextType>;
  JSON?: GraphQLScalarType;
  JSONObject?: GraphQLScalarType;
  JWT?: GraphQLScalarType;
  LCCSubclass?: GraphQLScalarType;
  Latitude?: GraphQLScalarType;
  LocalDate?: GraphQLScalarType;
  LocalDateTime?: GraphQLScalarType;
  LocalEndTime?: GraphQLScalarType;
  LocalTime?: GraphQLScalarType;
  Locale?: GraphQLScalarType;
  Long?: GraphQLScalarType;
  Longitude?: GraphQLScalarType;
  MAC?: GraphQLScalarType;
  MongoBase?: MongoBaseResolvers<ContextType>;
  MongoSubdocument?: MongoSubdocumentResolvers<ContextType>;
  Mutation?: MutationResolvers<ContextType>;
  MutationResult?: MutationResultResolvers<ContextType>;
  MutationStatus?: MutationStatusResolvers<ContextType>;
  NegativeFloat?: GraphQLScalarType;
  NegativeInt?: GraphQLScalarType;
  NonEmptyString?: GraphQLScalarType;
  NonNegativeFloat?: GraphQLScalarType;
  NonNegativeInt?: GraphQLScalarType;
  NonPositiveFloat?: GraphQLScalarType;
  NonPositiveInt?: GraphQLScalarType;
  ObjectID?: GraphQLScalarType;
  Organization?: OrganizationResolvers<ContextType>;
  PhoneNumber?: GraphQLScalarType;
  Port?: GraphQLScalarType;
  PositiveFloat?: GraphQLScalarType;
  PositiveInt?: GraphQLScalarType;
  PostalCode?: GraphQLScalarType;
  Product?: ProductResolvers<ContextType>;
  PurchaseOrder?: PurchaseOrderResolvers<ContextType>;
  PurchaseOrderItem?: PurchaseOrderItemResolvers<ContextType>;
  Query?: QueryResolvers<ContextType>;
  RGB?: GraphQLScalarType;
  RGBA?: GraphQLScalarType;
  RoutingNumber?: GraphQLScalarType;
  SESSN?: GraphQLScalarType;
  SafeInt?: GraphQLScalarType;
  SalesOrder?: SalesOrderResolvers<ContextType>;
  SalesOrderItem?: SalesOrderItemResolvers<ContextType>;
  SemVer?: GraphQLScalarType;
  StockMovement?: StockMovementResolvers<ContextType>;
  Supplier?: SupplierResolvers<ContextType>;
  Time?: GraphQLScalarType;
  TimeZone?: GraphQLScalarType;
  Timestamp?: GraphQLScalarType;
  ULID?: GraphQLScalarType;
  URL?: GraphQLScalarType;
  USCurrency?: GraphQLScalarType;
  UUID?: GraphQLScalarType;
  UnsignedFloat?: GraphQLScalarType;
  UnsignedInt?: GraphQLScalarType;
  User?: UserResolvers<ContextType>;
  UtcOffset?: GraphQLScalarType;
  Void?: GraphQLScalarType;
  Warehouse?: WarehouseResolvers<ContextType>;
}>;

export type DirectiveResolvers<ContextType = GraphContext> = ResolversObject<{
  cacheControl22?: CacheControl22DirectiveResolver<any, any, ContextType>;
}>;
