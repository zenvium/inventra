import type { Resolvers } from '../builder/generated.ts';

const resolvers: Resolvers = {
	Query: {
		organizationById: (_parent, args: { id: string }, context) => context.applicationServices.Organization.Organization.queryById({ id: args.id }),
	},
};

export default resolvers;
