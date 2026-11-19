import type { Resolvers } from '../builder/generated.ts';

const resolvers: Resolvers = {
	Query: {
		userById: (_parent, args: { id: string }, context) => context.applicationServices.User.User.queryById({ id: args.id }),
	},
};

export default resolvers;
