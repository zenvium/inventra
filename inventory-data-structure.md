# Inventory

Use this file as the plain-text source structure for the Cellix Rosetta skill. It represents the supplied TypeScript interfaces; `Inventory` is the context.

## Translation notes

- Context: `inventory`.
- Each top-level entity below is a subdomain. Collection names are intentionally omitted because the source interfaces do not specify them. When creating a model, ask for the collection names; when updating one, use the existing mongoose model's collection.
- `ID` is an alias for `string`. ID-valued fields therefore remain strings unless the product model explicitly defines a reference.
- The top-level TypeScript `id: ID` is the aggregate identity. It is represented as the standard root `_id` row for persistence; it is not an additional aggregate field.
- `Rules / Notes` on each `_id` row records the source property name that was mapped to the persistence identity.
- `createdAt` and `updatedAt` are standard generated timestamps. Fields ending in `?` are optional. Literal unions are closed accepted-value lists.
- `Address`, `PurchaseOrderItem`, and `SalesOrderItem` are embedded value structures. Item arrays have no declared item identity and are value arrays.

## Organization

### Properties
- `_id` — `ObjectId; required; unique; system-generated` | Rules / Notes: source property `id: ID`
- `name` — `string; required`
- `slug` — `string; required`
- `createdAt` — `timestamp; required; system-generated`
- `updatedAt` — `timestamp; required; system-generated`

## User

### Properties
- `_id` — `ObjectId; required; unique; system-generated` | Rules / Notes: source property `id: ID`
- `organizationId` — `string; required`
- `name` — `string; required`
- `email` — `string; required`
- `role` — `string; required; accepted values: ADMIN, MANAGER, EMPLOYEE, VIEWER`
- `isActive` — `boolean; required`
- `createdAt` — `timestamp; required; system-generated`
- `updatedAt` — `timestamp; required; system-generated`

## Product

### Properties
- `_id` — `ObjectId; required; unique; system-generated` | Rules / Notes: source property `id: ID`
- `organizationId` — `string; required`
- `sku` — `string; required`
- `name` — `string; required`
- `description` — `string; optional`
- `category` — `string; optional`
- `price` — `number; required`
- `cost` — `number; required`
- `unit` — `string; required`
- `reorderPoint` — `number; required`
- `isActive` — `boolean; required`
- `createdAt` — `timestamp; required; system-generated`
- `updatedAt` — `timestamp; required; system-generated`

## Warehouse

### Properties
- `_id` — `ObjectId; required; unique; system-generated` | Rules / Notes: source property `id: ID`
- `organizationId` — `string; required`
- `name` — `string; required`
- `code` — `string; required`
- `address {` — `object; optional; embedded object`
  - `street` — `string; required`
  - `city` — `string; required`
  - `state` — `string; optional`
  - `postalCode` — `string; required`
  - `country` — `string; required`
- `}`
- `isActive` — `boolean; required`
- `createdAt` — `timestamp; required; system-generated`
- `updatedAt` — `timestamp; required; system-generated`

## Inventory

### Properties
- `_id` — `ObjectId; required; unique; system-generated` | Rules / Notes: source property `id: ID`
- `organizationId` — `string; required`
- `productId` — `string; required`
- `warehouseId` — `string; required`
- `quantityOnHand` — `number; required`
- `quantityReserved` — `number; required`
- `updatedAt` — `timestamp; required; system-generated`

## Supplier

### Properties
- `_id` — `ObjectId; required; unique; system-generated` | Rules / Notes: source property `id: ID`
- `organizationId` — `string; required`
- `name` — `string; required`
- `contactName` — `string; optional`
- `email` — `string; optional`
- `phone` — `string; optional`
- `address {` — `object; optional; embedded object`
  - `street` — `string; required`
  - `city` — `string; required`
  - `state` — `string; optional`
  - `postalCode` — `string; required`
  - `country` — `string; required`
- `}`
- `isActive` — `boolean; required`
- `createdAt` — `timestamp; required; system-generated`
- `updatedAt` — `timestamp; required; system-generated`

## Customer

### Properties
- `_id` — `ObjectId; required; unique; system-generated` | Rules / Notes: source property `id: ID`
- `organizationId` — `string; required`
- `name` — `string; required`
- `email` — `string; optional`
- `phone` — `string; optional`
- `address {` — `object; optional; embedded object`
  - `street` — `string; required`
  - `city` — `string; required`
  - `state` — `string; optional`
  - `postalCode` — `string; required`
  - `country` — `string; required`
- `}`
- `createdAt` — `timestamp; required; system-generated`
- `updatedAt` — `timestamp; required; system-generated`

## Purchase Order

### Properties
- `_id` — `ObjectId; required; unique; system-generated` | Rules / Notes: source property `id: ID`
- `organizationId` — `string; required`
- `supplierId` — `string; required`
- `warehouseId` — `string; required`
- `status` — `string; required; accepted values: DRAFT, SUBMITTED, PARTIALLY_RECEIVED, RECEIVED, CANCELLED`
- `items [{`
  - `productId` — `string; required`
  - `quantityOrdered` — `number; required`
  - `quantityReceived` — `number; required`
  - `unitCost` — `number; required`
- `}]`
- `expectedDeliveryDate` — `date; optional`
- `createdAt` — `timestamp; required; system-generated`
- `updatedAt` — `timestamp; required; system-generated`

## Sales Order

### Properties
- `_id` — `ObjectId; required; unique; system-generated` | Rules / Notes: source property `id: ID`
- `organizationId` — `string; required`
- `customerId` — `string; required`
- `status` — `string; required; accepted values: DRAFT, CONFIRMED, FULFILLED, CANCELLED`
- `items [{`
  - `productId` — `string; required`
  - `warehouseId` — `string; required`
  - `quantity` — `number; required`
  - `unitPrice` — `number; required`
- `}]`
- `createdAt` — `timestamp; required; system-generated`
- `updatedAt` — `timestamp; required; system-generated`

## Stock Movement

### Properties
- `_id` — `ObjectId; required; unique; system-generated` | Rules / Notes: source property `id: ID`
- `organizationId` — `string; required`
- `productId` — `string; required`
- `warehouseId` — `string; required`
- `type` — `string; required; accepted values: RECEIPT, SALE, ADJUSTMENT, TRANSFER_IN, TRANSFER_OUT`
- `quantityChange` — `number; required`
- `referenceId` — `string; optional`
- `reason` — `string; optional`
- `performedBy` — `string; optional`
- `createdAt` — `timestamp; required; system-generated`
