import { buildCellixSchema } from '@cellix/graphql-codegen';
import type { GraphQLSchema } from 'graphql';
import type { GraphContext } from '../context.ts';
import { resolvers } from './resolver-builder.ts';
import { invtGraphqlTypeDefs } from './schema-type-defs.generated.ts';

export const combinedSchema: GraphQLSchema = buildCellixSchema<GraphContext>([...invtGraphqlTypeDefs], [resolvers]);
