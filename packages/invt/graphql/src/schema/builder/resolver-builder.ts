import { mergeResolvers } from '@graphql-tools/merge';
import type { Resolvers } from './generated.ts';
import { invtGraphqlResolvers } from './resolver-manifest.generated.ts';

export const resolvers = mergeResolvers(invtGraphqlResolvers) as Resolvers;
