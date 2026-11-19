import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { describeApiCompositionTests } from '@invt-verification/archunit-tests/api-composition';

const compositionFile = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '../index.ts');

describeApiCompositionTests({ compositionFile });
