import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { describeGraphqlLayoutTests } from '@invt-verification/archunit-tests/graphql';

const graphqlRoot = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '../schema/types');
const files = ['customer', 'inventory', 'organization', 'product', 'purchase-order', 'sales-order', 'stock-movement', 'supplier', 'user', 'warehouse'].map((name) => path.join(graphqlRoot, `${name}.graphql`));

describeGraphqlLayoutTests({ files });
