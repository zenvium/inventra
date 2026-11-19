import type { Resolvers } from '../builder/generated.ts';

const resolvers: Resolvers = {
	Query: {
		customerById: (_parent, args: { id: string }, context) => context.applicationServices.Partner.Customer.queryById({ id: args.id }),
	},
};

export default resolvers;
