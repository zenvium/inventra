import type { Resolvers } from '../builder/generated.ts';

const resolvers: Resolvers = {
	Query: {
		purchaseOrderById: (_parent, args: { id: string }, context) => context.applicationServices.Procurement.PurchaseOrder.queryById({ id: args.id }),
	},
};

export default resolvers;
