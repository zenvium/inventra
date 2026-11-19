import type { Resolvers } from '../builder/generated.ts';

const resolvers: Resolvers = {
	Query: {
		supplierById: (_parent, args: { id: string }, context) => context.applicationServices.Partner.Supplier.queryById({ id: args.id }),
	},
};

export default resolvers;
