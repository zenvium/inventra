import type { Resolvers } from '../builder/generated.ts';

const resolvers: Resolvers = {
	Query: {
		stockMovementById: (_parent, args: { id: string }, context) => context.applicationServices.Inventory.StockMovement.queryById({ id: args.id }),
	},
};

export default resolvers;
