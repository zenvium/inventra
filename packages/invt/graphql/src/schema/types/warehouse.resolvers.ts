import type { Resolvers } from '../builder/generated.ts';

const resolvers: Resolvers = {
	Query: {
		warehouseById: (_parent, args: { id: string }, context) => context.applicationServices.Inventory.Warehouse.queryById({ id: args.id }),
	},
};

export default resolvers;
