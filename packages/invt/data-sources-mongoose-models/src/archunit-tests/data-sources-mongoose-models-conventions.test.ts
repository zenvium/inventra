import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { describeModelsLayoutTests } from '@invt-verification/archunit-tests/data-sources-mongoose-models';

const modelsRoot = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');

describeModelsLayoutTests({ modelsRoot });
