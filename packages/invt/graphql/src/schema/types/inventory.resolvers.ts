import type { Resolvers } from '../builder/generated.ts';

const resolvers: Resolvers = {
	Query: {
		inventoryById: (_parent, args: { id: string }, context) => context.applicationServices.Inventory.Inventory.queryById({ id: args.id }),
	},
};

export default resolvers;
