import type { Resolvers } from '../builder/generated.ts';

const resolvers: Resolvers = {
	Query: {
		salesOrderById: (_parent, args: { id: string }, context) => context.applicationServices.Sale.SalesOrder.queryById({ id: args.id }),
	},
};

export default resolvers;
